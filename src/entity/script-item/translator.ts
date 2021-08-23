import AbsoluteScriptItem from '@/entity/script-item/absolute-script-item'

export default interface Translator<T extends AbsoluteScriptItem> {
  decode(bytes: Uint8Array): T
  encode(item: T): Uint8Array
}
