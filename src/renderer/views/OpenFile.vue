<template>
  <a-spin :spinning="spinning">
    <div class="fill-window">
      <a-card title="请选择2dfm player文件路径" style="width: 60%">
        <div>
          <a-input-search
              v-model="filePath"
              placeholder="文件路径"
              enter-button="选择"
              @search="openFileDialog"
          />
        </div>
        <a-divider />
        <a-button
            :disabled="!filePath"
            type="primary"
            block
            @click="readPlayerFile"
        >
          读取
        </a-button>
      </a-card>
    </div>
  </a-spin>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
const { remote } = window

@Component
export default class OpenFile extends Vue {
  filePath = ''
  spinning = false

  async openFileDialog(): Promise<void> {
    const result = await remote.dialog.showOpenDialog({
      title: '打开2DFM player文件',
      filters: [
        { name: '2DFM player文件', extensions: ['player'] },
        { name: 'All Files', extensions: ['*'] }
      ],
      properties: ['openFile']
    })
    if (result.canceled) {
      return
    }
    this.filePath = result.filePaths[0]
  }

  async readPlayerFile(): Promise<void> {
    // ...
  }
}
</script>

<style lang="less" scoped>
.fill-window {
  width: 100vw;
  height: 100vh;
  display: flex;
  background-color: @layout-body-background;

  align-items: center;
  justify-content: center;
}
</style>
