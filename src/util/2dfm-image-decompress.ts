/** 变种LSZZ算法 */
import { byteToShort } from '@/util/byte-convert-util'

export function decompress(originBytes: Uint8Array, destSize: number): Uint8Array | null {
  if (destSize <= 0) {
    return null
  }
  const result = new Uint8Array(destSize)

  let inputOffset = 0
  let resultPointer = 0
  while (inputOffset < originBytes.length) {
    let current = originBytes[inputOffset]
    // type只取前2位，4种取值
    const type = current >> 6
    // current取后6位，最大值63
    current = current & 0x3f
    // 如果current是0，则向后取1字节
    if (current === 0) {
      inputOffset += 1
      current = originBytes[inputOffset]
      // 如果后1字节还是0，向后再取2字节，配合第3字节组合得到新的current
      if (current === 0) {
        inputOffset += 1
        // 后2字节对应的整数
        current = byteToShort(originBytes, inputOffset)
        inputOffset += 2
        //
        const highBits = originBytes[inputOffset] << 16
        current = current + highBits + 0x013f // 0000 0001 0011 1111
        // 否则加上 0011 1111
      } else {
        current += 0x3f
      }
    }
    switch (type) {
      // 接current个0
      case 0:
        if (current > 0) {
          const zeroArray = []
          for (let i = 0; i < current; i++) {
            zeroArray.push(0)
          }
          result.set(zeroArray, resultPointer)
          resultPointer += current
        }
        break
      // 取接下来current个字节
      case 1:
        if (current > 0) {
          const content = originBytes.slice(inputOffset + 1, inputOffset + 1 + current)
          result.set(content, resultPointer)
          resultPointer += current
          inputOffset += current
        }
        break
      // 接current个下一字节
      case 2: {
        inputOffset += 1
        const nextByte = originBytes[inputOffset]
        const repeatByteArray = []
        for (let i = 0; i < current; i++) {
          repeatByteArray.push(nextByte)
        }
        result.set(repeatByteArray, resultPointer)
        resultPointer += current
      } break
      // 先取下一字节得到要向上重复的字节数，再重复此前对应count个已有字节
      case 3: {
        inputOffset += 1
        let backTraceCount = originBytes[inputOffset]
        if (backTraceCount === 0) {
          inputOffset += 1
          backTraceCount = (originBytes[inputOffset] + 1) << 8
        }
        const backTraceStart = resultPointer - backTraceCount
        const content = result.slice(backTraceStart, backTraceStart + current)
        result.set(content, resultPointer)
        resultPointer += current
      } break
    }
    inputOffset++
  }

  return result
}
