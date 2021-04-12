<template>
  <a-layout style="height: calc(100vh - 64px)">
    <a-layout-sider theme="light" style="height: 100%; overflow: auto">
      <q-list bordered separator>
        <q-item
          v-for="(item, index) in notEmptySprites"
          :key="item.index"
          v-ripple
          :active="selectingIndex === index"
          dense
          clickable
          @click="onSpriteSelect(item.index)"
        >
          {{ item.index }} - {{ item.width }} * {{ item.height }}
        </q-item>
      </q-list>
    </a-layout-sider>
    <a-layout-content>
      <canvas ref="theCanvas"></canvas>
    </a-layout-content>
  </a-layout>
</template>

<script lang="ts">

import { FileHandle } from 'fs/promises'
import { Component, Prop, Vue } from 'vue-property-decorator'
import _2DFMPlayer from '@/entity/2dfm-player'
import _2DFMSpriteFrame from '@/entity/2dfm-sprite-frame'
import _2DFMPalette from '@/entity/2dfm-palette'
import { decompress } from '@/util/2dfm-image-decompress'
import { readPalette } from '@/util/2dfm-palette-reader'
const { fs } = window
@Component({
  name: 'SpriteFrameTable',
  components: {}
})
export default class SpriteFrameTable extends Vue {
  @Prop({
    required: true
  })
  player: _2DFMPlayer
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D

  selectingIndex = 0

  fh: FileHandle

  async created(): Promise<void> {
    this.fh = await fs.open(this.$store.state.playerFilePath)
  }

  beforeDestroy(): void {
    this.fh.close()
  }

  mounted(): void {
    this.canvas = this.$refs.theCanvas as HTMLCanvasElement
    this.canvas.width = 160
    this.canvas.height = 160
    this.ctx = this.canvas.getContext('2d')!
  }

  get notEmptySprites(): Array<_2DFMSpriteFrame> {
    return this.player.spriteFrames.filter(val => val.width * val.height !== 0)
  }

  onSpriteSelect(index: number): void {
    this.selectingIndex = index
    this.drawSpriteFrame()
  }

  async drawSpriteFrame(): Promise<void> {
    const sprite = this.player.spriteFrames[this.selectingIndex]
    if (!sprite || sprite.width * sprite.height === 0) {
      return
    }
    let size = sprite.size
    if (sprite.size === 0) {
      size = sprite.width * sprite.height + (sprite.hasPrivatePalette ? 1024 : 0)
    }
    const result = await this.fh.read(new Uint8Array(size), 0, size, sprite.offset + 20)
    let buffer = result.buffer
    if (_2DFMSpriteFrame.prototype.compressed.call(sprite)) {
      buffer = decompress(buffer, _2DFMSpriteFrame.prototype.realSize.call(sprite))!
    }

    const { width, height } = sprite
    this.canvas.width = sprite.width
    this.canvas.height = sprite.height

    let palette: _2DFMPalette

    let imageBuffer
    if (sprite.hasPrivatePalette) {
      palette = readPalette(buffer, true)
      imageBuffer = buffer.slice(1024)
    } else {
      palette = this.player.publicPalettes[0]
      imageBuffer = buffer
    }

    const imageDataBuffer = new Uint8ClampedArray(width * height * 4)

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const pixelIndex = y * width + x
        const colorIndex = imageBuffer[pixelIndex]
        const color = palette.colors[colorIndex]
        imageDataBuffer[pixelIndex * 4] = color.rawData[0]
        imageDataBuffer[pixelIndex * 4 + 1] = color.rawData[1]
        imageDataBuffer[pixelIndex * 4 + 2] = color.rawData[2]
        imageDataBuffer[pixelIndex * 4 + 3] = color.rawData[3]
      }
    }

    const imageData = new ImageData(imageDataBuffer, width, height)
    this.ctx.putImageData(imageData, 0, 0)
  }
}
</script>

<style lang="less" scoped>

</style>
