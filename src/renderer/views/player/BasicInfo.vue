<template>
  <a-layout-content>
    <a-descriptions title="User Info" layout="vertical">
      <a-descriptions-item label="UserName">
        Zhou Maomao
      </a-descriptions-item>
      <a-descriptions-item label="Telephone">
        1810000000
      </a-descriptions-item>
      <a-descriptions-item label="Live">
        Hangzhou, Zhejiang
      </a-descriptions-item>
      <a-descriptions-item label="Address" span="2">
        No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
      </a-descriptions-item>
      <a-descriptions-item label="Remark">
        empty
      </a-descriptions-item>
    </a-descriptions>
  </a-layout-content>
</template>

<script lang="ts">

import { Component, Prop, Vue } from 'vue-property-decorator'
import _2DFMPlayer from '@/entity/2dfm-player'
@Component({
  name: 'BasicInfo',
  components: {}
})
export default class BasicInfo extends Vue {
  @Prop({
    required: true
  })
  player: _2DFMPlayer
}
</script>

<style lang="less" scoped>

</style>
