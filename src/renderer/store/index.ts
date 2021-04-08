import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    playerFilePath: ''
  },
  mutations: {
    setPlayerFilePath(state, payload: string) {
      state.playerFilePath = payload
    }
  },
  actions: {
  },
  modules: {
  }
})
