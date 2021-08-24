<template>
  <div>
    <canvas ref="theCanvas"></canvas>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { Vec2 } from '@/types/Geo'

@Component({
  name: 'ScriptPreview'
})
export default class ScriptPreview extends Vue {
  get canvas(): HTMLCanvasElement {
    return this.$refs.theCanvas as HTMLCanvasElement
  }

  get ctx(): CanvasRenderingContext2D {
    return this.canvas.getContext('2d')!
  }

  /** 摄像机视角点 */
  viewPoint = Vec2.ZERO

  mounted(): void {
    this.canvas.width = 640
    this.canvas.height = 480
  }
}
</script>

<style lang="less" scoped>

</style>
