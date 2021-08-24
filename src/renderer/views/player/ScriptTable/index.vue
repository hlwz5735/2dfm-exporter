<template>
  <a-layout style="height: calc(100vh - 64px)">
    <a-layout-sider theme="light" style="height: 100%; overflow: auto">
      <q-list bordered separator>
        <q-item
          v-for="(item, index) in player.scripts"
          :key="index"
          v-ripple
          :active="selectingIndex === index"
          dense
          clickable
          @click="onScriptSelected(index)"
        >
          {{ index }} - {{ item.name }}
        </q-item>
      </q-list>
    </a-layout-sider>
    <a-layout-content>
      <script-content
        v-if="selectingScript"
        :script-index="selectingIndex"
        :script="selectingScript"
        @jump-to="selectingIndex = $event"
      />
    </a-layout-content>
  </a-layout>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
import _2DFMPlayer from '@/entity/2dfm-player'
import _2DFMScript from '@/entity/2dfm-script'
import ScriptContent from './ScriptContent.vue'
import { State } from 'vuex-class'
@Component({
  name: 'ScriptTable',
  components: { ScriptContent }
})
export default class ScriptTable extends Vue {
  @State('player')
  player: _2DFMPlayer

  selectingIndex = 0

  get selectingScript(): _2DFMScript | null {
    if (this.selectingIndex >= 0 && this.selectingIndex < this.player?.scripts?.length) {
      return this.player.scripts[this.selectingIndex]
    } else {
      return null
    }
  }

  onScriptSelected(index: number): void {
    this.selectingIndex = index
  }
}
</script>

<style lang="less" scoped>

</style>
