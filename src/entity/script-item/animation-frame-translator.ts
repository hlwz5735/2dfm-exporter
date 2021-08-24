import Translator from '@/entity/script-item/translator'
import AnimationFrame from '@/entity/script-item/animation-frame'
import { byteToShort, byteToUShort } from '@/util/byte-convert-util'
import { Vec2 } from '@/types/Geo'

class AnimationFrameTranslator implements Translator<AnimationFrame> {
  decode(bytes: Uint8Array): AnimationFrame {
    const item = new AnimationFrame()

    item.freezeTime = byteToUShort(bytes, 0)
    const picIndexBuffer = new Uint8Array(2)
    picIndexBuffer[0] = bytes[2]
    picIndexBuffer[1] = bytes[3] & 0b00111111
    item.picIndex = byteToUShort(picIndexBuffer)
    item.offset = new Vec2(byteToShort(bytes, 4), byteToShort(bytes, 6))
    item.flipX = !!(bytes[3] & 0b01000000)
    item.flipY = !!(bytes[3] & 0b10000000)
    item.fixDir = bytes[8] === 1

    return item
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  encode(item: AnimationFrame): Uint8Array {
    return new Uint8Array()
  }
}

const instance = new AnimationFrameTranslator()

export {
  AnimationFrameTranslator as default,
  instance,
}
