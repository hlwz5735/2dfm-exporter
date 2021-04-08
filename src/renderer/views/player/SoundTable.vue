<template>
  <a-layout style="height: calc(100vh - 64px)">
    <a-layout-sider theme="light" style="height: 100%; overflow: auto">
      <q-list bordered separator>
        <q-item
          v-for="(item, index) in player.sounds"
          :key="index"
          :active="selectingSoundIndex === index"
          dense
          clickable
          v-ripple
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
    </a-layout-content>
  </a-layout>
</template>

<script lang="ts">

import { Component, Prop, Vue } from 'vue-property-decorator'
import _2DFMPlayer from '@/entity/2dfm-player'
import _2DFMSound from '@/entity/2dfm-sound'
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

  fh: fs.FileHandle

  get sound(): _2DFMSound {
    return this.player.sounds[this.selectingSoundIndex]
  }

  created(): void {
    this.fh = fs.open(this.$store.state.playerFilePath)
  }

  beforeDestroy(): void {
    this.fh.close()
  }

  onSoundSelect(index: number): void {
    this.selectingSoundIndex = index
  }

  // play() {
  //   if (!val) {
  //     return
  //   }
  //   const blob = new Blob([val], { type: this.mimeType })
  //   const audio = document.createElement('audio')
  //   audio.src = window.URL.createObjectURL(blob)
  //   audio.controls = true
  //   audio.autoplay = true
  //   const container = this.$refs.theContainer as HTMLDivElement
  //   if (container.hasChildNodes()) {
  //     container.removeChild(container.childNodes[0])
  //   }
  //   container.appendChild(audio)
  // }
}
</script>

<style lang="less" scoped>

</style>
