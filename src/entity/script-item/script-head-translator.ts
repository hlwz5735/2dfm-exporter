import Translator from '@/entity/script-item/translator'
import ScriptHead from '@/entity/script-item/script-head'

class ScriptHeadTranslator implements Translator<ScriptHead> {
  decode(bytes: Uint8Array): ScriptHead {
    const item = new ScriptHead()
    item.level = bytes[1]
    return item
  }

  encode(item: ScriptHead): Uint8Array {
    return new Uint8Array();
  }
}

const instance = new ScriptHeadTranslator()

export {
  ScriptHeadTranslator as default,
  instance
}
