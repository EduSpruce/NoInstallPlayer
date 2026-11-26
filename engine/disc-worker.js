(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res, err) => function __init() {
    if (err) throw err[0];
    try {
      return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
    } catch (e) {
      throw err = [e], e;
    }
  };
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/base64-js/index.js
  var require_base64_js = __commonJS({
    "node_modules/base64-js/index.js"(exports) {
      "use strict";
      init_buffer_global();
      exports.byteLength = byteLength;
      exports.toByteArray = toByteArray;
      exports.fromByteArray = fromByteArray;
      var lookup = [];
      var revLookup = [];
      var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
      var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      for (i = 0, len = code.length; i < len; ++i) {
        lookup[i] = code[i];
        revLookup[code.charCodeAt(i)] = i;
      }
      var i;
      var len;
      revLookup["-".charCodeAt(0)] = 62;
      revLookup["_".charCodeAt(0)] = 63;
      function getLens(b64) {
        var len2 = b64.length;
        if (len2 % 4 > 0) {
          throw new Error("Invalid string. Length must be a multiple of 4");
        }
        var validLen = b64.indexOf("=");
        if (validLen === -1) validLen = len2;
        var placeHoldersLen = validLen === len2 ? 0 : 4 - validLen % 4;
        return [validLen, placeHoldersLen];
      }
      function byteLength(b64) {
        var lens = getLens(b64);
        var validLen = lens[0];
        var placeHoldersLen = lens[1];
        return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
      }
      function _byteLength(b64, validLen, placeHoldersLen) {
        return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
      }
      function toByteArray(b64) {
        var tmp;
        var lens = getLens(b64);
        var validLen = lens[0];
        var placeHoldersLen = lens[1];
        var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
        var curByte = 0;
        var len2 = placeHoldersLen > 0 ? validLen - 4 : validLen;
        var i2;
        for (i2 = 0; i2 < len2; i2 += 4) {
          tmp = revLookup[b64.charCodeAt(i2)] << 18 | revLookup[b64.charCodeAt(i2 + 1)] << 12 | revLookup[b64.charCodeAt(i2 + 2)] << 6 | revLookup[b64.charCodeAt(i2 + 3)];
          arr[curByte++] = tmp >> 16 & 255;
          arr[curByte++] = tmp >> 8 & 255;
          arr[curByte++] = tmp & 255;
        }
        if (placeHoldersLen === 2) {
          tmp = revLookup[b64.charCodeAt(i2)] << 2 | revLookup[b64.charCodeAt(i2 + 1)] >> 4;
          arr[curByte++] = tmp & 255;
        }
        if (placeHoldersLen === 1) {
          tmp = revLookup[b64.charCodeAt(i2)] << 10 | revLookup[b64.charCodeAt(i2 + 1)] << 4 | revLookup[b64.charCodeAt(i2 + 2)] >> 2;
          arr[curByte++] = tmp >> 8 & 255;
          arr[curByte++] = tmp & 255;
        }
        return arr;
      }
      function tripletToBase64(num) {
        return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
      }
      function encodeChunk(uint8, start, end) {
        var tmp;
        var output = [];
        for (var i2 = start; i2 < end; i2 += 3) {
          tmp = (uint8[i2] << 16 & 16711680) + (uint8[i2 + 1] << 8 & 65280) + (uint8[i2 + 2] & 255);
          output.push(tripletToBase64(tmp));
        }
        return output.join("");
      }
      function fromByteArray(uint8) {
        var tmp;
        var len2 = uint8.length;
        var extraBytes = len2 % 3;
        var parts = [];
        var maxChunkLength = 16383;
        for (var i2 = 0, len22 = len2 - extraBytes; i2 < len22; i2 += maxChunkLength) {
          parts.push(encodeChunk(uint8, i2, i2 + maxChunkLength > len22 ? len22 : i2 + maxChunkLength));
        }
        if (extraBytes === 1) {
          tmp = uint8[len2 - 1];
          parts.push(
            lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "=="
          );
        } else if (extraBytes === 2) {
          tmp = (uint8[len2 - 2] << 8) + uint8[len2 - 1];
          parts.push(
            lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "="
          );
        }
        return parts.join("");
      }
    }
  });

  // node_modules/ieee754/index.js
  var require_ieee754 = __commonJS({
    "node_modules/ieee754/index.js"(exports) {
      init_buffer_global();
      exports.read = function(buffer, offset, isLE, mLen, nBytes) {
        var e, m;
        var eLen = nBytes * 8 - mLen - 1;
        var eMax = (1 << eLen) - 1;
        var eBias = eMax >> 1;
        var nBits = -7;
        var i = isLE ? nBytes - 1 : 0;
        var d = isLE ? -1 : 1;
        var s = buffer[offset + i];
        i += d;
        e = s & (1 << -nBits) - 1;
        s >>= -nBits;
        nBits += eLen;
        for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {
        }
        m = e & (1 << -nBits) - 1;
        e >>= -nBits;
        nBits += mLen;
        for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {
        }
        if (e === 0) {
          e = 1 - eBias;
        } else if (e === eMax) {
          return m ? NaN : (s ? -1 : 1) * Infinity;
        } else {
          m = m + Math.pow(2, mLen);
          e = e - eBias;
        }
        return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
      };
      exports.write = function(buffer, value2, offset, isLE, mLen, nBytes) {
        var e, m, c;
        var eLen = nBytes * 8 - mLen - 1;
        var eMax = (1 << eLen) - 1;
        var eBias = eMax >> 1;
        var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
        var i = isLE ? 0 : nBytes - 1;
        var d = isLE ? 1 : -1;
        var s = value2 < 0 || value2 === 0 && 1 / value2 < 0 ? 1 : 0;
        value2 = Math.abs(value2);
        if (isNaN(value2) || value2 === Infinity) {
          m = isNaN(value2) ? 1 : 0;
          e = eMax;
        } else {
          e = Math.floor(Math.log(value2) / Math.LN2);
          if (value2 * (c = Math.pow(2, -e)) < 1) {
            e--;
            c *= 2;
          }
          if (e + eBias >= 1) {
            value2 += rt / c;
          } else {
            value2 += rt * Math.pow(2, 1 - eBias);
          }
          if (value2 * c >= 2) {
            e++;
            c /= 2;
          }
          if (e + eBias >= eMax) {
            m = 0;
            e = eMax;
          } else if (e + eBias >= 1) {
            m = (value2 * c - 1) * Math.pow(2, mLen);
            e = e + eBias;
          } else {
            m = value2 * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
            e = 0;
          }
        }
        for (; mLen >= 8; buffer[offset + i] = m & 255, i += d, m /= 256, mLen -= 8) {
        }
        e = e << mLen | m;
        eLen += mLen;
        for (; eLen > 0; buffer[offset + i] = e & 255, i += d, e /= 256, eLen -= 8) {
        }
        buffer[offset + i - d] |= s * 128;
      };
    }
  });

  // node_modules/buffer/index.js
  var require_buffer = __commonJS({
    "node_modules/buffer/index.js"(exports) {
      "use strict";
      init_buffer_global();
      var base64 = require_base64_js();
      var ieee754 = require_ieee754();
      var customInspectSymbol = typeof Symbol === "function" && typeof Symbol["for"] === "function" ? Symbol["for"]("nodejs.util.inspect.custom") : null;
      exports.Buffer = Buffer3;
      exports.SlowBuffer = SlowBuffer;
      exports.INSPECT_MAX_BYTES = 50;
      var K_MAX_LENGTH = 2147483647;
      exports.kMaxLength = K_MAX_LENGTH;
      Buffer3.TYPED_ARRAY_SUPPORT = typedArraySupport();
      if (!Buffer3.TYPED_ARRAY_SUPPORT && typeof console !== "undefined" && typeof console.error === "function") {
        console.error(
          "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
        );
      }
      function typedArraySupport() {
        try {
          const arr = new Uint8Array(1);
          const proto = { foo: function() {
            return 42;
          } };
          Object.setPrototypeOf(proto, Uint8Array.prototype);
          Object.setPrototypeOf(arr, proto);
          return arr.foo() === 42;
        } catch (e) {
          return false;
        }
      }
      Object.defineProperty(Buffer3.prototype, "parent", {
        enumerable: true,
        get: function() {
          if (!Buffer3.isBuffer(this)) return void 0;
          return this.buffer;
        }
      });
      Object.defineProperty(Buffer3.prototype, "offset", {
        enumerable: true,
        get: function() {
          if (!Buffer3.isBuffer(this)) return void 0;
          return this.byteOffset;
        }
      });
      function createBuffer(length) {
        if (length > K_MAX_LENGTH) {
          throw new RangeError('The value "' + length + '" is invalid for option "size"');
        }
        const buf = new Uint8Array(length);
        Object.setPrototypeOf(buf, Buffer3.prototype);
        return buf;
      }
      function Buffer3(arg, encodingOrOffset, length) {
        if (typeof arg === "number") {
          if (typeof encodingOrOffset === "string") {
            throw new TypeError(
              'The "string" argument must be of type string. Received type number'
            );
          }
          return allocUnsafe(arg);
        }
        return from(arg, encodingOrOffset, length);
      }
      Buffer3.poolSize = 8192;
      function from(value2, encodingOrOffset, length) {
        if (typeof value2 === "string") {
          return fromString(value2, encodingOrOffset);
        }
        if (ArrayBuffer.isView(value2)) {
          return fromArrayView(value2);
        }
        if (value2 == null) {
          throw new TypeError(
            "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value2
          );
        }
        if (isInstance(value2, ArrayBuffer) || value2 && isInstance(value2.buffer, ArrayBuffer)) {
          return fromArrayBuffer(value2, encodingOrOffset, length);
        }
        if (typeof SharedArrayBuffer !== "undefined" && (isInstance(value2, SharedArrayBuffer) || value2 && isInstance(value2.buffer, SharedArrayBuffer))) {
          return fromArrayBuffer(value2, encodingOrOffset, length);
        }
        if (typeof value2 === "number") {
          throw new TypeError(
            'The "value" argument must not be of type number. Received type number'
          );
        }
        const valueOf = value2.valueOf && value2.valueOf();
        if (valueOf != null && valueOf !== value2) {
          return Buffer3.from(valueOf, encodingOrOffset, length);
        }
        const b = fromObject(value2);
        if (b) return b;
        if (typeof Symbol !== "undefined" && Symbol.toPrimitive != null && typeof value2[Symbol.toPrimitive] === "function") {
          return Buffer3.from(value2[Symbol.toPrimitive]("string"), encodingOrOffset, length);
        }
        throw new TypeError(
          "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value2
        );
      }
      Buffer3.from = function(value2, encodingOrOffset, length) {
        return from(value2, encodingOrOffset, length);
      };
      Object.setPrototypeOf(Buffer3.prototype, Uint8Array.prototype);
      Object.setPrototypeOf(Buffer3, Uint8Array);
      function assertSize(size) {
        if (typeof size !== "number") {
          throw new TypeError('"size" argument must be of type number');
        } else if (size < 0) {
          throw new RangeError('The value "' + size + '" is invalid for option "size"');
        }
      }
      function alloc(size, fill, encoding) {
        assertSize(size);
        if (size <= 0) {
          return createBuffer(size);
        }
        if (fill !== void 0) {
          return typeof encoding === "string" ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
        }
        return createBuffer(size);
      }
      Buffer3.alloc = function(size, fill, encoding) {
        return alloc(size, fill, encoding);
      };
      function allocUnsafe(size) {
        assertSize(size);
        return createBuffer(size < 0 ? 0 : checked(size) | 0);
      }
      Buffer3.allocUnsafe = function(size) {
        return allocUnsafe(size);
      };
      Buffer3.allocUnsafeSlow = function(size) {
        return allocUnsafe(size);
      };
      function fromString(string, encoding) {
        if (typeof encoding !== "string" || encoding === "") {
          encoding = "utf8";
        }
        if (!Buffer3.isEncoding(encoding)) {
          throw new TypeError("Unknown encoding: " + encoding);
        }
        const length = byteLength(string, encoding) | 0;
        let buf = createBuffer(length);
        const actual = buf.write(string, encoding);
        if (actual !== length) {
          buf = buf.slice(0, actual);
        }
        return buf;
      }
      function fromArrayLike(array) {
        const length = array.length < 0 ? 0 : checked(array.length) | 0;
        const buf = createBuffer(length);
        for (let i = 0; i < length; i += 1) {
          buf[i] = array[i] & 255;
        }
        return buf;
      }
      function fromArrayView(arrayView) {
        if (isInstance(arrayView, Uint8Array)) {
          const copy = new Uint8Array(arrayView);
          return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength);
        }
        return fromArrayLike(arrayView);
      }
      function fromArrayBuffer(array, byteOffset, length) {
        if (byteOffset < 0 || array.byteLength < byteOffset) {
          throw new RangeError('"offset" is outside of buffer bounds');
        }
        if (array.byteLength < byteOffset + (length || 0)) {
          throw new RangeError('"length" is outside of buffer bounds');
        }
        let buf;
        if (byteOffset === void 0 && length === void 0) {
          buf = new Uint8Array(array);
        } else if (length === void 0) {
          buf = new Uint8Array(array, byteOffset);
        } else {
          buf = new Uint8Array(array, byteOffset, length);
        }
        Object.setPrototypeOf(buf, Buffer3.prototype);
        return buf;
      }
      function fromObject(obj) {
        if (Buffer3.isBuffer(obj)) {
          const len = checked(obj.length) | 0;
          const buf = createBuffer(len);
          if (buf.length === 0) {
            return buf;
          }
          obj.copy(buf, 0, 0, len);
          return buf;
        }
        if (obj.length !== void 0) {
          if (typeof obj.length !== "number" || numberIsNaN(obj.length)) {
            return createBuffer(0);
          }
          return fromArrayLike(obj);
        }
        if (obj.type === "Buffer" && Array.isArray(obj.data)) {
          return fromArrayLike(obj.data);
        }
      }
      function checked(length) {
        if (length >= K_MAX_LENGTH) {
          throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + K_MAX_LENGTH.toString(16) + " bytes");
        }
        return length | 0;
      }
      function SlowBuffer(length) {
        if (+length != length) {
          length = 0;
        }
        return Buffer3.alloc(+length);
      }
      Buffer3.isBuffer = function isBuffer(b) {
        return b != null && b._isBuffer === true && b !== Buffer3.prototype;
      };
      Buffer3.compare = function compare(a, b) {
        if (isInstance(a, Uint8Array)) a = Buffer3.from(a, a.offset, a.byteLength);
        if (isInstance(b, Uint8Array)) b = Buffer3.from(b, b.offset, b.byteLength);
        if (!Buffer3.isBuffer(a) || !Buffer3.isBuffer(b)) {
          throw new TypeError(
            'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
          );
        }
        if (a === b) return 0;
        let x = a.length;
        let y = b.length;
        for (let i = 0, len = Math.min(x, y); i < len; ++i) {
          if (a[i] !== b[i]) {
            x = a[i];
            y = b[i];
            break;
          }
        }
        if (x < y) return -1;
        if (y < x) return 1;
        return 0;
      };
      Buffer3.isEncoding = function isEncoding(encoding) {
        switch (String(encoding).toLowerCase()) {
          case "hex":
          case "utf8":
          case "utf-8":
          case "ascii":
          case "latin1":
          case "binary":
          case "base64":
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return true;
          default:
            return false;
        }
      };
      Buffer3.concat = function concat(list, length) {
        if (!Array.isArray(list)) {
          throw new TypeError('"list" argument must be an Array of Buffers');
        }
        if (list.length === 0) {
          return Buffer3.alloc(0);
        }
        let i;
        if (length === void 0) {
          length = 0;
          for (i = 0; i < list.length; ++i) {
            length += list[i].length;
          }
        }
        const buffer = Buffer3.allocUnsafe(length);
        let pos = 0;
        for (i = 0; i < list.length; ++i) {
          let buf = list[i];
          if (isInstance(buf, Uint8Array)) {
            if (pos + buf.length > buffer.length) {
              if (!Buffer3.isBuffer(buf)) buf = Buffer3.from(buf);
              buf.copy(buffer, pos);
            } else {
              Uint8Array.prototype.set.call(
                buffer,
                buf,
                pos
              );
            }
          } else if (!Buffer3.isBuffer(buf)) {
            throw new TypeError('"list" argument must be an Array of Buffers');
          } else {
            buf.copy(buffer, pos);
          }
          pos += buf.length;
        }
        return buffer;
      };
      function byteLength(string, encoding) {
        if (Buffer3.isBuffer(string)) {
          return string.length;
        }
        if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
          return string.byteLength;
        }
        if (typeof string !== "string") {
          throw new TypeError(
            'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof string
          );
        }
        const len = string.length;
        const mustMatch = arguments.length > 2 && arguments[2] === true;
        if (!mustMatch && len === 0) return 0;
        let loweredCase = false;
        for (; ; ) {
          switch (encoding) {
            case "ascii":
            case "latin1":
            case "binary":
              return len;
            case "utf8":
            case "utf-8":
              return utf8ToBytes(string).length;
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return len * 2;
            case "hex":
              return len >>> 1;
            case "base64":
              return base64ToBytes(string).length;
            default:
              if (loweredCase) {
                return mustMatch ? -1 : utf8ToBytes(string).length;
              }
              encoding = ("" + encoding).toLowerCase();
              loweredCase = true;
          }
        }
      }
      Buffer3.byteLength = byteLength;
      function slowToString(encoding, start, end) {
        let loweredCase = false;
        if (start === void 0 || start < 0) {
          start = 0;
        }
        if (start > this.length) {
          return "";
        }
        if (end === void 0 || end > this.length) {
          end = this.length;
        }
        if (end <= 0) {
          return "";
        }
        end >>>= 0;
        start >>>= 0;
        if (end <= start) {
          return "";
        }
        if (!encoding) encoding = "utf8";
        while (true) {
          switch (encoding) {
            case "hex":
              return hexSlice(this, start, end);
            case "utf8":
            case "utf-8":
              return utf8Slice(this, start, end);
            case "ascii":
              return asciiSlice(this, start, end);
            case "latin1":
            case "binary":
              return latin1Slice(this, start, end);
            case "base64":
              return base64Slice(this, start, end);
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return utf16leSlice(this, start, end);
            default:
              if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
              encoding = (encoding + "").toLowerCase();
              loweredCase = true;
          }
        }
      }
      Buffer3.prototype._isBuffer = true;
      function swap(b, n, m) {
        const i = b[n];
        b[n] = b[m];
        b[m] = i;
      }
      Buffer3.prototype.swap16 = function swap16() {
        const len = this.length;
        if (len % 2 !== 0) {
          throw new RangeError("Buffer size must be a multiple of 16-bits");
        }
        for (let i = 0; i < len; i += 2) {
          swap(this, i, i + 1);
        }
        return this;
      };
      Buffer3.prototype.swap32 = function swap32() {
        const len = this.length;
        if (len % 4 !== 0) {
          throw new RangeError("Buffer size must be a multiple of 32-bits");
        }
        for (let i = 0; i < len; i += 4) {
          swap(this, i, i + 3);
          swap(this, i + 1, i + 2);
        }
        return this;
      };
      Buffer3.prototype.swap64 = function swap64() {
        const len = this.length;
        if (len % 8 !== 0) {
          throw new RangeError("Buffer size must be a multiple of 64-bits");
        }
        for (let i = 0; i < len; i += 8) {
          swap(this, i, i + 7);
          swap(this, i + 1, i + 6);
          swap(this, i + 2, i + 5);
          swap(this, i + 3, i + 4);
        }
        return this;
      };
      Buffer3.prototype.toString = function toString() {
        const length = this.length;
        if (length === 0) return "";
        if (arguments.length === 0) return utf8Slice(this, 0, length);
        return slowToString.apply(this, arguments);
      };
      Buffer3.prototype.toLocaleString = Buffer3.prototype.toString;
      Buffer3.prototype.equals = function equals(b) {
        if (!Buffer3.isBuffer(b)) throw new TypeError("Argument must be a Buffer");
        if (this === b) return true;
        return Buffer3.compare(this, b) === 0;
      };
      Buffer3.prototype.inspect = function inspect() {
        let str = "";
        const max = exports.INSPECT_MAX_BYTES;
        str = this.toString("hex", 0, max).replace(/(.{2})/g, "$1 ").trim();
        if (this.length > max) str += " ... ";
        return "<Buffer " + str + ">";
      };
      if (customInspectSymbol) {
        Buffer3.prototype[customInspectSymbol] = Buffer3.prototype.inspect;
      }
      Buffer3.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
        if (isInstance(target, Uint8Array)) {
          target = Buffer3.from(target, target.offset, target.byteLength);
        }
        if (!Buffer3.isBuffer(target)) {
          throw new TypeError(
            'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof target
          );
        }
        if (start === void 0) {
          start = 0;
        }
        if (end === void 0) {
          end = target ? target.length : 0;
        }
        if (thisStart === void 0) {
          thisStart = 0;
        }
        if (thisEnd === void 0) {
          thisEnd = this.length;
        }
        if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
          throw new RangeError("out of range index");
        }
        if (thisStart >= thisEnd && start >= end) {
          return 0;
        }
        if (thisStart >= thisEnd) {
          return -1;
        }
        if (start >= end) {
          return 1;
        }
        start >>>= 0;
        end >>>= 0;
        thisStart >>>= 0;
        thisEnd >>>= 0;
        if (this === target) return 0;
        let x = thisEnd - thisStart;
        let y = end - start;
        const len = Math.min(x, y);
        const thisCopy = this.slice(thisStart, thisEnd);
        const targetCopy = target.slice(start, end);
        for (let i = 0; i < len; ++i) {
          if (thisCopy[i] !== targetCopy[i]) {
            x = thisCopy[i];
            y = targetCopy[i];
            break;
          }
        }
        if (x < y) return -1;
        if (y < x) return 1;
        return 0;
      };
      function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
        if (buffer.length === 0) return -1;
        if (typeof byteOffset === "string") {
          encoding = byteOffset;
          byteOffset = 0;
        } else if (byteOffset > 2147483647) {
          byteOffset = 2147483647;
        } else if (byteOffset < -2147483648) {
          byteOffset = -2147483648;
        }
        byteOffset = +byteOffset;
        if (numberIsNaN(byteOffset)) {
          byteOffset = dir ? 0 : buffer.length - 1;
        }
        if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
        if (byteOffset >= buffer.length) {
          if (dir) return -1;
          else byteOffset = buffer.length - 1;
        } else if (byteOffset < 0) {
          if (dir) byteOffset = 0;
          else return -1;
        }
        if (typeof val === "string") {
          val = Buffer3.from(val, encoding);
        }
        if (Buffer3.isBuffer(val)) {
          if (val.length === 0) {
            return -1;
          }
          return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
        } else if (typeof val === "number") {
          val = val & 255;
          if (typeof Uint8Array.prototype.indexOf === "function") {
            if (dir) {
              return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
            } else {
              return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
            }
          }
          return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
        }
        throw new TypeError("val must be string, number or Buffer");
      }
      function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
        let indexSize = 1;
        let arrLength = arr.length;
        let valLength = val.length;
        if (encoding !== void 0) {
          encoding = String(encoding).toLowerCase();
          if (encoding === "ucs2" || encoding === "ucs-2" || encoding === "utf16le" || encoding === "utf-16le") {
            if (arr.length < 2 || val.length < 2) {
              return -1;
            }
            indexSize = 2;
            arrLength /= 2;
            valLength /= 2;
            byteOffset /= 2;
          }
        }
        function read(buf, i2) {
          if (indexSize === 1) {
            return buf[i2];
          } else {
            return buf.readUInt16BE(i2 * indexSize);
          }
        }
        let i;
        if (dir) {
          let foundIndex = -1;
          for (i = byteOffset; i < arrLength; i++) {
            if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
              if (foundIndex === -1) foundIndex = i;
              if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
            } else {
              if (foundIndex !== -1) i -= i - foundIndex;
              foundIndex = -1;
            }
          }
        } else {
          if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
          for (i = byteOffset; i >= 0; i--) {
            let found = true;
            for (let j = 0; j < valLength; j++) {
              if (read(arr, i + j) !== read(val, j)) {
                found = false;
                break;
              }
            }
            if (found) return i;
          }
        }
        return -1;
      }
      Buffer3.prototype.includes = function includes(val, byteOffset, encoding) {
        return this.indexOf(val, byteOffset, encoding) !== -1;
      };
      Buffer3.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
        return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
      };
      Buffer3.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
        return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
      };
      function hexWrite(buf, string, offset, length) {
        offset = Number(offset) || 0;
        const remaining = buf.length - offset;
        if (!length) {
          length = remaining;
        } else {
          length = Number(length);
          if (length > remaining) {
            length = remaining;
          }
        }
        const strLen = string.length;
        if (length > strLen / 2) {
          length = strLen / 2;
        }
        let i;
        for (i = 0; i < length; ++i) {
          const parsed = parseInt(string.substr(i * 2, 2), 16);
          if (numberIsNaN(parsed)) return i;
          buf[offset + i] = parsed;
        }
        return i;
      }
      function utf8Write(buf, string, offset, length) {
        return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
      }
      function asciiWrite(buf, string, offset, length) {
        return blitBuffer(asciiToBytes(string), buf, offset, length);
      }
      function base64Write(buf, string, offset, length) {
        return blitBuffer(base64ToBytes(string), buf, offset, length);
      }
      function ucs2Write(buf, string, offset, length) {
        return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
      }
      Buffer3.prototype.write = function write(string, offset, length, encoding) {
        if (offset === void 0) {
          encoding = "utf8";
          length = this.length;
          offset = 0;
        } else if (length === void 0 && typeof offset === "string") {
          encoding = offset;
          length = this.length;
          offset = 0;
        } else if (isFinite(offset)) {
          offset = offset >>> 0;
          if (isFinite(length)) {
            length = length >>> 0;
            if (encoding === void 0) encoding = "utf8";
          } else {
            encoding = length;
            length = void 0;
          }
        } else {
          throw new Error(
            "Buffer.write(string, encoding, offset[, length]) is no longer supported"
          );
        }
        const remaining = this.length - offset;
        if (length === void 0 || length > remaining) length = remaining;
        if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
          throw new RangeError("Attempt to write outside buffer bounds");
        }
        if (!encoding) encoding = "utf8";
        let loweredCase = false;
        for (; ; ) {
          switch (encoding) {
            case "hex":
              return hexWrite(this, string, offset, length);
            case "utf8":
            case "utf-8":
              return utf8Write(this, string, offset, length);
            case "ascii":
            case "latin1":
            case "binary":
              return asciiWrite(this, string, offset, length);
            case "base64":
              return base64Write(this, string, offset, length);
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return ucs2Write(this, string, offset, length);
            default:
              if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
              encoding = ("" + encoding).toLowerCase();
              loweredCase = true;
          }
        }
      };
      Buffer3.prototype.toJSON = function toJSON() {
        return {
          type: "Buffer",
          data: Array.prototype.slice.call(this._arr || this, 0)
        };
      };
      function base64Slice(buf, start, end) {
        if (start === 0 && end === buf.length) {
          return base64.fromByteArray(buf);
        } else {
          return base64.fromByteArray(buf.slice(start, end));
        }
      }
      function utf8Slice(buf, start, end) {
        end = Math.min(buf.length, end);
        const res = [];
        let i = start;
        while (i < end) {
          const firstByte = buf[i];
          let codePoint = null;
          let bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
          if (i + bytesPerSequence <= end) {
            let secondByte, thirdByte, fourthByte, tempCodePoint;
            switch (bytesPerSequence) {
              case 1:
                if (firstByte < 128) {
                  codePoint = firstByte;
                }
                break;
              case 2:
                secondByte = buf[i + 1];
                if ((secondByte & 192) === 128) {
                  tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
                  if (tempCodePoint > 127) {
                    codePoint = tempCodePoint;
                  }
                }
                break;
              case 3:
                secondByte = buf[i + 1];
                thirdByte = buf[i + 2];
                if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
                  tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
                  if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
                    codePoint = tempCodePoint;
                  }
                }
                break;
              case 4:
                secondByte = buf[i + 1];
                thirdByte = buf[i + 2];
                fourthByte = buf[i + 3];
                if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
                  tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
                  if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
                    codePoint = tempCodePoint;
                  }
                }
            }
          }
          if (codePoint === null) {
            codePoint = 65533;
            bytesPerSequence = 1;
          } else if (codePoint > 65535) {
            codePoint -= 65536;
            res.push(codePoint >>> 10 & 1023 | 55296);
            codePoint = 56320 | codePoint & 1023;
          }
          res.push(codePoint);
          i += bytesPerSequence;
        }
        return decodeCodePointsArray(res);
      }
      var MAX_ARGUMENTS_LENGTH = 4096;
      function decodeCodePointsArray(codePoints) {
        const len = codePoints.length;
        if (len <= MAX_ARGUMENTS_LENGTH) {
          return String.fromCharCode.apply(String, codePoints);
        }
        let res = "";
        let i = 0;
        while (i < len) {
          res += String.fromCharCode.apply(
            String,
            codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
          );
        }
        return res;
      }
      function asciiSlice(buf, start, end) {
        let ret = "";
        end = Math.min(buf.length, end);
        for (let i = start; i < end; ++i) {
          ret += String.fromCharCode(buf[i] & 127);
        }
        return ret;
      }
      function latin1Slice(buf, start, end) {
        let ret = "";
        end = Math.min(buf.length, end);
        for (let i = start; i < end; ++i) {
          ret += String.fromCharCode(buf[i]);
        }
        return ret;
      }
      function hexSlice(buf, start, end) {
        const len = buf.length;
        if (!start || start < 0) start = 0;
        if (!end || end < 0 || end > len) end = len;
        let out = "";
        for (let i = start; i < end; ++i) {
          out += hexSliceLookupTable[buf[i]];
        }
        return out;
      }
      function utf16leSlice(buf, start, end) {
        const bytes = buf.slice(start, end);
        let res = "";
        for (let i = 0; i < bytes.length - 1; i += 2) {
          res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
        }
        return res;
      }
      Buffer3.prototype.slice = function slice(start, end) {
        const len = this.length;
        start = ~~start;
        end = end === void 0 ? len : ~~end;
        if (start < 0) {
          start += len;
          if (start < 0) start = 0;
        } else if (start > len) {
          start = len;
        }
        if (end < 0) {
          end += len;
          if (end < 0) end = 0;
        } else if (end > len) {
          end = len;
        }
        if (end < start) end = start;
        const newBuf = this.subarray(start, end);
        Object.setPrototypeOf(newBuf, Buffer3.prototype);
        return newBuf;
      };
      function checkOffset(offset, ext, length) {
        if (offset % 1 !== 0 || offset < 0) throw new RangeError("offset is not uint");
        if (offset + ext > length) throw new RangeError("Trying to access beyond buffer length");
      }
      Buffer3.prototype.readUintLE = Buffer3.prototype.readUIntLE = function readUIntLE(offset, byteLength2, noAssert) {
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) checkOffset(offset, byteLength2, this.length);
        let val = this[offset];
        let mul = 1;
        let i = 0;
        while (++i < byteLength2 && (mul *= 256)) {
          val += this[offset + i] * mul;
        }
        return val;
      };
      Buffer3.prototype.readUintBE = Buffer3.prototype.readUIntBE = function readUIntBE(offset, byteLength2, noAssert) {
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) {
          checkOffset(offset, byteLength2, this.length);
        }
        let val = this[offset + --byteLength2];
        let mul = 1;
        while (byteLength2 > 0 && (mul *= 256)) {
          val += this[offset + --byteLength2] * mul;
        }
        return val;
      };
      Buffer3.prototype.readUint8 = Buffer3.prototype.readUInt8 = function readUInt8(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 1, this.length);
        return this[offset];
      };
      Buffer3.prototype.readUint16LE = Buffer3.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 2, this.length);
        return this[offset] | this[offset + 1] << 8;
      };
      Buffer3.prototype.readUint16BE = Buffer3.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 2, this.length);
        return this[offset] << 8 | this[offset + 1];
      };
      Buffer3.prototype.readUint32LE = Buffer3.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
      };
      Buffer3.prototype.readUint32BE = Buffer3.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
      };
      Buffer3.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        const first = this[offset];
        const last = this[offset + 7];
        if (first === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        const lo = first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24;
        const hi = this[++offset] + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + last * 2 ** 24;
        return BigInt(lo) + (BigInt(hi) << BigInt(32));
      });
      Buffer3.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        const first = this[offset];
        const last = this[offset + 7];
        if (first === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        const hi = first * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
        const lo = this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last;
        return (BigInt(hi) << BigInt(32)) + BigInt(lo);
      });
      Buffer3.prototype.readIntLE = function readIntLE(offset, byteLength2, noAssert) {
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) checkOffset(offset, byteLength2, this.length);
        let val = this[offset];
        let mul = 1;
        let i = 0;
        while (++i < byteLength2 && (mul *= 256)) {
          val += this[offset + i] * mul;
        }
        mul *= 128;
        if (val >= mul) val -= Math.pow(2, 8 * byteLength2);
        return val;
      };
      Buffer3.prototype.readIntBE = function readIntBE(offset, byteLength2, noAssert) {
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) checkOffset(offset, byteLength2, this.length);
        let i = byteLength2;
        let mul = 1;
        let val = this[offset + --i];
        while (i > 0 && (mul *= 256)) {
          val += this[offset + --i] * mul;
        }
        mul *= 128;
        if (val >= mul) val -= Math.pow(2, 8 * byteLength2);
        return val;
      };
      Buffer3.prototype.readInt8 = function readInt8(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 1, this.length);
        if (!(this[offset] & 128)) return this[offset];
        return (255 - this[offset] + 1) * -1;
      };
      Buffer3.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 2, this.length);
        const val = this[offset] | this[offset + 1] << 8;
        return val & 32768 ? val | 4294901760 : val;
      };
      Buffer3.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 2, this.length);
        const val = this[offset + 1] | this[offset] << 8;
        return val & 32768 ? val | 4294901760 : val;
      };
      Buffer3.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
      };
      Buffer3.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
      };
      Buffer3.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        const first = this[offset];
        const last = this[offset + 7];
        if (first === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        const val = this[offset + 4] + this[offset + 5] * 2 ** 8 + this[offset + 6] * 2 ** 16 + (last << 24);
        return (BigInt(val) << BigInt(32)) + BigInt(first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24);
      });
      Buffer3.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        const first = this[offset];
        const last = this[offset + 7];
        if (first === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        const val = (first << 24) + // Overflow
        this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
        return (BigInt(val) << BigInt(32)) + BigInt(this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last);
      });
      Buffer3.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return ieee754.read(this, offset, true, 23, 4);
      };
      Buffer3.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return ieee754.read(this, offset, false, 23, 4);
      };
      Buffer3.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 8, this.length);
        return ieee754.read(this, offset, true, 52, 8);
      };
      Buffer3.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 8, this.length);
        return ieee754.read(this, offset, false, 52, 8);
      };
      function checkInt(buf, value2, offset, ext, max, min) {
        if (!Buffer3.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
        if (value2 > max || value2 < min) throw new RangeError('"value" argument is out of bounds');
        if (offset + ext > buf.length) throw new RangeError("Index out of range");
      }
      Buffer3.prototype.writeUintLE = Buffer3.prototype.writeUIntLE = function writeUIntLE(value2, offset, byteLength2, noAssert) {
        value2 = +value2;
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) {
          const maxBytes = Math.pow(2, 8 * byteLength2) - 1;
          checkInt(this, value2, offset, byteLength2, maxBytes, 0);
        }
        let mul = 1;
        let i = 0;
        this[offset] = value2 & 255;
        while (++i < byteLength2 && (mul *= 256)) {
          this[offset + i] = value2 / mul & 255;
        }
        return offset + byteLength2;
      };
      Buffer3.prototype.writeUintBE = Buffer3.prototype.writeUIntBE = function writeUIntBE(value2, offset, byteLength2, noAssert) {
        value2 = +value2;
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) {
          const maxBytes = Math.pow(2, 8 * byteLength2) - 1;
          checkInt(this, value2, offset, byteLength2, maxBytes, 0);
        }
        let i = byteLength2 - 1;
        let mul = 1;
        this[offset + i] = value2 & 255;
        while (--i >= 0 && (mul *= 256)) {
          this[offset + i] = value2 / mul & 255;
        }
        return offset + byteLength2;
      };
      Buffer3.prototype.writeUint8 = Buffer3.prototype.writeUInt8 = function writeUInt8(value2, offset, noAssert) {
        value2 = +value2;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value2, offset, 1, 255, 0);
        this[offset] = value2 & 255;
        return offset + 1;
      };
      Buffer3.prototype.writeUint16LE = Buffer3.prototype.writeUInt16LE = function writeUInt16LE(value2, offset, noAssert) {
        value2 = +value2;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value2, offset, 2, 65535, 0);
        this[offset] = value2 & 255;
        this[offset + 1] = value2 >>> 8;
        return offset + 2;
      };
      Buffer3.prototype.writeUint16BE = Buffer3.prototype.writeUInt16BE = function writeUInt16BE(value2, offset, noAssert) {
        value2 = +value2;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value2, offset, 2, 65535, 0);
        this[offset] = value2 >>> 8;
        this[offset + 1] = value2 & 255;
        return offset + 2;
      };
      Buffer3.prototype.writeUint32LE = Buffer3.prototype.writeUInt32LE = function writeUInt32LE(value2, offset, noAssert) {
        value2 = +value2;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value2, offset, 4, 4294967295, 0);
        this[offset + 3] = value2 >>> 24;
        this[offset + 2] = value2 >>> 16;
        this[offset + 1] = value2 >>> 8;
        this[offset] = value2 & 255;
        return offset + 4;
      };
      Buffer3.prototype.writeUint32BE = Buffer3.prototype.writeUInt32BE = function writeUInt32BE(value2, offset, noAssert) {
        value2 = +value2;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value2, offset, 4, 4294967295, 0);
        this[offset] = value2 >>> 24;
        this[offset + 1] = value2 >>> 16;
        this[offset + 2] = value2 >>> 8;
        this[offset + 3] = value2 & 255;
        return offset + 4;
      };
      function wrtBigUInt64LE(buf, value2, offset, min, max) {
        checkIntBI(value2, min, max, buf, offset, 7);
        let lo = Number(value2 & BigInt(4294967295));
        buf[offset++] = lo;
        lo = lo >> 8;
        buf[offset++] = lo;
        lo = lo >> 8;
        buf[offset++] = lo;
        lo = lo >> 8;
        buf[offset++] = lo;
        let hi = Number(value2 >> BigInt(32) & BigInt(4294967295));
        buf[offset++] = hi;
        hi = hi >> 8;
        buf[offset++] = hi;
        hi = hi >> 8;
        buf[offset++] = hi;
        hi = hi >> 8;
        buf[offset++] = hi;
        return offset;
      }
      function wrtBigUInt64BE(buf, value2, offset, min, max) {
        checkIntBI(value2, min, max, buf, offset, 7);
        let lo = Number(value2 & BigInt(4294967295));
        buf[offset + 7] = lo;
        lo = lo >> 8;
        buf[offset + 6] = lo;
        lo = lo >> 8;
        buf[offset + 5] = lo;
        lo = lo >> 8;
        buf[offset + 4] = lo;
        let hi = Number(value2 >> BigInt(32) & BigInt(4294967295));
        buf[offset + 3] = hi;
        hi = hi >> 8;
        buf[offset + 2] = hi;
        hi = hi >> 8;
        buf[offset + 1] = hi;
        hi = hi >> 8;
        buf[offset] = hi;
        return offset + 8;
      }
      Buffer3.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE(value2, offset = 0) {
        return wrtBigUInt64LE(this, value2, offset, BigInt(0), BigInt("0xffffffffffffffff"));
      });
      Buffer3.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE(value2, offset = 0) {
        return wrtBigUInt64BE(this, value2, offset, BigInt(0), BigInt("0xffffffffffffffff"));
      });
      Buffer3.prototype.writeIntLE = function writeIntLE(value2, offset, byteLength2, noAssert) {
        value2 = +value2;
        offset = offset >>> 0;
        if (!noAssert) {
          const limit = Math.pow(2, 8 * byteLength2 - 1);
          checkInt(this, value2, offset, byteLength2, limit - 1, -limit);
        }
        let i = 0;
        let mul = 1;
        let sub = 0;
        this[offset] = value2 & 255;
        while (++i < byteLength2 && (mul *= 256)) {
          if (value2 < 0 && sub === 0 && this[offset + i - 1] !== 0) {
            sub = 1;
          }
          this[offset + i] = (value2 / mul >> 0) - sub & 255;
        }
        return offset + byteLength2;
      };
      Buffer3.prototype.writeIntBE = function writeIntBE(value2, offset, byteLength2, noAssert) {
        value2 = +value2;
        offset = offset >>> 0;
        if (!noAssert) {
          const limit = Math.pow(2, 8 * byteLength2 - 1);
          checkInt(this, value2, offset, byteLength2, limit - 1, -limit);
        }
        let i = byteLength2 - 1;
        let mul = 1;
        let sub = 0;
        this[offset + i] = value2 & 255;
        while (--i >= 0 && (mul *= 256)) {
          if (value2 < 0 && sub === 0 && this[offset + i + 1] !== 0) {
            sub = 1;
          }
          this[offset + i] = (value2 / mul >> 0) - sub & 255;
        }
        return offset + byteLength2;
      };
      Buffer3.prototype.writeInt8 = function writeInt8(value2, offset, noAssert) {
        value2 = +value2;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value2, offset, 1, 127, -128);
        if (value2 < 0) value2 = 255 + value2 + 1;
        this[offset] = value2 & 255;
        return offset + 1;
      };
      Buffer3.prototype.writeInt16LE = function writeInt16LE(value2, offset, noAssert) {
        value2 = +value2;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value2, offset, 2, 32767, -32768);
        this[offset] = value2 & 255;
        this[offset + 1] = value2 >>> 8;
        return offset + 2;
      };
      Buffer3.prototype.writeInt16BE = function writeInt16BE(value2, offset, noAssert) {
        value2 = +value2;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value2, offset, 2, 32767, -32768);
        this[offset] = value2 >>> 8;
        this[offset + 1] = value2 & 255;
        return offset + 2;
      };
      Buffer3.prototype.writeInt32LE = function writeInt32LE(value2, offset, noAssert) {
        value2 = +value2;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value2, offset, 4, 2147483647, -2147483648);
        this[offset] = value2 & 255;
        this[offset + 1] = value2 >>> 8;
        this[offset + 2] = value2 >>> 16;
        this[offset + 3] = value2 >>> 24;
        return offset + 4;
      };
      Buffer3.prototype.writeInt32BE = function writeInt32BE(value2, offset, noAssert) {
        value2 = +value2;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value2, offset, 4, 2147483647, -2147483648);
        if (value2 < 0) value2 = 4294967295 + value2 + 1;
        this[offset] = value2 >>> 24;
        this[offset + 1] = value2 >>> 16;
        this[offset + 2] = value2 >>> 8;
        this[offset + 3] = value2 & 255;
        return offset + 4;
      };
      Buffer3.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE(value2, offset = 0) {
        return wrtBigUInt64LE(this, value2, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
      });
      Buffer3.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE(value2, offset = 0) {
        return wrtBigUInt64BE(this, value2, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
      });
      function checkIEEE754(buf, value2, offset, ext, max, min) {
        if (offset + ext > buf.length) throw new RangeError("Index out of range");
        if (offset < 0) throw new RangeError("Index out of range");
      }
      function writeFloat(buf, value2, offset, littleEndian, noAssert) {
        value2 = +value2;
        offset = offset >>> 0;
        if (!noAssert) {
          checkIEEE754(buf, value2, offset, 4, 34028234663852886e22, -34028234663852886e22);
        }
        ieee754.write(buf, value2, offset, littleEndian, 23, 4);
        return offset + 4;
      }
      Buffer3.prototype.writeFloatLE = function writeFloatLE(value2, offset, noAssert) {
        return writeFloat(this, value2, offset, true, noAssert);
      };
      Buffer3.prototype.writeFloatBE = function writeFloatBE(value2, offset, noAssert) {
        return writeFloat(this, value2, offset, false, noAssert);
      };
      function writeDouble(buf, value2, offset, littleEndian, noAssert) {
        value2 = +value2;
        offset = offset >>> 0;
        if (!noAssert) {
          checkIEEE754(buf, value2, offset, 8, 17976931348623157e292, -17976931348623157e292);
        }
        ieee754.write(buf, value2, offset, littleEndian, 52, 8);
        return offset + 8;
      }
      Buffer3.prototype.writeDoubleLE = function writeDoubleLE(value2, offset, noAssert) {
        return writeDouble(this, value2, offset, true, noAssert);
      };
      Buffer3.prototype.writeDoubleBE = function writeDoubleBE(value2, offset, noAssert) {
        return writeDouble(this, value2, offset, false, noAssert);
      };
      Buffer3.prototype.copy = function copy(target, targetStart, start, end) {
        if (!Buffer3.isBuffer(target)) throw new TypeError("argument should be a Buffer");
        if (!start) start = 0;
        if (!end && end !== 0) end = this.length;
        if (targetStart >= target.length) targetStart = target.length;
        if (!targetStart) targetStart = 0;
        if (end > 0 && end < start) end = start;
        if (end === start) return 0;
        if (target.length === 0 || this.length === 0) return 0;
        if (targetStart < 0) {
          throw new RangeError("targetStart out of bounds");
        }
        if (start < 0 || start >= this.length) throw new RangeError("Index out of range");
        if (end < 0) throw new RangeError("sourceEnd out of bounds");
        if (end > this.length) end = this.length;
        if (target.length - targetStart < end - start) {
          end = target.length - targetStart + start;
        }
        const len = end - start;
        if (this === target && typeof Uint8Array.prototype.copyWithin === "function") {
          this.copyWithin(targetStart, start, end);
        } else {
          Uint8Array.prototype.set.call(
            target,
            this.subarray(start, end),
            targetStart
          );
        }
        return len;
      };
      Buffer3.prototype.fill = function fill(val, start, end, encoding) {
        if (typeof val === "string") {
          if (typeof start === "string") {
            encoding = start;
            start = 0;
            end = this.length;
          } else if (typeof end === "string") {
            encoding = end;
            end = this.length;
          }
          if (encoding !== void 0 && typeof encoding !== "string") {
            throw new TypeError("encoding must be a string");
          }
          if (typeof encoding === "string" && !Buffer3.isEncoding(encoding)) {
            throw new TypeError("Unknown encoding: " + encoding);
          }
          if (val.length === 1) {
            const code = val.charCodeAt(0);
            if (encoding === "utf8" && code < 128 || encoding === "latin1") {
              val = code;
            }
          }
        } else if (typeof val === "number") {
          val = val & 255;
        } else if (typeof val === "boolean") {
          val = Number(val);
        }
        if (start < 0 || this.length < start || this.length < end) {
          throw new RangeError("Out of range index");
        }
        if (end <= start) {
          return this;
        }
        start = start >>> 0;
        end = end === void 0 ? this.length : end >>> 0;
        if (!val) val = 0;
        let i;
        if (typeof val === "number") {
          for (i = start; i < end; ++i) {
            this[i] = val;
          }
        } else {
          const bytes = Buffer3.isBuffer(val) ? val : Buffer3.from(val, encoding);
          const len = bytes.length;
          if (len === 0) {
            throw new TypeError('The value "' + val + '" is invalid for argument "value"');
          }
          for (i = 0; i < end - start; ++i) {
            this[i + start] = bytes[i % len];
          }
        }
        return this;
      };
      var errors = {};
      function E(sym, getMessage, Base) {
        errors[sym] = class NodeError extends Base {
          constructor() {
            super();
            Object.defineProperty(this, "message", {
              value: getMessage.apply(this, arguments),
              writable: true,
              configurable: true
            });
            this.name = `${this.name} [${sym}]`;
            this.stack;
            delete this.name;
          }
          get code() {
            return sym;
          }
          set code(value2) {
            Object.defineProperty(this, "code", {
              configurable: true,
              enumerable: true,
              value: value2,
              writable: true
            });
          }
          toString() {
            return `${this.name} [${sym}]: ${this.message}`;
          }
        };
      }
      E(
        "ERR_BUFFER_OUT_OF_BOUNDS",
        function(name) {
          if (name) {
            return `${name} is outside of buffer bounds`;
          }
          return "Attempt to access memory outside buffer bounds";
        },
        RangeError
      );
      E(
        "ERR_INVALID_ARG_TYPE",
        function(name, actual) {
          return `The "${name}" argument must be of type number. Received type ${typeof actual}`;
        },
        TypeError
      );
      E(
        "ERR_OUT_OF_RANGE",
        function(str, range, input) {
          let msg = `The value of "${str}" is out of range.`;
          let received = input;
          if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
            received = addNumericalSeparator(String(input));
          } else if (typeof input === "bigint") {
            received = String(input);
            if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) {
              received = addNumericalSeparator(received);
            }
            received += "n";
          }
          msg += ` It must be ${range}. Received ${received}`;
          return msg;
        },
        RangeError
      );
      function addNumericalSeparator(val) {
        let res = "";
        let i = val.length;
        const start = val[0] === "-" ? 1 : 0;
        for (; i >= start + 4; i -= 3) {
          res = `_${val.slice(i - 3, i)}${res}`;
        }
        return `${val.slice(0, i)}${res}`;
      }
      function checkBounds(buf, offset, byteLength2) {
        validateNumber(offset, "offset");
        if (buf[offset] === void 0 || buf[offset + byteLength2] === void 0) {
          boundsError(offset, buf.length - (byteLength2 + 1));
        }
      }
      function checkIntBI(value2, min, max, buf, offset, byteLength2) {
        if (value2 > max || value2 < min) {
          const n = typeof min === "bigint" ? "n" : "";
          let range;
          if (byteLength2 > 3) {
            if (min === 0 || min === BigInt(0)) {
              range = `>= 0${n} and < 2${n} ** ${(byteLength2 + 1) * 8}${n}`;
            } else {
              range = `>= -(2${n} ** ${(byteLength2 + 1) * 8 - 1}${n}) and < 2 ** ${(byteLength2 + 1) * 8 - 1}${n}`;
            }
          } else {
            range = `>= ${min}${n} and <= ${max}${n}`;
          }
          throw new errors.ERR_OUT_OF_RANGE("value", range, value2);
        }
        checkBounds(buf, offset, byteLength2);
      }
      function validateNumber(value2, name) {
        if (typeof value2 !== "number") {
          throw new errors.ERR_INVALID_ARG_TYPE(name, "number", value2);
        }
      }
      function boundsError(value2, length, type) {
        if (Math.floor(value2) !== value2) {
          validateNumber(value2, type);
          throw new errors.ERR_OUT_OF_RANGE(type || "offset", "an integer", value2);
        }
        if (length < 0) {
          throw new errors.ERR_BUFFER_OUT_OF_BOUNDS();
        }
        throw new errors.ERR_OUT_OF_RANGE(
          type || "offset",
          `>= ${type ? 1 : 0} and <= ${length}`,
          value2
        );
      }
      var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;
      function base64clean(str) {
        str = str.split("=")[0];
        str = str.trim().replace(INVALID_BASE64_RE, "");
        if (str.length < 2) return "";
        while (str.length % 4 !== 0) {
          str = str + "=";
        }
        return str;
      }
      function utf8ToBytes(string, units) {
        units = units || Infinity;
        let codePoint;
        const length = string.length;
        let leadSurrogate = null;
        const bytes = [];
        for (let i = 0; i < length; ++i) {
          codePoint = string.charCodeAt(i);
          if (codePoint > 55295 && codePoint < 57344) {
            if (!leadSurrogate) {
              if (codePoint > 56319) {
                if ((units -= 3) > -1) bytes.push(239, 191, 189);
                continue;
              } else if (i + 1 === length) {
                if ((units -= 3) > -1) bytes.push(239, 191, 189);
                continue;
              }
              leadSurrogate = codePoint;
              continue;
            }
            if (codePoint < 56320) {
              if ((units -= 3) > -1) bytes.push(239, 191, 189);
              leadSurrogate = codePoint;
              continue;
            }
            codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
          } else if (leadSurrogate) {
            if ((units -= 3) > -1) bytes.push(239, 191, 189);
          }
          leadSurrogate = null;
          if (codePoint < 128) {
            if ((units -= 1) < 0) break;
            bytes.push(codePoint);
          } else if (codePoint < 2048) {
            if ((units -= 2) < 0) break;
            bytes.push(
              codePoint >> 6 | 192,
              codePoint & 63 | 128
            );
          } else if (codePoint < 65536) {
            if ((units -= 3) < 0) break;
            bytes.push(
              codePoint >> 12 | 224,
              codePoint >> 6 & 63 | 128,
              codePoint & 63 | 128
            );
          } else if (codePoint < 1114112) {
            if ((units -= 4) < 0) break;
            bytes.push(
              codePoint >> 18 | 240,
              codePoint >> 12 & 63 | 128,
              codePoint >> 6 & 63 | 128,
              codePoint & 63 | 128
            );
          } else {
            throw new Error("Invalid code point");
          }
        }
        return bytes;
      }
      function asciiToBytes(str) {
        const byteArray = [];
        for (let i = 0; i < str.length; ++i) {
          byteArray.push(str.charCodeAt(i) & 255);
        }
        return byteArray;
      }
      function utf16leToBytes(str, units) {
        let c, hi, lo;
        const byteArray = [];
        for (let i = 0; i < str.length; ++i) {
          if ((units -= 2) < 0) break;
          c = str.charCodeAt(i);
          hi = c >> 8;
          lo = c % 256;
          byteArray.push(lo);
          byteArray.push(hi);
        }
        return byteArray;
      }
      function base64ToBytes(str) {
        return base64.toByteArray(base64clean(str));
      }
      function blitBuffer(src, dst, offset, length) {
        let i;
        for (i = 0; i < length; ++i) {
          if (i + offset >= dst.length || i >= src.length) break;
          dst[i + offset] = src[i];
        }
        return i;
      }
      function isInstance(obj, type) {
        return obj instanceof type || obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type.name;
      }
      function numberIsNaN(obj) {
        return obj !== obj;
      }
      var hexSliceLookupTable = (function() {
        const alphabet = "0123456789abcdef";
        const table = new Array(256);
        for (let i = 0; i < 16; ++i) {
          const i16 = i * 16;
          for (let j = 0; j < 16; ++j) {
            table[i16 + j] = alphabet[i] + alphabet[j];
          }
        }
        return table;
      })();
      function defineBigIntMethod(fn) {
        return typeof BigInt === "undefined" ? BufferBigIntNotDefined : fn;
      }
      function BufferBigIntNotDefined() {
        throw new Error("BigInt not supported");
      }
    }
  });

  // shims/buffer-global.js
  var import_buffer;
  var init_buffer_global = __esm({
    "shims/buffer-global.js"() {
      import_buffer = __toESM(require_buffer());
    }
  });

  // shims/fs.js
  var fs_default;
  var init_fs = __esm({
    "shims/fs.js"() {
      init_buffer_global();
      fs_default = { openSync: (f) => f, fstatSync: (fd) => ({ size: fd.size }), closeSync() {
      }, statSync() {
        throw new Error("n/a");
      }, readSync() {
        throw new Error("n/a");
      } };
    }
  });

  // shims/path.js
  var basename, extname, path_default;
  var init_path = __esm({
    "shims/path.js"() {
      init_buffer_global();
      basename = (p) => typeof p === "object" && p ? p.name : String(p || "").split(/[\\/]/).pop();
      extname = (p) => {
        const m = basename(p).match(/\.[^.]*$/);
        return m ? m[0] : "";
      };
      path_default = { basename, extname, dirname: (p) => String(p).replace(/[\\/][^\\/]*$/, ""), join: (...a) => a.join("/") };
    }
  });

  // src/dvd/bytestream.js
  var readAtSync;
  var init_bytestream = __esm({
    "src/dvd/bytestream.js"() {
      init_buffer_global();
      readAtSync = (fd, pos, len) => fd.read(pos, len);
    }
  });

  // src/dvd/udifread.js
  function openUdif() {
    throw new Error("dmg n\xE3o suportado no browser");
  }
  var init_udifread = __esm({
    "src/dvd/udifread.js"() {
      init_buffer_global();
    }
  });

  // src/dvd/udf.js
  function readAt(fd, pos, len) {
    if (typeof fd === "object" && fd) return fd.read(pos, len);
    return readAtSync(fd, pos, len);
  }
  function detectLayout(fd, size) {
    const tryLayout = (base, stride, data) => {
      if (base < 0) return false;
      const p = base + 16 * stride + data;
      if (p + 6 > size) return false;
      const id = readAt(fd, p + 1, 5).toString("latin1");
      return VRS_IDS.has(id);
    };
    if (tryLayout(0, 2048, 0)) return { base: 0, stride: 2048, data: 0 };
    const head = readAt(fd, 0, 16);
    if (head.length === 16 && head.subarray(0, 12).equals(SYNC)) {
      const data = head[15] === 2 ? 24 : 16;
      for (const stride of [2352, 2448]) if (tryLayout(0, stride, data)) return { base: 0, stride, data };
    }
    const span = Math.min(size, 8 * 1024 * 1024);
    const buf = readAt(fd, 0, span);
    for (const id of ["CD001", "BEA01", "NSR02", "NSR03"]) {
      for (let i = buf.indexOf(id); i >= 1; i = buf.indexOf(id, i + 1)) {
        const at = i - 1;
        for (const [stride, data] of [[2048, 0], [2352, 16], [2352, 24], [2448, 16], [2448, 24], [2336, 8]]) {
          for (let k = 16; k <= 19; k++) {
            const base = at - data - k * stride;
            if (base < 0) continue;
            if (stride !== 2048) {
              const s = readAt(fd, base + k * stride, 12);
              if (stride !== 2336 && !s.equals(SYNC)) continue;
            }
            if (tryLayout(base, stride, data)) return { base, stride, data };
          }
        }
      }
    }
    return null;
  }
  function tagOk(b, ident) {
    if (b.length < 16) return false;
    if (ident != null && b.readUInt16LE(0) !== ident) return false;
    let sum = 0;
    for (let i = 0; i < 16; i++) if (i !== 4) sum = sum + b[i] & 255;
    return sum === b[4];
  }
  function openImage(file, { prefer = "udf" } = {}) {
    let fd;
    try {
      fd = fs_default.openSync(file, "r");
    } catch (e) {
      throw new ImageError("NOT_FOUND", `Imagem n\xE3o encontrada: ${file}`, e.code);
    }
    let udif = null;
    try {
      let size = fs_default.fstatSync(fd).size;
      const name = path_default.basename(file);
      if (!size) throw new ImageError("CORRUPT", `O ficheiro \xAB${name}\xBB est\xE1 vazio (0 bytes).`, "size=0");
      if (size >= 512 && readAt(fd, size - 512, 4).toString("latin1") === "koly") {
        let u;
        try {
          u = openUdif(file);
        } catch (e) {
          if (e.code === "UNSUPPORTED") throw new ImageError("UNSUPPORTED", `\xAB${name}\xBB: ${e.message}`, (e.compression || []).join(","));
          u = null;
        }
        if (u && !u.identity) {
          udif = u;
          fs_default.closeSync(fd);
          fd = u;
          size = u.size;
        } else u?.close();
      }
      const ev = evidenceOf(fd, size);
      if (ev.sacd) throw new ImageError("UNSUPPORTED", `\xAB${name}\xBB \xE9 um Super Audio CD (SACD): n\xE3o tem v\xEDdeo nem sistema de ficheiros leg\xEDvel.`, "SACDMTOC no sector 510");
      const layout = detectLayout(fd, size);
      if (!layout) {
        throw new ImageError("CORRUPT", `\xAB${name}\xBB n\xE3o tem sistema de ficheiros de disco (nem ISO9660 nem UDF)${ev.random ? ": os dados parecem aleat\xF3rios/cifrados" : ""}.`, ev.text);
      }
      const order = prefer === "iso9660" ? ["mountIso9660", "mountUdf"] : ["mountUdf", "mountIso9660"];
      const opened = [];
      for (const m of order) {
        const img = new Image(file, fd, size, layout);
        try {
          if (img[m]()) opened.push({ img, score: rootScore(img) });
        } catch {
        }
      }
      if (opened.length) {
        let best = opened[0];
        for (const o of opened.slice(1)) if (Math.floor(o.score / 1e3) > Math.floor(best.score / 1e3)) best = o;
        return best.img;
      }
      throw new ImageError(
        "CORRUPT",
        `\xAB${name}\xBB tem assinaturas de disco mas o sistema de ficheiros est\xE1 ileg\xEDvel (imagem truncada ou danificada).`,
        `layout=${JSON.stringify(layout)} tamanho=${size}`
      );
    } catch (e) {
      if (udif) udif.close();
      else fs_default.closeSync(fd);
      throw e;
    }
  }
  function rootScore(img) {
    let score = 0;
    try {
      const root = img.readdir("/");
      score += root.length;
      for (const k of root) {
        if (!k.dir || !/^(VIDEO_TS|BDMV|MPEGAV|MPEG2)$/i.test(k.name)) continue;
        try {
          if (img.readdir(`/${k.name}`).length) score += 1e3;
        } catch {
        }
      }
    } catch {
      score = -1;
    }
    return score;
  }
  function evidenceOf(fd, size) {
    const sacd = readAt(fd, 510 * SECTOR, 8).toString("latin1") === "SACDMTOC";
    const sample = readAt(fd, Math.max(0, Math.floor(size / 2 / SECTOR) * SECTOR), Math.min(size, 256 * 1024));
    const freq = new Array(256).fill(0);
    for (const x of sample) freq[x]++;
    let h = 0;
    for (const f of freq) if (f) {
      const p = f / sample.length;
      h -= p * Math.log2(p);
    }
    const packs = (() => {
      let n = 0;
      for (let i = 0; i + 4 <= sample.length; i += SECTOR) if (sample.readUInt32BE(i) === 442) n++;
      return n;
    })();
    const random = h > 7.9 && packs === 0;
    return { sacd, random, text: `entropia=${h.toFixed(3)} bits/byte, packs MPEG na amostra=${packs}, tamanho=${size}` };
  }
  var SECTOR, ImageError, SYNC, VRS_IDS, dstring, Image;
  var init_udf = __esm({
    "src/dvd/udf.js"() {
      init_buffer_global();
      init_fs();
      init_path();
      init_bytestream();
      init_udifread();
      SECTOR = 2048;
      ImageError = class extends Error {
        /** code: CORRUPT | UNSUPPORTED | NOT_FOUND; evidence: o que se viu (para mostrar/registar) */
        constructor(code, message, evidence) {
          super(message);
          this.name = "ImageError";
          this.code = code;
          if (evidence) this.evidence = evidence;
        }
      };
      SYNC = import_buffer.Buffer.from([0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0]);
      VRS_IDS = /* @__PURE__ */ new Set(["CD001", "BEA01", "NSR02", "NSR03", "TEA01", "BOOT2", "CDW02"]);
      dstring = (b) => {
        if (!b.length) return "";
        const c = b[0];
        if (c === 16 || c === 255) {
          let s = "";
          for (let i = 1; i + 1 < b.length; i += 2) s += String.fromCharCode(b.readUInt16BE(i));
          return s;
        }
        return b.subarray(1).toString("latin1");
      };
      Image = class {
        constructor(file, fd, size, layout) {
          this.file = file;
          this.fd = fd;
          this.size = size;
          this.layout = layout;
          this.contiguous = layout.stride === SECTOR;
          this.sectors = Math.floor((size - layout.base) / layout.stride);
          this.cache = /* @__PURE__ */ new Map();
        }
        posOf(sector) {
          return this.layout.base + sector * this.layout.stride + this.layout.data;
        }
        readSectors(sector, count) {
          if (this.contiguous) return readAt(this.fd, this.posOf(sector), count * SECTOR);
          const parts = [];
          for (let i = 0; i < count; i++) parts.push(readAt(this.fd, this.posOf(sector + i), SECTOR));
          return import_buffer.Buffer.concat(parts);
        }
        close() {
          try {
            if (typeof this.fd === "object") this.fd.close();
            else fs_default.closeSync(this.fd);
          } catch {
          }
        }
        /** A imagem é um disco virtual (UDIF comprimido): os bytes não estão no ficheiro tal e qual. */
        get virtualSource() {
          return typeof this.fd === "object" ? this.fd : null;
        }
        // ----- árvore de ficheiros (comum UDF/ISO9660) -----
        /** Entrada de um caminho ('/VIDEO_TS/VTS_01_1.VOB'), sem distinção de maiúsculas; null se não existir. */
        stat(p) {
          const parts = String(p || "/").split("/").filter(Boolean);
          let node = this.root;
          for (const part of parts) {
            if (!node?.dir) return null;
            const kids = this.children(node);
            node = kids.find((k) => k.name === part) || kids.find((k) => k.name.toUpperCase() === part.toUpperCase()) || null;
          }
          return node;
        }
        readdir(p) {
          const node = this.stat(p);
          if (!node) throw Object.assign(new Error(`ENOENT: ${p}`), { code: "ENOENT" });
          if (!node.dir) throw Object.assign(new Error(`ENOTDIR: ${p}`), { code: "ENOTDIR" });
          return this.children(node).map((k) => ({ name: k.name, dir: k.dir, size: k.size }));
        }
        children(node) {
          if (!node.kids) node.kids = this.fs === "udf" ? this.udfChildren(node) : this.isoChildren(node);
          return node.kids;
        }
        /** Lê `len` bytes do ficheiro a partir de `start` (zonas por gravar → zeros). */
        read(p, start = 0, len) {
          const node = typeof p === "string" ? this.stat(p) : p;
          if (!node || node.dir) throw Object.assign(new Error(`ENOENT: ${p}`), { code: "ENOENT" });
          return this.readData(node, start, len);
        }
        readData(node, start = 0, len) {
          if (node.inline) return node.inline.subarray(start, len == null ? void 0 : start + len);
          const end = Math.min(node.size, len == null ? node.size : start + len);
          const out = import_buffer.Buffer.alloc(Math.max(0, end - start));
          let off = 0;
          for (const e of node.extents) {
            const a = Math.max(start, off), b = Math.min(end, off + e.len);
            if (a < b && e.sector != null) {
              const s0 = e.sector + Math.floor((a - off) / SECTOR);
              const skip = (a - off) % SECTOR;
              const n = Math.ceil((skip + (b - a)) / SECTOR);
              const buf = this.readSectors(s0, n);
              buf.copy(out, a - start, skip, Math.min(buf.length, skip + (b - a)));
            }
            off += e.len;
            if (off >= end) break;
          }
          return out;
        }
        /**
         * Intervalos de bytes no ficheiro de imagem que correspondem a [start, end] (end inclusivo) do ficheiro.
         * Zonas não gravadas são omitidas. Em imagens raw cada sector é um intervalo próprio.
         */
        ranges(p, start = 0, end, { virtual = false } = {}) {
          const node = typeof p === "string" ? this.stat(p) : p;
          if (!node || node.dir || node.inline) return [];
          if (this.virtualSource && !virtual) {
            throw new ImageError("UNSUPPORTED", `\xAB${path_default.basename(this.file)}\xBB \xE9 uma .dmg comprimida (${Object.keys(this.virtualSource.kinds || {}).join(", ")}): este leitor ainda n\xE3o a transmite. Converta-a para .iso (hdiutil convert -format UDTO) para a ver aqui.`, "udif-virtual");
          }
          const last = Math.min(node.size - 1, end == null ? node.size - 1 : end);
          const out = [];
          let off = 0;
          for (const e of node.extents) {
            const a = Math.max(start, off), b = Math.min(last, off + e.len - 1);
            if (a <= b && e.sector != null) {
              if (this.contiguous) {
                const pos = this.posOf(e.sector) + (a - off);
                const prev = out[out.length - 1];
                if (prev && prev.end + 1 === pos) prev.end = pos + (b - a);
                else if (this.virtualSource) {
                  const src = this.virtualSource;
                  out.push({ file: void 0, image: this.file, start: pos, end: pos + (b - a), read: (p2, l) => src.read(p2, l) });
                } else out.push({ file: this.file, start: pos, end: pos + (b - a) });
              } else {
                for (let x = a; x <= b; ) {
                  const rel = x - off, sec = e.sector + Math.floor(rel / SECTOR), inS = rel % SECTOR;
                  const n = Math.min(SECTOR - inS, b - x + 1);
                  const pos = this.posOf(sec) + inS;
                  out.push({ file: this.file, start: pos, end: pos + n - 1 });
                  x += n;
                }
              }
            }
            off += e.len;
            if (off > last) break;
          }
          return out;
        }
        // ----- UDF -----
        mountUdf() {
          const total = this.sectors;
          let avdp = null;
          for (const s of [256, total - 256, total - 1, 512]) {
            if (s <= 0 || s >= total) continue;
            const b = this.readSectors(s, 1);
            if (tagOk(b, 2)) {
              avdp = b;
              break;
            }
          }
          if (!avdp) return false;
          const vdsLen = avdp.readUInt32LE(16), vdsLoc = avdp.readUInt32LE(20);
          const resLen = avdp.readUInt32LE(24), resLoc = avdp.readUInt32LE(28);
          const tryVds = (loc, len) => {
            const parts2 = /* @__PURE__ */ new Map();
            let lvd2 = null;
            const n = Math.min(64, Math.ceil(len / SECTOR));
            for (let i = 0; i < n; i++) {
              const b = this.readSectors(loc + i, 1);
              if (!tagOk(b)) continue;
              const id = b.readUInt16LE(0);
              if (id === 5) parts2.set(b.readUInt16LE(22), { start: b.readUInt32LE(188), length: b.readUInt32LE(192) });
              else if (id === 6) lvd2 = b;
              else if (id === 8) break;
            }
            return lvd2 && parts2.size ? { parts: parts2, lvd: lvd2 } : null;
          };
          const vds = tryVds(vdsLoc, vdsLen) || tryVds(resLoc, resLen);
          if (!vds) return false;
          const { parts, lvd } = vds;
          this.blockSize = lvd.readUInt32LE(212) || SECTOR;
          if (this.blockSize !== SECTOR) throw new ImageError("UNSUPPORTED", `UDF com blocos de ${this.blockSize} bytes n\xE3o suportado`);
          const nMaps = lvd.readUInt32LE(268);
          this.maps = [];
          let o = 440;
          for (let i = 0; i < nMaps && o + 2 <= lvd.length; i++) {
            const type = lvd[o], len = lvd[o + 1];
            if (!len) break;
            if (type === 1) {
              this.maps.push({ kind: "physical", part: parts.get(lvd.readUInt16LE(o + 4)) });
            } else if (type === 2) {
              const ident = lvd.toString("latin1", o + 5, o + 28).replace(/\0.*$/, "");
              const partNum = lvd.readUInt16LE(o + 38);
              const part = parts.get(partNum);
              if (/Metadata/i.test(ident)) this.maps.push({ kind: "metadata", part, file: lvd.readUInt32LE(o + 40), mirror: lvd.readUInt32LE(o + 44) });
              else if (/Sparable/i.test(ident)) this.maps.push({ kind: "physical", part });
              else this.maps.push({ kind: "unsupported", ident, part });
            }
            o += len;
          }
          if (!this.maps.length || this.maps.some((m) => !m.part)) return false;
          if (this.maps.some((m) => m.kind === "unsupported")) return false;
          for (const [i, m] of this.maps.entries()) {
            if (m.kind !== "metadata") continue;
            const phys = this.maps.findIndex((x) => x.kind === "physical" && x.part === m.part);
            const pref = phys >= 0 ? phys : i;
            let fe = null;
            for (const loc of [m.file, m.mirror]) {
              try {
                fe = this.udfFileEntry({ lbn: loc, part: pref, physOnly: m.part });
                if (fe) break;
              } catch {
              }
            }
            if (!fe) return false;
            m.extents = fe.extents;
          }
          const fsdLbn = lvd.readUInt32LE(252), fsdPart = lvd.readUInt16LE(256);
          const fsd = this.readBlock(fsdPart, fsdLbn);
          if (!tagOk(fsd, 256)) return false;
          const rootLbn = fsd.readUInt32LE(404), rootPart = fsd.readUInt16LE(408);
          const root = this.udfFileEntry({ lbn: rootLbn, part: rootPart });
          if (!root?.dir) return false;
          this.root = { ...root, name: "" };
          this.fs = "udf";
          this.volume = dstring(lvd.subarray(84, 84 + Math.min(127, lvd[84 + 127] || 127))).replace(/\0+$/, "");
          return true;
        }
        /** Sector físico de um bloco lógico (partição `part`). */
        sectorOf(part, lbn) {
          const m = this.maps[part];
          if (!m) throw new ImageError("CORRUPT", `UDF: refer\xEAncia a parti\xE7\xE3o inexistente (${part})`);
          if (m.kind === "physical" || !m.extents) return m.part.start + lbn;
          let off = lbn * SECTOR;
          for (const e of m.extents) {
            if (off < e.len) {
              if (e.sector == null) return null;
              return e.sector + Math.floor(off / SECTOR);
            }
            off -= e.len;
          }
          return null;
        }
        readBlock(part, lbn) {
          const s = this.sectorOf(part, lbn);
          if (s == null || s >= this.sectors) return import_buffer.Buffer.alloc(0);
          return this.readSectors(s, 1);
        }
        /** Lê um File Entry / Extended File Entry e devolve { dir, size, extents|inline }. */
        udfFileEntry({ lbn, part, physOnly }) {
          let b;
          if (physOnly) {
            const s = physOnly.start + lbn;
            b = s < this.sectors ? this.readSectors(s, 1) : import_buffer.Buffer.alloc(0);
          } else b = this.readBlock(part, lbn);
          if (b.length < 176) return null;
          const tag = b.readUInt16LE(0);
          if (!tagOk(b) || tag !== 261 && tag !== 266) return null;
          const fileType = b[16 + 11];
          const flags = b.readUInt16LE(16 + 18);
          const size = Number(b.readBigUInt64LE(56));
          const [lEa, lAd, base] = tag === 261 ? [b.readUInt32LE(168), b.readUInt32LE(172), 176] : [b.readUInt32LE(208), b.readUInt32LE(212), 216];
          const adType = flags & 7;
          const dir = fileType === 4;
          const ads = b.subarray(base + lEa, base + lEa + lAd);
          if (adType === 3) return { dir, size, inline: import_buffer.Buffer.from(ads.subarray(0, size)), extents: [] };
          const extents = [];
          const physPart = physOnly ? { start: physOnly.start } : null;
          const toSector = (p, l) => physPart ? physPart.start + l : this.sectorOf(p, l);
          let cur = ads, guard = 0;
          while (cur && guard++ < 4096) {
            let next = null;
            const step = adType === 0 ? 8 : adType === 1 ? 16 : 20;
            for (let i = 0; i + step <= cur.length; i += step) {
              const raw = cur.readUInt32LE(i);
              const len = raw & 1073741823, et = raw >>> 30;
              if (!len) break;
              let l, p = part;
              if (adType === 0) l = cur.readUInt32LE(i + 4);
              else if (adType === 1) {
                l = cur.readUInt32LE(i + 4);
                p = cur.readUInt16LE(i + 8);
              } else {
                l = cur.readUInt32LE(i + 12);
                p = cur.readUInt16LE(i + 16);
              }
              if (et === 3) {
                const aed = physPart ? this.readSectors(physPart.start + l, 1) : this.readBlock(p, l);
                if (tagOk(aed, 258)) next = aed.subarray(24, 24 + aed.readUInt32LE(20));
                break;
              }
              extents.push({ len, sector: et === 0 ? toSector(p, l) : null });
            }
            cur = next;
          }
          let left = size;
          const fixed = [];
          for (const e of extents) {
            if (left <= 0) break;
            const len = Math.min(e.len, left);
            fixed.push({ ...e, len });
            left -= len;
          }
          if (left > 0 && !dir) fixed.push({ len: left, sector: null });
          return { dir, size, extents: fixed, part };
        }
        udfChildren(node) {
          const data = this.readData(node, 0, node.size);
          const out = [];
          for (let o = 0; o + 38 <= data.length; ) {
            if (data.readUInt16LE(o) !== 257) break;
            const chars = data[o + 18], lFi = data[o + 19];
            const icbLbn = data.readUInt32LE(o + 24), icbPart = data.readUInt16LE(o + 28);
            const lIu = data.readUInt16LE(o + 36);
            const nameAt = o + 38 + lIu;
            const name = dstring(data.subarray(nameAt, nameAt + lFi));
            o += 4 * Math.ceil((38 + lIu + lFi) / 4);
            if (chars & 8 || chars & 4 || !name) continue;
            let fe = null;
            try {
              fe = this.udfFileEntry({ lbn: icbLbn, part: icbPart });
            } catch {
              fe = null;
            }
            if (!fe) {
              out.push({ name, dir: !!(chars & 2), size: 0, extents: [], broken: true });
              continue;
            }
            out.push({ name, ...fe });
          }
          return out;
        }
        // ----- ISO9660 -----
        mountIso9660() {
          let pvd = null, joliet = null;
          for (let s = 16; s < 64 && s < this.sectors; s++) {
            const b = this.readSectors(s, 1);
            if (b.toString("latin1", 1, 6) !== "CD001") {
              if (s > 16) break;
              else continue;
            }
            const type = b[0];
            if (type === 1 && !pvd) pvd = b;
            else if (type === 2 && b[88] === 37 && b[89] === 47 && [64, 67, 69].includes(b[90])) joliet = b;
            else if (type === 255) break;
          }
          const vd = joliet || pvd;
          if (!vd) return false;
          this.joliet = !!joliet;
          const rec = vd.subarray(156, 190);
          this.root = { name: "", dir: true, size: rec.readUInt32LE(10), extents: [{ sector: rec.readUInt32LE(2), len: rec.readUInt32LE(10) }] };
          this.fs = "iso9660";
          this.volume = (joliet ? import_buffer.Buffer.from(vd.subarray(40, 72)).swap16().toString("utf16le") : vd.toString("latin1", 40, 72)).trim();
          return true;
        }
        isoChildren(node) {
          const data = this.readData(node, 0, node.size);
          const out = [];
          let lastName = null;
          for (let o = 0; o < data.length; ) {
            const len = data[o];
            if (!len) {
              o = (Math.floor(o / SECTOR) + 1) * SECTOR;
              continue;
            }
            if (o + 33 > data.length) break;
            const lba = data.readUInt32LE(o + 2), size = data.readUInt32LE(o + 10), flags = data[o + 25], nl = data[o + 32];
            const rawName = data.subarray(o + 33, o + 33 + nl);
            o += len;
            if (nl === 1 && (rawName[0] === 0 || rawName[0] === 1)) continue;
            let name = this.joliet ? import_buffer.Buffer.from(rawName).swap16().toString("utf16le") : rawName.toString("latin1");
            name = name.replace(/;\d+$/, "").replace(/\.$/, "");
            const ext = { sector: lba, len: size };
            const prev = out[out.length - 1];
            if (prev && prev.multi && lastName === name) {
              prev.extents.push(ext);
              prev.size += size;
              prev.multi = !!(flags & 128);
              continue;
            }
            out.push({ name, dir: !!(flags & 2), size, extents: [ext], multi: !!(flags & 128) });
            lastName = name;
          }
          return out;
        }
      };
    }
  });

  // src/dtscd.js
  function findDtsSync(buf, minSyncs = MIN_SYNCS) {
    let best = null;
    for (const s of SYNCS) {
      let first = -1, count = 0;
      for (let i = 0; i + 6 <= buf.length; i += 2) {
        if (s.test(buf, i)) {
          if (first < 0) first = i;
          count++;
        }
      }
      if (count >= minSyncs && (!best || count > best.count)) best = { format: s.format, first, count };
    }
    return best;
  }
  function parseWavHeader(buf) {
    if (buf.length < 12 || buf.toString("latin1", 0, 4) !== "RIFF" || buf.toString("latin1", 8, 12) !== "WAVE") return null;
    let o = 12, fmt = null;
    while (o + 8 <= buf.length) {
      const id = buf.toString("latin1", o, o + 4), len = buf.readUInt32LE(o + 4);
      if (id === "fmt " && o + 24 <= buf.length) {
        fmt = { codec: buf.readUInt16LE(o + 8), channels: buf.readUInt16LE(o + 10), rate: buf.readUInt32LE(o + 12), bits: buf.readUInt16LE(o + 22) };
      } else if (id === "data") {
        return { ...fmt || {}, dataOffset: o + 8, dataLength: len };
      }
      o += 8 + len + (len & 1);
    }
    return null;
  }
  function sniffDtsCd(head) {
    const wav = parseWavHeader(head);
    if (wav) {
      if (![1, 65534].includes(wav.codec) || wav.channels !== 2 || wav.bits !== 16) return null;
      const s2 = findDtsSync(head.subarray(wav.dataOffset));
      if (!s2) return null;
      return { format: s2.format, dataOffset: wav.dataOffset, bytesPerSec: wav.rate * 4, rate: wav.rate };
    }
    const s = findDtsSync(head);
    return s ? { format: s.format, dataOffset: 0, bytesPerSec: 176400, rate: 44100 } : null;
  }
  var HEAD, MIN_SYNCS, SYNCS;
  var init_dtscd = __esm({
    "src/dtscd.js"() {
      init_buffer_global();
      init_fs();
      HEAD = 256 * 1024;
      MIN_SYNCS = 4;
      SYNCS = [
        { format: "16be", test: (b, i) => b[i] === 127 && b[i + 1] === 254 && b[i + 2] === 128 && b[i + 3] === 1 },
        { format: "16le", test: (b, i) => b[i] === 254 && b[i + 1] === 127 && b[i + 2] === 1 && b[i + 3] === 128 },
        // 14 bits: 0x1FFF 0xE800 0x07Fx (big-endian) / 0xFF1F 0x00E8 0xFx07 (little-endian)
        { format: "14be", test: (b, i) => b[i] === 31 && b[i + 1] === 255 && b[i + 2] === 232 && b[i + 3] === 0 && b[i + 4] === 7 && (b[i + 5] & 240) === 240 },
        { format: "14le", test: (b, i) => b[i] === 255 && b[i + 1] === 31 && b[i + 2] === 0 && b[i + 3] === 232 && (b[i + 4] & 240) === 240 && b[i + 5] === 7 }
      ];
    }
  });

  // src/tags/cue.js
  function decodeCue(buf) {
    if (buf.length >= 3 && buf[0] === 239 && buf[1] === 187 && buf[2] === 191) return buf.subarray(3).toString("utf8");
    if (buf.length >= 2 && buf[0] === 255 && buf[1] === 254) return buf.subarray(2).toString("utf16le");
    if (buf.length >= 2 && buf[0] === 254 && buf[1] === 255) {
      const b = import_buffer.Buffer.from(buf.subarray(2, 2 + (buf.length - 2 & ~1)));
      b.swap16();
      return b.toString("utf16le");
    }
    let z0 = 0, z1 = 0;
    for (let i = 0; i < Math.min(buf.length, 400); i++) if (!buf[i]) i & 1 ? z1++ : z0++;
    if (z1 > 40 && z0 < 4) return buf.toString("utf16le");
    if (z0 > 40 && z1 < 4) {
      const b = import_buffer.Buffer.from(buf.subarray(0, buf.length & ~1));
      b.swap16();
      return b.toString("utf16le");
    }
    try {
      return new TextDecoder("utf-8", { fatal: true }).decode(buf);
    } catch {
    }
    try {
      return new TextDecoder("windows-1252").decode(buf);
    } catch {
      return buf.toString("latin1");
    }
  }
  function cueTime(s) {
    const m = String(s).trim().match(/^(\d+):(\d{1,2})(?:[:.](\d{1,2}))?$/);
    if (!m) return null;
    return +m[1] * 60 + +m[2] + (m[3] ? +m[3] / FRAMES : 0);
  }
  function value(rest) {
    rest = rest.trim();
    if (rest.startsWith('"')) {
      const end = rest.indexOf('"', 1);
      return end > 0 ? rest.slice(1, end) : rest.slice(1);
    }
    return rest.replace(/^'(.*)'$/, "$1");
  }
  function parseCue(text) {
    const cue = { title: null, performer: null, date: null, genre: null, comment: null, files: [], tracks: [] };
    let file = null, track = null;
    for (const raw of String(text).replace(/^﻿/, "").split(/\r\n|\r|\n/)) {
      const line = raw.replace(/\u0000/g, "").trim();
      if (!line) continue;
      const sp = line.search(/\s/);
      const cmd = (sp < 0 ? line : line.slice(0, sp)).toUpperCase();
      const rest = sp < 0 ? "" : line.slice(sp + 1);
      switch (cmd) {
        case "REM": {
          const m = rest.match(/^(\S+)\s*(.*)$/);
          if (!m) break;
          const k = m[1].toUpperCase(), v = value(m[2]);
          const target = track || cue;
          if (k === "DATE" || k === "YEAR") target.date ??= v || null;
          else if (k === "GENRE") cue.genre ??= v || null;
          else if (k === "COMMENT") target.comment ??= v || null;
          else if (k === "DISCNUMBER") cue.disc ??= parseInt(v, 10) || null;
          break;
        }
        case "FILE": {
          let r = rest.trim(), name;
          if (r.startsWith('"')) name = value(r);
          else name = r.replace(FILE_TYPES, "").trim();
          file = { name, tracks: [] };
          cue.files.push(file);
          break;
        }
        case "TRACK": {
          const m = rest.match(/^(\d+)\s*(\S*)/);
          track = { n: m ? +m[1] : cue.tracks.length + 1, type: (m?.[2] || "AUDIO").toUpperCase(), title: null, performer: null, file: null, index: {} };
          cue.tracks.push(track);
          break;
        }
        case "TITLE":
        case "PERFORMER":
        case "SONGWRITER": {
          const k = cmd.toLowerCase(), v = value(rest) || null;
          if (track) track[k] = v;
          else cue[k] = v;
          break;
        }
        case "INDEX": {
          if (!track) break;
          const m = rest.match(/^(\d+)\s+(\S+)/);
          if (!m) break;
          const t = cueTime(m[2]);
          if (t == null) break;
          track.index[+m[1]] = { time: t, file: file ? cue.files.indexOf(file) : 0 };
          break;
        }
        default:
          break;
      }
    }
    if (!cue.files.length) cue.files.push({ name: null, tracks: [] });
    for (const t of cue.tracks) {
      const i = t.index[1] || t.index[0] || null;
      t.file = i ? i.file : Math.max(0, cue.files.length - 1);
      t.start = i ? i.time : 0;
      if (t.type === "AUDIO") cue.files[t.file].tracks.push(t);
    }
    for (const f of cue.files) {
      f.tracks.sort((a, b) => a.start - b.start || a.n - b.n);
      f.tracks.forEach((t, i) => {
        t.end = f.tracks[i + 1] ? f.tracks[i + 1].start : null;
      });
    }
    return cue;
  }
  function resolveCueFiles(cue, audioFiles, cuePath = "") {
    const byName = /* @__PURE__ */ new Map(), byStem = /* @__PURE__ */ new Map();
    for (const a of audioFiles) {
      byName.set(norm(baseOf(a)), a);
      const s = stem(baseOf(a));
      if (!byStem.has(s)) byStem.set(s, []);
      byStem.get(s).push(a);
    }
    const used = /* @__PURE__ */ new Set();
    const out = cue.files.map((f) => {
      const b = baseOf(f.name);
      let hit = b && byName.get(norm(b));
      if (hit) return { path: hit, how: "nome" };
      const c = b && byStem.get(stem(b));
      if (c?.length) return { path: c[0], how: "extens\xE3o" };
      return { path: null, how: null };
    });
    for (const r of out) if (r.path) used.add(r.path);
    const missing = out.filter((r) => !r.path);
    if (missing.length) {
      const free = audioFiles.filter((a) => !used.has(a));
      if (cue.files.length === 1 && audioFiles.length === 1) Object.assign(out[0], { path: audioFiles[0], how: "\xFAnico" });
      else if (cue.files.length === 1 && cuePath) {
        const s = stem(baseOf(cuePath));
        const c = (byStem.get(s) || []).filter((a) => !used.has(a));
        if (c.length) Object.assign(out[0], { path: c[0], how: "nome da cue" });
        else if (free.length === 1) Object.assign(out[0], { path: free[0], how: "\xFAnico livre" });
      } else if (missing.length === free.length && missing.length > 1) {
        const sorted = [...free].sort((a, b) => baseOf(a).localeCompare(baseOf(b), void 0, { numeric: true }));
        missing.forEach((r, i) => Object.assign(r, { path: sorted[i], how: "ordem" }));
      }
    }
    return out;
  }
  var FRAMES, FILE_TYPES, norm, stem, baseOf;
  var init_cue = __esm({
    "src/tags/cue.js"() {
      init_buffer_global();
      init_path();
      FRAMES = 75;
      FILE_TYPES = /\s+(WAVE|WAV|MP3|AIFF|BINARY|MOTOROLA|FLAC|APE|WV)\s*$/i;
      norm = (s) => String(s || "").normalize("NFC").toLowerCase().replace(/\s+/g, " ").trim();
      stem = (s) => norm(s).replace(/\.[a-z0-9]{2,5}$/i, "");
      baseOf = (s) => String(s || "").split(/[\\/]/).pop();
    }
  });

  // disc-worker.js
  var require_disc_worker = __commonJS({
    "disc-worker.js"() {
      init_buffer_global();
      init_udf();
      init_dtscd();
      init_cue();
      var frs = new FileReaderSync();
      function source(file) {
        return {
          name: file.name,
          size: file.size,
          kinds: {},
          read(pos, len) {
            return import_buffer.Buffer.from(frs.readAsArrayBuffer(file.slice(pos, pos + len)));
          },
          close() {
          }
        };
      }
      var SECTOR2 = 2048;
      function scrambledPes(buf) {
        let pes = 0, scrambled = 0;
        for (let o = 0; o + 32 <= buf.length; o += SECTOR2) {
          if (buf.readUInt32BE(o) !== 442 || (buf[o + 4] & 196) !== 68) continue;
          const p = o + 14 + (buf[o + 13] & 7);
          if (p + 8 > buf.length) continue;
          const code = buf.readUInt32BE(p);
          if (!(code === 445 || code >= 448 && code <= 495)) continue;
          if ((buf[p + 6] & 192) !== 128) continue;
          pes++;
          if (buf[p + 6] & 48) scrambled++;
        }
        return { pes, scrambled };
      }
      var isScrambled = ({ pes, scrambled }) => scrambled >= 16 && scrambled >= pes * 0.05;
      function encrypted(parts) {
        const total = parts.reduce((a, p) => a + p.size, 0), tot = { pes: 0, scrambled: 0 };
        for (const f of [0.05, 0.25, 0.45, 0.65, 0.85]) {
          let at = Math.floor(total * f / SECTOR2) * SECTOR2;
          for (const p of parts) {
            if (at >= p.size) {
              at -= p.size;
              continue;
            }
            const c = scrambledPes(p.read(at, 64 * SECTOR2));
            tot.pes += c.pes;
            tot.scrambled += c.scrambled;
            break;
          }
          if (isScrambled(tot)) return true;
        }
        return false;
      }
      function pickMain(list) {
        const up = (s) => s.toUpperCase();
        const vts = /* @__PURE__ */ new Map();
        for (const f of list) {
          const m = up(f.path).match(/(?:^|\/)VIDEO_TS\/VTS_(\d\d)_([1-9])\.VOB$/);
          if (m) {
            if (!vts.has(m[1])) vts.set(m[1], []);
            vts.get(m[1]).push(f);
          }
        }
        if (vts.size) {
          let best = null;
          for (const [k, fs] of vts) {
            const s = fs.reduce((a, f) => a + f.size, 0);
            if (!best || s > best.size) best = { kind: "dvd", vts: k, size: s, files: fs.sort((a, b) => a.path.localeCompare(b.path)) };
          }
          return best;
        }
        const pick = (re, kind) => {
          const c = list.filter((f) => re.test(up(f.path))).sort((a, b) => b.size - a.size)[0];
          return c ? { kind, size: c.size, files: [c] } : null;
        };
        return pick(/(?:^|\/)BDMV\/STREAM\/[^/]+\.M2TS$/, "bluray") || pick(/(?:^|\/)(MPEGAV|MPEG2)\/[^/]+\.(DAT|MPG)$/, "vcd") || pick(/\.(VOB|M2TS|MTS|MPG|MPEG|TS|DAT|MKV|MP4|AVI)$/, "disc");
      }
      function walk(img, dir, out, depth = 0) {
        if (depth > 6) return out;
        for (const e of img.readdir(dir)) {
          const p = `${dir === "/" ? "" : dir}/${e.name}`;
          if (e.dir) walk(img, p, out, depth + 1);
          else out.push({ path: p, size: e.size });
        }
        return out;
      }
      var ops = {
        /** ISO → { kind, label, parts: [[{start,end}]...], sizes, encrypted } (intervalos de bytes no próprio .iso) */
        image({ file }) {
          const img = openImage(source(file));
          const list = walk(img, "/", []);
          const main = pickMain(list);
          if (!main) return { error: "N\xE3o encontrei v\xEDdeo nesta imagem de disco.", files: list.slice(0, 50) };
          const parts = main.files.map((f) => img.ranges(f.path, 0, null, { virtual: true }).map((r) => [r.start, r.end + 1]));
          const enc = main.kind === "dvd" && encrypted(main.files.map((f) => ({ size: f.size, read: (p, l) => img.read(f.path, p, Math.min(l, f.size - p)) })));
          return { kind: main.kind, label: img.volume || null, fs: img.fs, names: main.files.map((f) => f.path), sizes: main.files.map((f) => f.size), parts, encrypted: enc };
        },
        /** Pasta (VIDEO_TS/BDMV…) já aberta: escolhe o título principal entre os ficheiros */
        folder({ files }) {
          const main = pickMain(files);
          if (!main) return { error: "N\xE3o encontrei v\xEDdeo de DVD/Blu-ray nesta pasta." };
          const enc = main.kind === "dvd" && encrypted(main.files.map((f) => ({ size: f.size, read: (p, l) => source(f.file).read(p, l) })));
          return { kind: main.kind, names: main.files.map((f) => f.path), encrypted: enc };
        },
        dts({ file }) {
          return sniffDtsCd(source(file).read(0, 256 * 1024));
        },
        cue({ file, audio }) {
          const cue = parseCue(decodeCue(source(file).read(0, Math.min(file.size, 1 << 20))));
          const map = resolveCueFiles(cue, audio, file.name);
          return { cue: { title: cue.title, performer: cue.performer, date: cue.date, files: cue.files.map((f, i) => ({ name: f.name, match: map[i].path, tracks: f.tracks.map((t) => ({ n: t.n, title: t.title, performer: t.performer, start: t.start, end: t.end })) })) } };
        }
      };
      self.onmessage = (e) => {
        const { id, op, args } = e.data;
        try {
          self.postMessage({ id, ok: true, result: ops[op](args) });
        } catch (err) {
          self.postMessage({ id, ok: false, error: err.message || String(err), code: err.code });
        }
      };
    }
  });
  require_disc_worker();
})();
