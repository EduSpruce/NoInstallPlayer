# NoInstallPlayer

Play videos and music straight from your browser, with nothing to install. It opens (almost) anything.

**▶ Open it:** https://eduspruce.github.io/NoInstallPlayer/

## What it opens
| Type | How |
|---|---|
| MP4, WebM, MP3, AAC, FLAC, WAV, OGG, Opus | the browser plays these directly |
| **MKV, AVI, WMV, FLV, MPG, VOB, TS/M2TS, RM, 3G2…** | converted in the browser itself (ffmpeg in WebAssembly) |
| **MKV with H.264 + AC3/DTS** | video is copied as-is and only the sound is converted (fast) |
| **DVD**: `.iso` image or `VIDEO_TS` folder | finds the main title, deinterlaces it, and lets you seek |
| **Blu-ray / VCD**: `.iso` or `BDMV`/`MPEGAV` folder | plays the largest stream on the disc |
| **DTS, AC3, WMA, APE, AIFF, DSF/DFF, WavPack, MKA…** | converted to stereo (5.1 downmix with a limiter) |
| **DTS-CD** (`.wav` that is really DTS 5.1) | detected automatically, so it doesn't play as noise |
| **`.cue` sheets** | each track becomes its own item in the playlist |
| Subtitles `.srt`, `.vtt`, **`.ass`/`.ssa`** | with delay and size controls |
| HLS streams (`.m3u8`) | native in Safari, hls.js on demand in other browsers |

Everything runs on your machine: **no file is ever uploaded**. The converter (~31 MB) only downloads
the first time it's needed and then stays in the browser cache.

Not supported: copy-protected DVDs (CSS), compressed `.dmg` images, and disc menus.

## Other features
Playlist (search, shuffle, repeat, M3U), 10-band equalizer with presets, volume up to 200%, video effects,
aspect ratio, frame capture, 0.25×–4× speed, A→B loop, frame-by-frame, and keyboard shortcuts (F1).

## How it works
- `index.html`: the player.
- `engine/engine.js`: the converter. ffmpeg.wasm converts the file in pieces into fragmented MP4 and
  feeds them to the `<video>` through MediaSource, so you can seek even in converted files.
  DVD/MPEG-PS and DTS-CD are cut by bytes, the rest by time.
- `engine/disc-worker.js`: reads ISO9660/UDF images (including UDF 2.50 for Blu-ray), DTS-CD and `.cue`
  sheets in pure JavaScript inside a Web Worker, without loading the file into memory.

## Run it locally
Serve the folder over HTTP (for example `python3 -m http.server`) and open `http://localhost:8000`.
If you only open `index.html` directly from disk, the native formats work but the converter does not.

## Licenses
- [ffmpeg.wasm](https://github.com/ffmpegwasm/ffmpeg.wasm) (`vendor/ffmpeg`): MIT
- ffmpeg-core (`vendor/ffmpeg-core`): FFmpeg compiled with libx264, under GPL-2.0-or-later
