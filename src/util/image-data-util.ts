export function flipX(source: ImageData): ImageData {
  const { width, height } = source
  const dest = new ImageData(width, height)

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const destIdx = (y * width + x) * 4
      const sourceIdx = (y * width + (width - x - 1)) * 4
      fillPixel(source, dest, sourceIdx, destIdx)
    }
  }

  return dest
}

export function flipY(source: ImageData): ImageData {
  const { width, height } = source
  const dest = new ImageData(width, height)

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const destIdx = (y * width + x) * 4
      const sourceIdx = ((height - y - 1) * width + x) * 4
      fillPixel(source, dest, sourceIdx, destIdx)
    }
  }

  return dest
}

export function flipXY(source: ImageData): ImageData {
  const { width, height } = source
  const dest = new ImageData(width, height)

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const destIdx = (y * width + x) * 4
      const sourceIdx = ((height - y - 1) * width + (width - x - 1)) * 4
      fillPixel(source, dest, sourceIdx, destIdx)
    }
  }

  return dest
}

function fillPixel(source: ImageData, dest: ImageData, sourceIdx: number, destIdx: number) {
  dest.data[destIdx] = source.data[sourceIdx]
  dest.data[destIdx + 1] = source.data[sourceIdx + 1]
  dest.data[destIdx + 2] = source.data[sourceIdx + 2]
  dest.data[destIdx + 3] = source.data[sourceIdx + 3]
}
