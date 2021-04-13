<template>
  <a-layout style="height: calc(100vh - 64px)">
    <a-layout-sider theme="light" style="height: 100%; overflow: auto">
      <q-list bordered separator>
        <q-item
          v-for="(item, index) in player.scripts"
          :key="index"
          v-ripple
          dense
          clickable
        >
          {{ index }} - {{ item.name }}
        </q-item>
      </q-list>
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
  name: 'ScriptTable',
  components: {}
})
export default class ScriptTable extends Vue {
  @Prop({
    required: true
  })
  player: _2DFMPlayer
}
</script>

<style lang="less" scoped>

</style>
