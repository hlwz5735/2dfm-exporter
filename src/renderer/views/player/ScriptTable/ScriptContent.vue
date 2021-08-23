<template>
  <div class="script-content">
    <a-layout style="height: calc(100vh - 64px)">
      <a-layout-sider
        theme="light"
        width="260"
        style="height: 100%; overflow-y: auto;"
      >
        <div class="script-item-panel">
          <q-bar
            class="bg-primary text-white"
          >
            {{ script.name }}
          </q-bar>
          <a-form-model>
            <a-space class="column-2">
              <a-form-item label="脚本索引">
                <a-input
                  :value="scriptIndex"
                  type="number"
                  @change="onScriptIndexChanged"
                />
              </a-form-item>
              <a-form-item label="脚本项索引">
                <a-input
                  v-model.number="selectingItemIndex"
                  type="number"
                />
              </a-form-item>
            </a-space>
            <component
              :is="itemPanelComponent"
              :item="selectingItem"
            />
          </a-form-model>
        </div>
      </a-layout-sider>
      <a-layout-content style="display: flex; flex-direction: column;">
        <div class="script-item-container">
          <script-item-block
            v-for="(item, index) in script.items"
            :key="index"
            :item="item"
            :selected="selectingItemIndex === index"
            @click="onItemClicked(index)"
          />
        </div>
        <Workspace
          style="flex-grow: 1"
          :script="script"
          :selecting-item="selectingItem"
          :selecting-item-index="selectingItemIndex"
        />
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import _2DFMScript from '@/entity/2dfm-script'
import _2DFMScriptItem from '@/entity/2dfm-script-item'
import ScriptItemTypes from '@/entity/script-item/script-item-types'
import ScriptItemBlock from '@/renderer/components/script/ScriptItemBlock.vue'
import UnknownItem from './ScriptItemPanel/UnknownItem.vue'
import ScriptHeadItem from './ScriptItemPanel/ScriptHeadItem.vue'
import AnimationFrameItem from './ScriptItemPanel/AnimationFrameItem.vue'
import Workspace from '@/renderer/views/player/ScriptTable/Workspace.vue'

@Component({
  name: 'ScriptContent',
  components: { Workspace, ScriptItemBlock },
})
export default class ScriptContent extends Vue {
  /** 脚本原始数据 */
  @Prop({
    type: Object,
    required: true,
  })
  script: _2DFMScript

  /** 脚本的索引 */
  @Prop({
    type: Number,
    default: 0
  })
  scriptIndex: number

  /** 当前选择的脚本项索引 */
  selectingItemIndex = 0

  get selectingItem(): _2DFMScriptItem {
    if (this.selectingItemIndex < 0 || this.selectingItemIndex >= this.script?.items?.length) {
      return new _2DFMScriptItem()
    }
    return this.script.items[this.selectingItemIndex]
  }

  get itemPanelComponent(): unknown {
    switch (this.selectingItem?.type) {
      case ScriptItemTypes.ScriptHead:
        return ScriptHeadItem
      case ScriptItemTypes.AnimationFrame:
        return AnimationFrameItem
      default:
        return UnknownItem
    }
  }

  @Watch('script')
  onScriptChange(): void {
    this.selectingItemIndex = 0
  }

  onItemClicked(idx: number): void {
    this.selectingItemIndex = idx
  }

  onScriptIndexChanged(event: InputEvent): void {
    this.$emit('jump-to', Number.parseInt((event.target as HTMLInputElement).value))
  }
}
</script>

<style
  lang="less"
  scoped
>
.script-item-container {
  overflow-x: auto;
  white-space: nowrap;
  word-wrap: normal;
  word-break: keep-all;
}

.script-item-panel {
  padding: 1em;

  .ant-form-item {
    margin-bottom: 0.5em;
  }
}
</style>
<style lang="less">
.script-content {
  .ant-form-item {
    .ant-form-item-label {
      line-height: 1.2em;
    }
  }
}
</style>