<template>
  <div class="inline-form">
    <q-bar>初期设置</q-bar>
    <a-form-item label="招式级数">
      <a-input
        type="number"
        :value="entity.level"
      />
    </a-form-item>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import _2DFMScriptItem from '@/entity/2dfm-script-item'
import ScriptHead from '@/entity/script-item/script-head'
import { instance as translatorInstance } from '@/entity/script-item/script-head-translator'

@Component({
  name: 'ScriptHeadItem'
})
export default class ScriptHeadItem extends Vue {
  @Prop({
    type: Object,
    required: true
  })
  item: _2DFMScriptItem

  get entity(): ScriptHead {
    return translatorInstance.decode(this.item.parameters)
  }

  get itemRawParams(): string {
    let content = ''
    let count = 0
    this.item.parameters?.forEach(byte => {
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
}
</script>

<style
  lang="less"
  scoped
>

</style>
