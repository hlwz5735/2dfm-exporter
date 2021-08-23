import AbsoluteScriptItem from '@/entity/script-item/absolute-script-item'
import ScriptItemTypes from '@/entity/script-item/script-item-types'

export default class ScriptHead extends AbsoluteScriptItem {
  /**
   * @param level 招式级别
   */
  constructor(public level: number = 0) {
    super(ScriptItemTypes.ScriptHead)
  }
}
