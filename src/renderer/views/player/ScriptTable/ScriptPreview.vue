<template>
  <div>
    <canvas
      ref="theCanvas"
      @mousedown="onMouseDown"
      @mousemove="onMouseMove"
      @mouseup="onMouseUp"
    ></canvas>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'
import { Vec2 } from '@/types/Geo'
import { State } from 'vuex-class'
import _2DFMPlayer from '@/entity/2dfm-player'
import _2DFMScript from '@/entity/2dfm-script'
import ScriptItemTypes from '@/entity/script-item/script-item-types'
import AnimationFrame from '@/entity/script-item/animation-frame'
import { flipX, flipXY, flipY } from '@/util/image-data-util'
import { instance as AnimationFrameTranslator } from '@/entity/script-item/animation-frame-translator'

@Component({
  name: 'ScriptPreview'
})
export default class ScriptPreview extends Vue {
  /** 脚本原始数据 */
  @Prop({
    type: Object,
    required: true,
  })
  script: _2DFMScript

  @State('player')
  player: _2DFMPlayer | undefined

  get canvas(): HTMLCanvasElement {
    return this.$refs.theCanvas as HTMLCanvasElement
  }

  get ctx(): CanvasRenderingContext2D {
    return this.canvas.getContext('2d')!
  }

  get fpsInterval(): number {
    return 1000 / this.fps
  }

  get noFrameItem(): boolean {
    return this.script.items.every(item => item.type !== ScriptItemTypes.AnimationFrame)
  }

  /** 摄像机视角点 */
  viewPoint = new Vec2(320, 320)

  rightDragging = false
  lastMousePos = Vec2.ZERO
  /** 帧率，默认60 */
  fps = 60
  /** 上次执行的时刻 */
  last = new Date().getTime()
  timer = 0
  /** 当前正在执行的脚本格索引 */
  runningScriptIdx = -1
  /** 当前脚本格的停顿时间 */
  timeWaiting = 0

  mounted(): void {
    this.canvas.width = 640
    this.canvas.height = 480

    this._drawStage()
    this._initAnimationFrameRequest()
  }

  beforeDestroy(): void {
    cancelAnimationFrame(this.timer)
  }

  onMouseDown(e: MouseEvent): void {
    if (e.button === 2) {
      this.lastMousePos = new Vec2(e.clientX, e.clientY)
      this.rightDragging = true
    }
  }

  onMouseMove(e: MouseEvent): void {
    if (this.rightDragging) {
      const mousePos = new Vec2(e.clientX, e.clientY)
      const offset = new Vec2(mousePos.x - this.lastMousePos.x, mousePos.y - this.lastMousePos.y)
      this.viewPoint = this.viewPoint.add(offset)
      this.lastMousePos = mousePos
    }
  }

  onMouseUp(e: MouseEvent): void {
    if (e.button === 2) {
      this.rightDragging = false
    }
  }

  @Watch('script')
  onScriptChanges(): void {
    this.timeWaiting = 0
    this.runningScriptIdx = -1
  }

  doAnimation(delta: number): void {
    if (this.noFrameItem) {
      return
    }
    if (this.timeWaiting === Infinity) {
      return
    }
    // 如果等待时间已到达，则执行下一个脚本
    if (this.timeWaiting <= 0) {
      this.runningScriptIdx += 1
      const item = this._getNextFrameItem()
      if (!item) {
        return
      }
      // 渲染新的动画帧
      this.timeWaiting = item.freezeTime === 0 ? Infinity : item.freezeTime * 10
      this._drawStage()
      this._drawPlayer(item)
    } else {
      this.timeWaiting -= delta
    }
  }

  _getNextFrameItem(): AnimationFrame | undefined {
    if (this.script.itemCount === 1) {
      const nowItem = this.script.items[0]
      if (nowItem.type !== ScriptItemTypes.AnimationFrame) {
        return undefined
      } else {
        return AnimationFrameTranslator.decode(this.script.items[0].parameters)
      }
    }
    if (this.runningScriptIdx >= this.script.itemCount) {
      this.runningScriptIdx = 0
    }
    const nowItem = this.script.items[this.runningScriptIdx]
    if (nowItem.type !== ScriptItemTypes.AnimationFrame) {
      this.runningScriptIdx += 1
      return this._getNextFrameItem()
    } else {
      return AnimationFrameTranslator.decode(this.script.items[this.runningScriptIdx].parameters)
    }
  }

  _initAnimationFrameRequest(): void {
    this.timer = requestAnimationFrame(this._animate)
  }

  _animate(): void {
    this.timer = requestAnimationFrame(this._animate)
    // 执行时的时间
    const now = new Date().getTime()
    const elapsed = now - this.last;
    // 经过了足够的时间
    if (elapsed > this.fpsInterval) {
      // 校正当前时间
      this.last = now - (elapsed % this.fpsInterval);
      // 循环的代码
      this.doAnimation(elapsed)
    }
  }

  /** 绘制主舞台 */
  _drawStage(): void {
    const stageBgColor = '#797979'
    const stageBorderColor = '#5e5e5e'
    const axisColor = '#fff'

    const { width, height } = this.canvas

    this.ctx.save()

    this.ctx.fillStyle = stageBgColor
    this.ctx.fillRect(0, 0, width, height)

    this.ctx.lineWidth = 1
    this.ctx.setLineDash([5])
    this.ctx.strokeStyle = stageBorderColor
    this.ctx.beginPath()

    const borderOffsetX = this.viewPoint.x % 32
    const borderOffsetY = this.viewPoint.y % 32

    for (let i = borderOffsetX; i < width; i += 32) {
      this.ctx.moveTo(i, 0)
      this.ctx.lineTo(i, height)
    }
    for (let j = borderOffsetY; j < height; j += 32) {
      this.ctx.moveTo(0, j)
      this.ctx.lineTo(width, j)
    }
    this.ctx.stroke()
    this.ctx.closePath()

    this.ctx.strokeStyle = axisColor
    this.ctx.beginPath()
    this.ctx.moveTo(0, this.viewPoint.y)
    this.ctx.lineTo(width, this.viewPoint.y)
    this.ctx.moveTo(this.viewPoint.x, 0)
    this.ctx.lineTo(this.viewPoint.x, height)

    this.ctx.stroke()
    this.ctx.closePath()

    this.ctx.restore()
  }

  _drawPlayer(item: AnimationFrame): void {
    if (!this.player) {
      return
    }
    this.$store.dispatch('getImage', item.picIndex).then(imageData => {
      if (!imageData) {
        return
      }
      if (item.flipX && item.flipY) {
        imageData = flipXY(imageData)
      } else if (item.flipX) {
        imageData = flipX(imageData)
      } else if (item.flipY) {
        imageData = flipY(imageData)
      }
      const canvas = document.createElement('canvas') as HTMLCanvasElement
      canvas.width = imageData.width
      canvas.height = imageData.height
      const ctx = canvas.getContext('2d')!
      ctx.putImageData(imageData, 0, 0)

      const drawPoint = this.viewPoint
        .copy()
        .add(Math.round(-canvas.width / 2), -canvas.height)
        .add(item.offset.x, item.offset.y)
      this.ctx.drawImage(canvas, drawPoint.x, drawPoint.y)
    })
  }
}
</script>

<style lang="less" scoped>

</style>
