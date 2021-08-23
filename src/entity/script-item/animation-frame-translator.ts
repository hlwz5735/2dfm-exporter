import Translator from '@/entity/script-item/translator'
import AnimationFrame from '@/entity/script-item/animation-frame'
import { byteToShort, byteToUShort } from '@/util/byte-convert-util'
import { Vec2 } from '@/types/Geo'

class AnimationFrameTranslator implements Translator<AnimationFrame> {
  decode(bytes: Uint8Array): AnimationFrame {
    const item = new AnimationFrame()

    item.freezeTime = byteToUShort(bytes, 0)
    item.picIndex = byteToUShort(bytes, 2)
    item.offset = new Vec2(byteToShort(bytes, 4), byteToShort(bytes, 6))
    item.fixDir = bytes[8] === 1

    return item
  }

  encode(item: AnimationFrame): Uint8Array {
    return new Uint8Array()
  }
}

const instance = new AnimationFrameTranslator()

export {
  AnimationFrameTranslator as default,
  instance,
}
