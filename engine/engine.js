// NoInstallPlayer — motor "abre de tudo".
// O que o browser não toca sozinho passa por aqui, à maneira do servidor de onde isto vem:
//  - ffmpeg (WebAssembly, carregado só quando é preciso) converte aos bocados para MP4 fragmentado
//    (H.264 + AAC estéreo) e cada bocado vai para o <video> por MediaSource — dá para saltar no tempo;
//  - H.264 (MKV/TS/AVI…) só muda de contentor (cópia, rápido); o resto é recodificado (libx264 ultrafast);
//  - MPEG-2 de DVD é desentrelaçado; DTS/AC3 5.1 são misturados para estéreo com limitador;
//  - DVD/VOB/MPEG-PS/TS e DTS-CD saltam por bytes (os tempos recomeçam entre células/partes);
//  - imagens .iso, pastas VIDEO_TS/BDMV, DTS-CD e folhas .cue são lidos no disc-worker (UDF/ISO9660 em JS puro).
import { FFmpeg } from '../vendor/ffmpeg/index.js';

const here = (p) => new URL(p, import.meta.url).href;

/* ---------------- disc-worker (ISO/UDF, DTS-CD, .cue) ---------------- */
let worker, wid = 0; const pending = new Map();
function call(op, args) {
  if (!worker) {
    worker = new Worker(here('./disc-worker.js'));
    worker.onmessage = (e) => { const p = pending.get(e.data.id); if (!p) return; pending.delete(e.data.id); e.data.ok ? p.res(e.data.result) : p.rej(Object.assign(new Error(e.data.error), { code: e.data.code })); };
  }
  return new Promise((res, rej) => { const id = ++wid; pending.set(id, { res, rej }); worker.postMessage({ id, op, args }); });
}

/** Imagem de disco → fonte para o motor (o título principal como um Blob "virtual" de fatias do .iso). */
export async function openImage(file) {
  const r = await call('image', { file });
  if (r.error) throw new Error(r.error);
  if (r.encrypted) throw Object.assign(new Error('Este DVD está protegido contra cópia (CSS) e não pode ser convertido.'), { code: 'ENCRYPTED' });
  const pieces = [];
  for (const ranges of r.parts) for (const [a, b] of ranges) pieces.push(file.slice(a, b));
  const ext = r.kind === 'bluray' ? 'm2ts' : r.kind === 'vcd' ? 'mpg' : (r.names[0].split('.').pop() || 'vob').toLowerCase();
  return { blob: new Blob(pieces), ext, mode: ['dvd', 'vcd', 'bluray'].includes(r.kind) || /^(vob|mpg|mpeg|m2ts|mts|ts|dat)$/.test(ext) ? 'bytes' : 'time', kind: r.kind, label: r.label };
}
/** Pasta (VIDEO_TS / BDMV / VCD) → fonte para o motor. files: [{path, size, file}] */
export async function openFolder(files) {
  const r = await call('folder', { files });
  if (r.error) throw new Error(r.error);
  if (r.encrypted) throw Object.assign(new Error('Este DVD está protegido contra cópia (CSS) e não pode ser convertido.'), { code: 'ENCRYPTED' });
  const byPath = new Map(files.map((f) => [f.path, f.file]));
  const parts = r.names.map((n) => byPath.get(n));
  const ext = (r.names[0].split('.').pop() || 'vob').toLowerCase();
  return { blob: new Blob(parts), ext, mode: /^(vob|mpg|mpeg|m2ts|mts|ts|dat)$/.test(ext) ? 'bytes' : 'time', kind: r.kind };
}
export const sniffDts = (file) => call('dts', { file }).catch(() => null);
export const parseCue = (file, audio) => call('cue', { file, audio }).then((r) => r.cue);

/* ---------------- ffmpeg.wasm ---------------- */
let ffP = null, busy = Promise.resolve(), logs = [];
async function getFF(ui) {
  if (!ffP) ffP = (async () => {
    const ff = new FFmpeg();
    ff.on('log', ({ message }) => { logs.push(message); if (logs.length > 400) logs.shift(); });
    // descarrega o núcleo (~31 MB, fica em cache do browser) com progresso
    const res = await fetch(here('../vendor/ffmpeg-core/ffmpeg-core.wasm'));
    const total = +res.headers.get('content-length') || 32e6; let got = 0; const chunks = [];
    const rd = res.body.getReader();
    for (;;) { const { done, value } = await rd.read(); if (done) break; chunks.push(value); got += value.length; ui?.status?.(`A preparar o conversor… ${Math.min(99, Math.round((got / total) * 100))}%`); }
    const wasmURL = URL.createObjectURL(new Blob(chunks, { type: 'application/wasm' }));
    await ff.load({ coreURL: here('../vendor/ffmpeg-core/ffmpeg-core.js'), wasmURL });
    await ff.createDir('/in').catch(() => {});
    await ff.createDir('/c').catch(() => {});
    return ff;
  })().catch((e) => { ffP = null; throw e; });
  return ffP;
}
/** Uma tarefa ffmpeg de cada vez (há um só núcleo). */
function serial(fn) { const p = busy.then(fn, fn); busy = p.catch(() => {}); return p; }

