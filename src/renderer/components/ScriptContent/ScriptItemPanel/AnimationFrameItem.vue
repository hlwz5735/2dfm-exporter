<template>
  <div class="inline-form">
    <q-bar>图像调用</q-bar>
    <a-space style="display: flex">
      <a-form-item label="停留">
        <a-input
          type="number"
          :value="entity.freezeTime"
        />
      </a-form-item>
      <a-form-item label="图号">
        <a-input
          type="number"
          :value="entity.picIndex"
        />
      </a-form-item>
    </a-space>
    <a-space style="display: flex">
      <a-form-item label="中心轴X">
        <a-input
          type="number"
          :value="entity.offset.x"
        />
      </a-form-item>
      <a-form-item label="中心轴Y">
        <a-input
          type="number"
          :value="entity.offset.y"
        />
      </a-form-item>
    </a-space>
    <a-space style="display: flex">
      <a-form-item label="水平翻转">
        <a-switch
          :checked="entity.flipX"
        />
      </a-form-item>
      <a-form-item label="垂直翻转">
        <a-switch
          :checked="entity.flipY"
        />
      </a-form-item>
    </a-space>
    <a-form-item label="固定朝向">
      <a-switch
        :checked="entity.fixDir"
      />
    </a-form-item>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import _2DFMScriptItem from '@/entity/2dfm-script-item'
import AnimationFrame from '@/entity/script-item/animation-frame'
import { instance as translatorInstance } from '@/entity/script-item/animation-frame-translator'

@Component( {
  name: 'AnimationFrameItem',
})
export default class AnimationFrameItem extends Vue {
  @Prop({
    type: Object,
    required: true
  })
  item: _2DFMScriptItem

  get entity(): AnimationFrame {
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

<style lang="less" scoped>

</style>
