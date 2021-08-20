<template>
  <div class="inline-form">
    <q-bar>图像调用</q-bar>
    <a-space>
      <a-form-item label="停留">
        <a-input
          type="number"
        />
      </a-form-item>
      <a-form-item label="图号">
        <a-input
          type="number"
        />
      </a-form-item>
    </a-space>
    <a-space>
      <a-form-item label="中心轴X">
        <a-input
          type="number"
        />
      </a-form-item>
      <a-form-item label="中心轴Y">
        <a-input
          type="number"
        />
      </a-form-item>
    </a-space>
    <a-space>
      <a-form-item label="水平翻转">
        <a-switch
        />
      </a-form-item>
      <a-form-item label="垂直翻转">
        <a-switch
        />
      </a-form-item>
    </a-space>
    <a-form-item label="忽略角色的面向">
      <a-switch
      />
    </a-form-item>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import _2DFMScriptItem from '../../../../entity/2dfm-script-item'

@Component( {
  name: 'AnimationFrameItem',
})
export default class AnimationFrameItem extends Vue {
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