async function mountAt(ff, dir, name, blob) {
  try { await ff.unmount(dir); } catch { /* não estava montado */ }
  await ff.mount('WORKERFS', { blobs: [{ name, data: blob }] }, dir);
  return `${dir}/${name}`;
}

function parseProbe(text) {
  const d = text.match(/Duration:\s*(\d+):(\d+):([\d.]+)/), st = text.match(/start:\s*(-?[\d.]+)/);
  const v = [...text.matchAll(/Stream #\S+.*?: Video: (\w+)([^\n]*)/g)].find((m) => !/attached pic/.test(m[2]));
  const a = text.match(/Stream #\S+.*?: Audio: (\w+)[^\n]*?(?:, (\d+) Hz)?, ([^,\n]+)/);
  const size = v && v[2].match(/(\d{2,5})x(\d{2,5})/), fps = v && v[2].match(/([\d.]+) fps/);
  return {
    duration: d ? +d[1] * 3600 + +d[2] * 60 + +d[3] : NaN, start: st ? +st[1] : 0,
    vcodec: v ? v[1] : null, width: size ? +size[1] : 0, height: size ? +size[2] : 0, fps: fps ? +fps[1] : 25,
    interlaced: !!(v && /top first|bottom first|interlaced/.test(v[2])),
    acodec: a ? a[1] : null, channels: a ? a[3].trim() : null,
  };
}

/* ---------------- reprodução por MediaSource ---------------- */
const AHEAD = 40, BEHIND = 60;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const onceEv = (t, ev) => new Promise((r) => t.addEventListener(ev, r, { once: true }));

/**
 * Toca `src` no <video> por conversão.
 * src: { blob, ext, mode: 'time'|'bytes', inFmt?: 'dts', skip?: bytes, start?: s, end?: s }
 * ui: { status(text|null), error(text) }
 * Devolve { stop(), info }.
 */
export async function play(video, src, ui = {}) {
  ui.status?.('A abrir o conversor…');
  const ff = await getFF(ui);
  const ext = (src.ext || 'bin').replace(/[^a-z0-9]/gi, '') || 'bin';
  const inArgs = src.inFmt ? ['-f', src.inFmt] : [];
  const bytes = src.mode === 'bytes';
  const total = src.blob.size, base = src.skip || 0;

  // análise (ffmpeg -i)
  const info = await serial(async () => {
    const input = await mountAt(ff, '/in', `src.${ext}`, src.blob);
    logs = [];
    await ff.exec(['-hide_banner', '-loglevel', 'info', ...inArgs, ...(bytes ? ['-probesize', String(8 << 20), '-analyzeduration', '10000000'] : []), '-i', input]);
    const text = logs.join('\n'); return { ...parseProbe(text), log: text.slice(-1500) };
  });
  if (!info.vcodec && !info.acodec) { console.warn('[motor] análise:', info.log); throw new Error('O conversor não reconheceu nenhuma faixa de vídeo ou áudio neste ficheiro.'); }
  if (src.inFmt === 'dts' && !(info.duration > 0)) info.duration = (total - base) / 176400;
  const audioOnly = !info.vcodec;
  const copy = !bytes && info.vcodec === 'h264' && !src.forceTranscode;
  const deint = /mpeg2video|mpeg1video/.test(info.vcodec || '') || info.interlaced || bytes;
  const capH = Math.min(info.height || 576, 576);

  const ms = new MediaSource();
  const url = URL.createObjectURL(ms);
  video.src = url;
  await onceEv(ms, 'sourceopen');
  if (info.duration > 0) ms.duration = info.duration;
  const mime = audioOnly ? 'audio/mp4; codecs="mp4a.40.2"' : `video/mp4; codecs="avc1.640029${info.acodec ? ',mp4a.40.2' : ''}"`;
  const sb = ms.addSourceBuffer(mime);
  sb.mode = copy ? 'segments' : 'sequence';

  let alive = true, gen = 0, pos = 0, firstSeg = true, n = 0, ended = false;
  // pos = segundos (modo tempo) ou bytes (modo bytes) onde começa o próximo bocado
  const toPos = (t) => {
    if (!bytes) return Math.max(0, t);
    const frac = info.duration > 0 ? t / info.duration : 0;
    return base + Math.floor(((total - base) * Math.min(Math.max(frac, 0), 0.999)) / 2048) * 2048;
  };
  const timeOf = (p) => (bytes ? (info.duration > 0 ? ((p - base) / (total - base)) * info.duration : 0) : p);
  const startT = src.start || 0;
  const restart = (t) => {
    gen++; n = 0; firstSeg = true; ended = false;
    pos = toPos(t);
    try { if (!sb.updating) { sb.abort(); if (!copy) sb.timestampOffset = timeOf(pos); } } catch { /* */ }
    pendingOffset = copy ? null : timeOf(pos);
  };
  let pendingOffset = null;
  restart(startT);

  const buffered = (t) => { for (let i = 0; i < sb.buffered.length; i++) if (sb.buffered.start(i) <= t + 0.3 && sb.buffered.end(i) >= t) return sb.buffered.end(i) - t; return 0; };
  const onSeeking = () => { if (!alive) return; const t = video.currentTime; if (buffered(t) > 0.5) return; restart(t); };
  video.addEventListener('seeking', onSeeking);
  // saltar pequenos buracos entre bocados (vídeo que começa depois do áudio num bocado cortado por bytes)
  const gapTimer = setInterval(() => {
    if (!alive || video.paused || video.seeking) return;
    const t = video.currentTime;
    if (buffered(t) > 0.1) return;
    for (let i = 0; i < sb.buffered.length; i++) { const s = sb.buffered.start(i); if (s > t && s - t < 1.5) { video.currentTime = s + 0.01; break; } }
  }, 500);

  const segLen = () => (n === 0 ? 4 : n === 1 ? 8 : 15); // s: o 1.º sai depressa
  const chunkLen = () => (n === 0 ? 3 : n === 1 ? 6 : 12) << 20; // bytes

  async function segment(myGen) {
    const args = ['-hide_banner', '-loglevel', 'error', '-nostdin'];
    let input, len, offset = null, out = `/out${myGen}_${n}.mp4`;
    return serial(async () => {
      if (myGen !== gen) return null;
      if (bytes) {
        len = Math.min(chunkLen(), total - pos);
        input = await mountAt(ff, '/c', `c.${ext}`, src.blob.slice(pos, pos + len));
        args.push('-copyts', '-start_at_zero', '-fflags', '+genpts+discardcorrupt', '-probesize', String(4 << 20), '-analyzeduration', '5000000', ...inArgs, '-i', input);
      } else {
        len = segLen();
        if (src.end) len = Math.min(len, src.end - pos);
        input = '/in/src.' + ext;
        if (copy) {
          // cópia: o ffmpeg começa no fotograma-chave K ≤ pos; descobre-se K e o bocado vai de K a pos+len,
          // posto em K (modo 'segments': o que se sobrepõe ao bocado anterior é substituído pelo mesmo)
          logs = [];
          await ff.exec(['-hide_banner', '-loglevel', 'error', '-copyts', '-ss', pos.toFixed(3), '-i', input, '-map', '0:v:0', '-c:v', 'copy', '-frames:v', '1', '-f', 'framecrc', '-']);
          const tb = logs.join('\n').match(/#tb 0: (\d+)\/(\d+)/), fr = logs.map((l) => l.match(/^0,\s*(-?\d+),\s*(-?\d+),/)).find(Boolean);
          let K = tb && fr ? (+fr[2] * +tb[1]) / +tb[2] : pos;
          if (!(K <= pos + 0.01) || K < pos - 60) K = pos;
          offset = K - (info.start || 0);
          // no núcleo wasm (ffmpeg 5.1), com -ss + cópia o -t funciona como fim absoluto: pede-se o fim (pos+len)
          args.push('-ss', pos.toFixed(3), ...inArgs, '-i', input, '-t', (pos + len).toFixed(3));
        } else args.push('-ss', pos.toFixed(3), ...inArgs, '-i', input, '-t', len.toFixed(3));
      }
      if (audioOnly) args.push('-vn', '-map', '0:a:0');
      else args.push('-map', '0:v:0', '-map', '0:a:0?', '-sn', '-dn');
      if (!audioOnly) {
        if (copy) args.push('-c:v', 'copy');
        else {
          const vf = [deint ? 'bwdif=mode=send_frame:parity=auto:deint=interlaced' : null, `scale=-2:'min(${capH},ih)'`, 'format=yuv420p'].filter(Boolean).join(',');
          args.push('-vf', vf, '-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '24', '-profile:v', 'high', '-g', String(Math.round((info.fps || 25) * 2)), '-bf', '0');
        }
      }
      if (info.acodec) args.push('-c:a', 'aac', '-b:a', '160k', '-ac', '2', '-af', `aresample=async=1000${copy ? '' : ':first_pts=0'},aformat=channel_layouts=stereo,alimiter=limit=0.891:level=false`);
      if (!copy && !bytes) args.push('-avoid_negative_ts', 'make_zero');
      args.push('-movflags', 'frag_keyframe+empty_moov+default_base_moof', '-f', 'mp4', out);
      logs = [];
      const code = await ff.exec(args);
      let data = null;
      try { data = await ff.readFile(out); } catch { /* sem saída */ }
      ff.deleteFile(out).catch(() => {});
      if (code !== 0 && !data?.length) throw new Error(logs.slice(-3).join(' ') || 'falha na conversão');
      return { data, len, offset };
    });
  }

  async function append(data, offset) {
    if (sb.updating) await onceEv(sb, 'updateend');
    if (offset != null) { pendingOffset = null; sb.timestampOffset = offset; }
    else if (pendingOffset != null) { try { sb.timestampOffset = pendingOffset; } catch { /* */ } pendingOffset = null; }
    sb.appendBuffer(data);
    await onceEv(sb, 'updateend');
  }

  async function trim() {
    const t = video.currentTime;
    if (sb.buffered.length && t - sb.buffered.start(0) > BEHIND + 10) {
      if (sb.updating) await onceEv(sb, 'updateend');
      sb.remove(0, t - BEHIND); await onceEv(sb, 'updateend');
    }
  }

  (async () => {
    let failures = 0;
    while (alive) {
      try {
        const done = bytes ? pos >= total : (src.end ? pos >= src.end - 0.05 : info.duration > 0 && pos >= info.duration - 0.05);
        if (done) {
          if (!ended && ms.readyState === 'open' && !sb.updating) { try { ms.endOfStream(); } catch { /* */ } ended = true; ui.status?.(null); }
          await wait(400); continue;
        }
        if (!firstSeg && buffered(video.currentTime) > AHEAD) { await wait(400); continue; }
        const myGen = gen;
        if (firstSeg) ui.status?.('A converter…');
        const r = await segment(myGen);
        if (!alive || myGen !== gen || !r) continue;
        if (r.data?.length) await append(r.data, r.offset);
        if (self.NIP_DEBUG) console.log('[motor] seg', { n, pos, len: r.len, bytes: r.data?.length, buf: [...Array(sb.buffered.length).keys()].map((i) => [sb.buffered.start(i), sb.buffered.end(i)]), dur: ms.duration });
        if (copy && r.offset != null) {
          // avança pelo que ficou mesmo no buffer (o bocado pode acabar antes ou depois do pedido)
          let end = null;
          for (let i = 0; i < sb.buffered.length; i++) if (sb.buffered.start(i) <= r.offset + 0.5 && sb.buffered.end(i) > r.offset) end = sb.buffered.end(i);
          const next = end != null ? end + (info.start || 0) : pos + r.len;
          pos = next > pos + 0.5 ? next : pos + r.len;
        } else pos += r.len;
        n++; failures = 0;
        if (firstSeg) {
          firstSeg = false; ui.status?.(null);
          // começo a meio (faixa de .cue, retoma): o 1.º bocado está em startT, não em 0
          if (n === 1 && startT > 0.5 && video.currentTime < startT - 0.5) video.currentTime = startT + 0.01;
        }
        await trim();
      } catch (e) {
        if (!alive) break;
        console.warn('[motor]', e);
        if (++failures >= 3) { ui.status?.(null); ui.error?.('Não consegui converter este ficheiro: ' + (e.message || e)); break; }
        // bocado estragado: salta-o
        pos += bytes ? chunkLen() : segLen(); n++;
      }
    }
  })();

  return {
    info, copy,
    stop() {
      alive = false; gen++; clearInterval(gapTimer);
      video.removeEventListener('seeking', onSeeking);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    },
  };
}

/** Legendas .ass/.ssa (e outras de texto) → WebVTT, pelo ffmpeg. */
export async function subsToVtt(file) {
  const ff = await getFF();
  return serial(async () => {
    const ext = (file.name.split('.').pop() || 'ass').toLowerCase();
    await ff.writeFile(`/s.${ext}`, new Uint8Array(await file.arrayBuffer()));
    await ff.exec(['-hide_banner', '-loglevel', 'error', '-i', `/s.${ext}`, '-f', 'webvtt', '/s.vtt']);
    const out = new TextDecoder().decode(await ff.readFile('/s.vtt'));
    ff.deleteFile(`/s.${ext}`).catch(() => {}); ff.deleteFile('/s.vtt').catch(() => {});
    return out;
  });
}

/** Fluxos HLS (.m3u8) em browsers que não os tocam sozinhos (Chrome/Firefox): hls.js a pedido. */
export async function playHls(video, url) {
  const { default: Hls } = await import('https://cdn.jsdelivr.net/npm/hls.js@1.5.20/dist/hls.mjs');
  if (!Hls.isSupported()) throw new Error('HLS não suportado neste browser');
  const hls = new Hls();
  hls.loadSource(url); hls.attachMedia(video);
  return { stop() { hls.destroy(); } };
}
