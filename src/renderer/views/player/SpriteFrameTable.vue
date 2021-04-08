<template>
  <a-layout style="height: calc(100vh - 64px)">
    <a-layout-sider theme="light" style="height: 100%; overflow: auto">
      <a-list bordered :data-source="notEmptySprites">
        <a-list-item slot="renderItem" slot-scope="item, index">
          {{ index }} - {{ item.width }} * {{ item.height }}
        </a-list-item>
      </a-list>
    </a-layout-sider>
    <a-layout-content>
      content
    </a-layout-content>
  </a-layout>
</template>

<script lang="ts">

import { Component, Prop, Vue } from 'vue-property-decorator'
import _2DFMPlayer from '@/entity/2dfm-player'
import _2DFMSpriteFrame from '@/entity/2dfm-sprite-frame'
@Component({
  name: 'SpriteFrameTable',
  components: {}
})
export default class SpriteFrameTable extends Vue {
  @Prop({
    required: true
  })
  player: _2DFMPlayer

  get notEmptySprites(): Array<_2DFMSpriteFrame> {
    return this.player.spriteFrames.filter(val => val.width * val.height !== 0)
  }
}
</script>

<style lang="less" scoped>

</style>
