<template>
  <a-layout v-if="player">
    <a-layout-header style="display: flex;">
      <div class="player-name">
        <a-dropdown>
          <a>
            {{ player.name }} <a-icon type="down" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item @click="$router.back()">
              返回
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
      <a-menu
        v-model="menuSelected"
        theme="dark"
        mode="horizontal"
        style="line-height: 64px;"
      >
        <a-menu-item key="BasicInfo">
          基本信息
        </a-menu-item>
        <a-menu-item key="ScriptTable">
          脚本表
        </a-menu-item>
        <a-menu-item disabled>
          受击动作表
        </a-menu-item>
        <a-menu-item key="PaletteInfo">
          公共调色盘
        </a-menu-item><a-menu-item key="SpriteFrameTable">
          精灵表
        </a-menu-item>
        <a-menu-item key="SoundTable">
          音效表
        </a-menu-item>
        <a-menu-item disabled>
          指令
        </a-menu-item>
        <a-menu-item disabled>
          AI
        </a-menu-item>
        <a-menu-item disabled>
          剧情
        </a-menu-item>
      </a-menu>
    </a-layout-header>
    <component :is="layoutComponent" :player="player" />
  </a-layout>
  <a-skeleton
    v-else
    active
    :paragraph="{ rows: 10 }"
  />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Mutation, State } from 'vuex-class'
import _2DFMPlayer from '@/entity/2dfm-player'
import ScriptTable from './player/ScriptTable/index.vue'
import BasicInfo from './player/BasicInfo.vue'
import PaletteInfo from './player/PaletteInfo.vue'
import SpriteFrameTable from './player/SpriteFrameTable.vue'
import SoundTable from './player/SoundTable.vue'
const { ipcRenderer }  = window

@Component({
  components: { ScriptTable, BasicInfo, SpriteFrameTable, SoundTable, PaletteInfo }
})
export default class Home extends Vue {
  @State('playerFilePath')
  filePath: string

  @State('player')
  player: _2DFMPlayer | undefined

  @Mutation('setPlayer') setPlayer: (player: _2DFMPlayer) => void

  menuSelected: string[] = ['ScriptTable']

  get layoutComponent(): string {
    if (this.menuSelected && this.menuSelected.length > 0) {
      return this.menuSelected[0]
    }
    return 'ScriptTable'
  }

  created(): void {
    if (!this.filePath) {
      this.$router.replace('/open-file')
      return
    }

    ipcRenderer.once('read-2dfm-player-file-complete', (_, player) => {
      this.setPlayer(player)
    })
    ipcRenderer.once('read-2dfm-player-file-failed', () => {
      this.$error({
        title: '错误',
        content: '文件打开失败！'
      })
      this.$router.replace('/open-file')
    })
    ipcRenderer.send('read-2dfm-player-file', decodeURIComponent(this.filePath))
  }
}
</script>

<style lang="less" scoped>
.player-name {
  color: white;
  display: inline-block;
  margin-right: 58px;
}
</style>
