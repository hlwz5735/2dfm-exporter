import { Vec2 } from '@/types/Geo'
import AbsoluteScriptItem from '@/entity/script-item/absolute-script-item'
import ScriptItemTypes from '@/entity/script-item/script-item-types'

export default class AnimationFrame extends AbsoluteScriptItem {
  constructor() {
    super(ScriptItemTypes.AnimationFrame)
  }

  /** 停留时间 */
  freezeTime: number
  /** 图号 */
  picIndex = 0
  /** 偏移量 */
  offset: Vec2 = Vec2.ZERO
  /** 反转X轴 */
  flipX = false
  /** 反转Y轴 */
  flipY = false
  /** 固定朝向 */
  fixDir = false
}
