<template>
  <a-layout style="height: calc(100vh - 64px)">
    <a-layout-sider theme="light" style="height: 100%; overflow: auto">
      <a-list bordered :data-source="player.spriteFrames">
        <a-list-item slot="renderItem" slot-scope="item, index">
          {{ index }} - {{ item.name }}
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
@Component({
  name: 'SpriteFrameTable',
  components: {}
})
export default class SpriteFrameTable extends Vue {
  @Prop({
    required: true
  })
  player: _2DFMPlayer
}
</script>

<style lang="less" scoped>

</style>
