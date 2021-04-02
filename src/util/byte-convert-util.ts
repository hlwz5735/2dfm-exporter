export function byteToShort(bytes: Int8Array | Uint8Array, offset = 0): number {
  const buffer = bytes.buffer.slice(offset, offset + 2)
  const result = new Int16Array(buffer)
  return result[0]
}

export function byteToUShort(bytes: Int8Array | Uint8Array, offset = 0): number {
  return bytes[offset] & 0xff | (bytes[offset + 1] & 0xff) << 8
}

export function byteToInt(bytes: Int8Array | Uint8Array, offset = 0): number {
  const buffer = bytes.buffer.slice(offset, offset + 4)
  const result = new Int32Array(buffer)
  return result[0]
}

export function byteToUInt(bytes: Int8Array | Uint8Array, offset = 0): number {
  return bytes[offset] & 0xff |
    (bytes[offset + 1] & 0xff) << 8 |
    (bytes[offset + 2] & 0xff) << 16 |
    (bytes[offset + 3] & 0xff) << 24
}

export function byteToLong(bytes: Int8Array | Uint8Array, offset = 0): bigint {
  const buffer = bytes.buffer.slice(offset, offset + 8)
  const result = new BigInt64Array(buffer)
  return result[0]
}

export function byteToULong(bytes: Int8Array | Uint8Array, offset = 0): bigint {
  const buffer = bytes.buffer.slice(offset, offset + 8)
  const result = new BigUint64Array(buffer)
  return result[0]
}
