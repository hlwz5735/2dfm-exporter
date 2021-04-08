<template>
  <div v-if="player" class="home">
    脚本总数：{{ player.scriptCount }}
  </div>
  <a-spin v-else />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import _2DFMPlayer from '@/entity/2dfm-player'
import { State } from 'vuex-class'
const { ipcRenderer }  = window

@Component({
  components: {}
})
export default class Home extends Vue {
  created(): void {
    if (!this.filePath) {
      this.$router.push('/open-file')
      return
    }

    ipcRenderer.once('read-2dfm-player-file-complete', (_, player) => {
      this.player = player
    })
    ipcRenderer.send('read-2dfm-player-file', decodeURIComponent(this.filePath))
  }

  @State('playerFilePath')
  filePath: string

  player: _2DFMPlayer | null = null
}
</script>
