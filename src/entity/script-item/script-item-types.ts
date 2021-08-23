enum ScriptItemTypes {
  /** 脚本头 */
  ScriptHead,
  /** 移动 */
  Movement,
  /** 播放声音 */
  Sound = 3,
  /** 物体 */
  Item,
  /** 动画帧显示 */
  AnimationFrame = 12,
  /** 调色盘/屏幕摇晃效果 */
  Effect = 14,
  /** 防御范围 */
  DefenceRange = 25,
  /** 取消条件 */
  CancelCondition = 30,
  /** 改变颜色 */
  ColorChanging = 35,
  /** 残影效果 */
  StickingEffect = 37
}

export default ScriptItemTypes
