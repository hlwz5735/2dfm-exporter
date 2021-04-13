<template>
  <a-layout-content class="flex fill-height text-center">
    <div class="mv-center" style="flex-grow: 1;">
      <palette-viewer
        :palette="palette"
        :cell-size="15"
      />
    </div>
    <a-tabs v-model="selectingPaletteIndex">
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
import _2DFMPalette from '@/entity/2dfm-palette'
import PaletteViewer from '@/renderer/components/PaletteViewer.vue'

@Component({
  name: 'PaletteInfo',
  components: { PaletteViewer }
})
export default class PaletteInfo extends Vue {
  @Prop({
    required: true
  })
  player: _2DFMPlayer
  selectingPaletteIndex = 0

  get palette(): _2DFMPalette {
    return this.player.publicPalettes[this.selectingPaletteIndex]
  }
}
</script>

<style lang="less" scoped>
.flex {
  display: flex;
  flex-direction: column;
}
.fill-height {
  height: calc(100vh - 64px);
}
.text-center {
  text-align: center;
}
.mv-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
