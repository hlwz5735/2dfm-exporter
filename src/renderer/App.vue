<template>
  <a-config-provider :locale="zhCN">
    <div id="app">
      <div>
        <p>
          If Ant-Design-Vue is successfully added to this project, you'll see an
          <code v-text="'<a-button>'"></code>
          <code v-text="'<a-pagination>'"></code>
          below
        </p>
        <a-button type="primary">Primary</a-button>
        <a-pagination size="small" :total="50" showSizeChanger showQuickJumper />
      </div>
      <HelloWorld msg="Welcome to Your Vue.js App"/>
    </div>
  </a-config-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import HelloWorld from './components/HelloWorld.vue'
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  components: { HelloWorld }
})
export default class App extends Vue {
  zhCN = zhCN
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
