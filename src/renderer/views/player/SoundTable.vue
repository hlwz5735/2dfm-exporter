<template>
  <a-layout style="height: calc(100vh - 64px)">
    <a-layout-sider theme="light" style="height: 100%; overflow: auto">
      <q-list bordered separator>
        <q-item
          v-for="(item, index) in player.sounds"
          :key="index"
          v-ripple
          :active="selectingSoundIndex === index"
          dense
          clickable
          @click="onSoundSelect(index)"
        >
          <q-item-section>
            {{ index }} - {{ item.name }}
          </q-item-section>
        </q-item>
      </q-list>
    </a-layout-sider>
    <a-layout-content>
      {{ sound.name }}
      <div ref="theContainer"></div>
    </a-layout-content>
  </a-layout>
</template>

<script lang="ts">

import { Component, Prop, Vue } from 'vue-property-decorator'
import _2DFMPlayer from '@/entity/2dfm-player'
import _2DFMSound from '@/entity/2dfm-sound'
import { FileHandle } from 'fs/promises'
const { fs } = window
@Component({
  name: 'SoundTable',
  components: {}
})
export default class SoundTable extends Vue {
  @Prop({
    required: true
  })
  player: _2DFMPlayer

  /** 当前选中的声音索引 */
  selectingSoundIndex = 0

  fh: FileHandle

  get sound(): _2DFMSound {
    return this.player.sounds[this.selectingSoundIndex]
  }

  async created(): Promise<void> {
    this.fh = await fs.open(this.$store.state.playerFilePath)
  }

  beforeDestroy(): void {
    this.fh.close()
  }

  onSoundSelect(index: number): void {
    this.selectingSoundIndex = index
    this.play()
  }

  async play(): Promise<void> {
    if (this.sound.size <= 0) {
      return
    }
    const result = await this.fh.read(new Uint8Array(this.sound.size), 0, this.sound.size, this.sound.offset + 42)
    const blob = new Blob([result.buffer.buffer], { type: 'audio/x-wav' })
    const audio = document.createElement('audio')
    audio.src = window.URL.createObjectURL(blob)
    audio.controls = true
    audio.autoplay = true
    const container = this.$refs.theContainer as HTMLDivElement
    if (container.hasChildNodes()) {
      container.removeChild(container.childNodes[0])
    }
    container.appendChild(audio)
  }
}
</script>

<style lang="less" scoped>

</style>
