<template>
  <a-layout-content>
    <canvas ref="theCanvas"></canvas>
    <a-tabs @change="onPaletteChange">
      <a-tab-pane
        v-for="(item, index) in player.publicPalettes"
        :key="index"
        :tab="index"
      />
    </a-tabs>
  </a-layout-content>
</template>

<script lang="ts">

import { Component, Prop, Vue } from 'vue-property-decorator'
import _2DFMPlayer from '@/entity/2dfm-player'
import { PaletteColor } from '@/entity/2dfm-palette'

@Component({
  name: 'PaletteInfo',
  components: {}
})
export default class PaletteInfo extends Vue {
  @Prop({
    required: true
  })
  player: _2DFMPlayer

  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D

  mounted(): void {
    this.canvas = this.$refs.theCanvas as HTMLCanvasElement
    this.canvas.width = 160
    this.canvas.height = 160
    this.ctx = this.canvas.getContext('2d')!

    this.onPaletteChange(0)
  }

  onPaletteChange(newKey: number): void {
    const palette = this.player.publicPalettes[newKey]
    if (!palette) {
      return
    }

    this.ctx.clearRect(0, 0, 160, 160)
    this.ctx.save()
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        const i = y * 16 + x
        this.ctx.fillStyle = PaletteColor.prototype.rgbaValue.call(palette.colors[i])
        this.ctx.fillRect(x * 10, y * 10, 10, 10)
      }
    }
    this.ctx.restore()
  }
}
</script>

<style lang="less" scoped>

</style>
