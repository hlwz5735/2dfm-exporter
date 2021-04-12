import _2DFMPalette from '@/entity/2dfm-palette'

export function readPalette(buffer: Uint8Array, isPrivate: boolean): _2DFMPalette {
  const palette = new _2DFMPalette()
  palette.isPrivate = isPrivate

  for (let i = 0; i < 1024; i += 4) {
    palette.pushBGRA(buffer, i)
  }
  if (!isPrivate) {
    palette.unknownGap = buffer.slice(1024)
  }
  return palette
}
