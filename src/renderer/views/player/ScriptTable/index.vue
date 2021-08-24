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

    <q-dialog
      v-model="showPreview"
      persistent
      seamless
    >
      <q-card style="max-width: none;">
        <q-bar>
          <q-space />
          <q-btn v-close-popup dense flat icon="close">
            <q-tooltip content-class="bg-white text-primary">
              关闭
            </q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section class="preview-content">
          <script-preview
            :script="selectingScript"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </a-layout>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
import { State } from 'vuex-class'
import _2DFMPlayer from '@/entity/2dfm-player'
import _2DFMScript from '@/entity/2dfm-script'
import ScriptContent from './ScriptContent.vue'
import ScriptPreview from '@/renderer/views/player/ScriptTable/ScriptPreview.vue'
@Component({
  name: 'ScriptTable',
  components: { ScriptPreview, ScriptContent }
})
export default class ScriptTable extends Vue {
  @State('player')
  player: _2DFMPlayer

  get showPreview(): boolean {
    return this.$store.state.showPreview
  }

  set showPreview(val: boolean) {
    this.$store.commit('setShowPreview', val)
  }

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
.preview-content {
  min-width: 640px;
  min-height: 480px;
  background-color: @layout-body-background;
}
</style>
