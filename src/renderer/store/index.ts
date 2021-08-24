import Vue from 'vue'
import Vuex from 'vuex'
import _2DFMPlayer from '@/entity/2dfm-player'
import { getImageDataByIndex } from '@/util/2dfm-image-to-image-data'

Vue.use(Vuex)

interface StoreState {
  playerFilePath: string,
  player: _2DFMPlayer | undefined,
  playerImgPool: Array<ImageData>,
  showPreview: boolean
}

interface AddImagePayload {
  index: number,
  imageData: ImageData
}

export default new Vuex.Store({
  state: {
    playerFilePath: '',
    player: undefined,
    playerImgPool: new Array(1024),
    showPreview: false
  } as StoreState,
  mutations: {
    setPlayerFilePath(state, payload: string): void {
      state.playerFilePath = payload
    },
    setPlayer(state, player: _2DFMPlayer): void {
      state.player = player
    },
    addImage(state, payload: AddImagePayload): void {
      Vue.set(state.playerImgPool, payload.index, payload.imageData)
    },
    setShowPreview(state, payload: boolean): void {
      state.showPreview = payload
    }
  },
  actions: {
    getImage({ commit, state }, index: number): ImageData | undefined{
      if (state.playerImgPool[index]) {
        return state.playerImgPool[index]
      } else {
        if (!state.player) {
          return
        }
        const imageData = getImageDataByIndex(state.player, index)
        if (!imageData) {
          return
        }
        commit('addImage', { index, imageData })
        return imageData
      }
    }
  },
  modules: {
  }
})
