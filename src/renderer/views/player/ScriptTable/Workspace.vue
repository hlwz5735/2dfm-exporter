<template>
  <div
    ref="containerDiv"
    class="clip-overflow"
  >
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
import { State } from 'vuex-class'
import { Vec2 } from '@/types/Geo'
import _2DFMScript from '@/entity/2dfm-script'
import _2DFMScriptItem from '@/entity/2dfm-script-item'
import _2DFMPlayer from '@/entity/2dfm-player'
import ScriptItemTypes from '@/entity/script-item/script-item-types'
import AnimationFrame from '@/entity/script-item/animation-frame'
import { instance as animationFrameTranslatorInstance } from '@/entity/script-item/animation-frame-translator'
import { flipX, flipXY, flipY } from '@/util/image-data-util'

@Component({
  name: 'Workspace'
})
export default class Workspace extends Vue {
  /** 脚本原始数据 */
  @Prop({
    type: Object,
    required: true,
  })
  script: _2DFMScript

  @Prop({
    type: Number,
    required: true,
  })
  selectingItemIndex: number

  @Prop({
    type: Object,
    required: true,
  })
  selectingItem: _2DFMScriptItem

  @State('player')
  player: _2DFMPlayer | undefined

  viewPoint = Vec2.ZERO

  rightDragging = false
  lastMousePos = Vec2.ZERO

  get canvas(): HTMLCanvasElement {
    return this.$refs.theCanvas as HTMLCanvasElement
  }

  get ctx(): CanvasRenderingContext2D {
    return this.canvas.getContext('2d')!
  }

  /** 当前位置的下一个动画帧脚本指令对象 */
  get nextAnimationFrameItem(): AnimationFrame | undefined {
    for (let i = this.selectingItemIndex; i < this.script.itemCount; i++) {
      const item = this.script.items[i]
      if (item.type === ScriptItemTypes.AnimationFrame) {
        return animationFrameTranslatorInstance.decode(item.parameters)
      }
    }
    return undefined
  }

  mounted(): void {
    window.addEventListener('resize', this.onWindowResize)
    setTimeout(() => {
      this.resizeCanvas()
      this.centerView()
      this.redraw()
    }, 500)
  }

  beforeDestroy(): void {
    window.removeEventListener('resize', this.onWindowResize)
  }

  @Watch('selectingItemIndex')
  onSelectingItemIndexChanges(): void {
    this.redraw()
  }

  @Watch('script')
  onScriptChanges(): void {
    this.redraw()
  }

  onWindowResize(): void {
    this.resizeCanvas()
    this.redraw()
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
      this.redraw()
    }
  }

  onMouseUp(e: MouseEvent): void {
    if (e.button === 2) {
      this.rightDragging = false
    }
  }

  resizeCanvas(): void {
    this.canvas.width = (this.$refs.containerDiv as HTMLDivElement).scrollWidth
    this.canvas.height = (this.$refs.containerDiv as HTMLDivElement).scrollHeight
  }

  centerView(): void {
    this.viewPoint = new Vec2(Math.round(this.canvas.width / 2), Math.round(this.canvas.height / 3 * 2))
  }

  redraw(): void {
    if (this.nextAnimationFrameItem) {
      this._drawAxis()
      this._drawPlayer()
    } else {
      this._drawDisabled()
    }
  }

  _drawAxis(): void {
    this.ctx.save()

    this.ctx.fillStyle = '#6b6b6b'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    this.ctx.strokeStyle = '#fff'
    this.ctx.lineWidth = 4
    this.ctx.beginPath()
    this.ctx.moveTo(0, this.viewPoint.y)
    this.ctx.lineTo(this.canvas.width, this.viewPoint.y)
    this.ctx.moveTo(this.viewPoint.x, 0)
    this.ctx.lineTo(this.viewPoint.x, this.canvas.height)
    this.ctx.stroke()
    this.ctx.closePath()

    this.ctx.restore()
  }

  _drawDisabled(): void {
    this.ctx.save()

    this.ctx.fillStyle = '#a6a6a6'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    this.ctx.restore()
  }

  _drawPlayer(): void {
    if (!this.player) {
      return
    }
    const item = this.nextAnimationFrameItem!
    this.$store.dispatch('getImage', item.picIndex).then(imageData => {
      if (!imageData) {
        this._drawDisabled()
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
.clip-overflow {
  overflow: hidden;
}
</style>
