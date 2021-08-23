<template>
  <div
    ref="containerDiv"
    class="clip-overflow"
  >
    <canvas ref="theCanvas"></canvas>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'
import _2DFMScript from '@/entity/2dfm-script'
import _2DFMScriptItem from '@/entity/2dfm-script-item'
import ScriptItemTypes from '@/entity/script-item/script-item-types'
import AnimationFrame from '@/entity/script-item/animation-frame'
import { instance as animationFrameTranslatorInstance } from '@/entity/script-item/animation-frame-translator'
import { Vec2 } from '@/types/Geo'
import { getImageDataByIndex } from '@/util/2dfm-image-to-image-data'
import _2DFMPlayer from '@/entity/2dfm-player'
import { State } from 'vuex-class'

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

  centerPoint = Vec2.ZERO

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
      this.centerPoint = new Vec2(this.canvas.width / 2, this.canvas.height / 3 * 2)
      this.redraw()
    }, 500)
  }

  beforeDestroy(): void {
    window.removeEventListener('resize', this.onWindowResize)
  }

  onWindowResize(): void {
    this.resizeCanvas()
    this.redraw()
  }

  @Watch('selectingItemIndex')
  onSelectingItemIndexChanges(): void {
    this.redraw()
  }

  @Watch('script')
  onScriptChanges(): void {
    this.redraw()
  }

  resizeCanvas(): void {
    this.canvas.width = (this.$refs.containerDiv as HTMLDivElement).scrollWidth
    this.canvas.height = (this.$refs.containerDiv as HTMLDivElement).scrollHeight
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

    this.ctx.fillStyle = '#fff'
    this.ctx.fillRect(0, this.centerPoint.y, this.canvas.width, 4)
    this.ctx.fillRect(this.centerPoint.x, 0,4, this.canvas.height)

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
    getImageDataByIndex(this.player, item.picIndex).then(canvas => {
      if (canvas) {
        const drawPoint = this.centerPoint
          .copy()
          .add(-canvas.width / 2, -canvas.height)
          .add(item.offset.x, item.offset.y)
        this.ctx.drawImage(canvas, drawPoint.x, drawPoint.y)
      }
    })
  }
}
</script>

<style lang="less" scoped>
.clip-overflow {
  overflow: hidden;
}
</style>
