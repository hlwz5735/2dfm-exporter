<template>
  <canvas ref="theCanvas"></canvas>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component'
import _2DFMPalette, { PaletteColor } from '@/entity/2dfm-palette'
import { Prop, Watch } from 'vue-property-decorator'

@Component({})
export default class PaletteViewer extends Vue {
  @Prop({
    required: true
  })
  palette: _2DFMPalette
  @Prop({
    default: 10
  })
  cellSize = 10

  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D

  mounted(): void {
    this.canvas = this.$refs.theCanvas as HTMLCanvasElement
    this.canvas.width = 16 * this.cellSize
    this.canvas.height = 16 * this.cellSize
    this.ctx = this.canvas.getContext('2d')!

    this.onPaletteChanges(this.palette)
  }

  @Watch('palette')
  onPaletteChanges(palette: _2DFMPalette): void {
    if (!palette) {
      return
    }
    this.canvas.width = 16 * this.cellSize
    this.canvas.height = 16 * this.cellSize

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.save()
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        const i = y * 16 + x
        this.ctx.fillStyle = PaletteColor.prototype.rgbaValue.call(palette.colors[i])
        this.ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize)
      }
    }
    this.ctx.restore()
  }
}
</script>

<style lang="less" scoped>

</style>
