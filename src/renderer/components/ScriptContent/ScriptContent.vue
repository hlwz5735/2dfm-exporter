<template>
  <div class="script-content">
    <a-layout style="height: calc(100vh - 64px)">
      <a-layout-sider
        theme="light"
        width="260"
        style="height: 100%; overflow-y: auto;"
      >
        <div class="script-item-panel">
          <h5>{{ script.name }}</h5>
          <a-form-model>
            <a-form-item label="脚本项索引">
              <a-input :value="selectingItemIndex" />
            </a-form-item>
            <a-form-item label="类型">
              <a-input :value="selectingItem.type" />
            </a-form-item>
            <a-form-item label="参数列表">
              <a-textarea :value="selectingItemParams" />
            </a-form-item>
          </a-form-model>
        </div>
      </a-layout-sider>
      <a-layout-content>
        <div class="script-item-container">
          <script-item-block
            v-for="(item, index) in script.items"
            :key="index"
            :item="item"
            :selected="selectingItemIndex === index"
            @click="onItemClicked(index)"
          />
        </div>
        content
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import _2DFMScript from '@/entity/2dfm-script'
import _2DFMScriptItem from '@/entity/2dfm-script-item'
import ScriptItemBlock from './ScriptItemBlock.vue'

@Component({
  name: 'ScriptContent',
  components: { ScriptItemBlock },
})
export default class ScriptContent extends Vue {
  @Prop({
    type: Object,
    required: true,
  })
  script: _2DFMScript

  selectingItemIndex = 0

  spriteFrames: ImageBitmap[]

  get selectingItem(): _2DFMScriptItem {
    if (this.selectingItemIndex < 0 || this.selectingItemIndex >= this.script?.items?.length) {
      return new _2DFMScriptItem()
    }
    return this.script.items[this.selectingItemIndex]
  }

  get selectingItemParams(): string {
    let content = ''
    let count = 0
    this.selectingItem.parameters?.forEach(byte => {
      let byteStr = byte.toString(16)
      if (byteStr.length === 1) {
        byteStr = '0' + byteStr
      }
      content = content + byteStr + ' '
      if (++count === 32) {
        content += '\n'
        count = 0
      }
    })
    return content.toUpperCase()
  }

  @Watch('script')
  onScriptChange(): void {
    this.selectingItemIndex = 0
  }

  onItemClicked(idx: number): void {
    this.selectingItemIndex = idx
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
