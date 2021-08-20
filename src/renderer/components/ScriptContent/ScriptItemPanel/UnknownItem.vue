<template>
  <div>
    <q-bar>未知脚本</q-bar>
    <a-form-item label="参数列表">
      <a-textarea :value="itemRawParams" />
    </a-form-item>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import _2DFMScriptItem from '../../../../entity/2dfm-script-item'

@Component( {
  name: 'UnknownItem',
})
export default class UnknownItem extends Vue {
  @Prop({
    type: Object,
    required: true
  })
  item: _2DFMScriptItem

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
