<template>
  <span
    class="script-item-block"
    :class="classObj"
    @click="onClick"
  >
    {{ itemName }}
  </span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import _2DFMScriptItem from '@/entity/2dfm-script-item'

@Component({
  name: 'ScriptItemBlock',
  components: {}
})
export default class ScriptTable extends Vue {
  @Prop({
    type: Object,
    required: true
  })
  item: _2DFMScriptItem

  @Prop({
    type: Boolean,
    default: false
  })
  selected: boolean

  get classObj(): {[key: string]: boolean} {
    return {
      selected: this.selected
    }
  }

  get itemName(): string {
    switch (this.item?.type) {
      case 0:
        return '头'
      default:
        return '疑'
    }
  }

  onClick(): void {
    this.$emit('click')
  }
}
</script>

<style lang="less" scoped>
.script-item-block {
  display: inline-block;
  width: 24px;
  height: 24px;
  border: 2px solid black;
  border-left: none;
  text-align: center;
  font-weight: bold;
  cursor: pointer;

  &:first-child {
    border-left: 2px solid black;
  }
  &.selected {
    background-color: darkblue;
    color: white;
  }
}
</style>
