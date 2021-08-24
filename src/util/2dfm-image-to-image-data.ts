import _2DFMPlayer from '@/entity/2dfm-player'
import _2DFMSpriteFrame from '@/entity/2dfm-sprite-frame'
import _2DFMPalette from '@/entity/2dfm-palette'
import { decompress } from '@/util/2dfm-image-decompress'
import { readPalette } from '@/util/2dfm-palette-reader'

export function getImageDataByIndex(player: _2DFMPlayer, index = 0): ImageData | undefined {
  const sprite = player.spriteFrames[index]

  if (!sprite || sprite.width * sprite.height === 0) {
    return
  }

  let size = sprite.size
  if (sprite.size === 0) {
    size = sprite.width * sprite.height + (sprite.hasPrivatePalette ? 1024 : 0)
  }

  let buffer = Uint8Array.from(player.bytes.slice(sprite.offset + 20, sprite.offset + 20 + size))
  if (_2DFMSpriteFrame.prototype.compressed.call(sprite)) {
    buffer = decompress(buffer, _2DFMSpriteFrame.prototype.realSize.call(sprite))!
  }

  const { width, height } = sprite
  let palette: _2DFMPalette

  let imageBuffer
  if (sprite.hasPrivatePalette) {
    palette = readPalette(buffer, true)
    sprite.privatePalette = palette
    imageBuffer = buffer.slice(1024)
  } else {
    palette = player.publicPalettes[0]
    imageBuffer = buffer
  }

  const imageDataBuffer = new Uint8ClampedArray(width * height * 4)

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const pixelIndex = y * width + x
      const colorIndex = imageBuffer[pixelIndex]
      const color = palette.colors[colorIndex]
      imageDataBuffer[pixelIndex * 4] = color.rawData[0]
      imageDataBuffer[pixelIndex * 4 + 1] = color.rawData[1]
      imageDataBuffer[pixelIndex * 4 + 2] = color.rawData[2]
      imageDataBuffer[pixelIndex * 4 + 3] = color.rawData[3]
    }
  }

  return new ImageData(imageDataBuffer, width, height)
}

export function getImageCanvasByIndex(player: _2DFMPlayer, index = 0): HTMLCanvasElement | undefined {
  const imageData = getImageDataByIndex(player, index)
  if (!imageData) {
    return
  }

  const canvas = document.createElement('canvas') as HTMLCanvasElement
  canvas.width = imageData.width
  canvas.height = imageData.height
  canvas.getContext('2d')!.putImageData(imageData, 0, 0)
  return canvas
}
