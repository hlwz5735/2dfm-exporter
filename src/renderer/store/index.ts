import Vue from 'vue'
import Vuex from 'vuex'
import _2DFMPlayer from '@/entity/2dfm-player'

Vue.use(Vuex)

interface StoreState {
  playerFilePath: string,
  player: _2DFMPlayer | undefined
}

export default new Vuex.Store({
  state: {
    playerFilePath: '',
    player: undefined
  } as StoreState,
  mutations: {
    setPlayerFilePath(state, payload: string) {
      state.playerFilePath = payload
    },
    setPlayer(state, player: _2DFMPlayer) {
      state.player = player
    }
  },
  actions: {
  },
  modules: {
  }
})
