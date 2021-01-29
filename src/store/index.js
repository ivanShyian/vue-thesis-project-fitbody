import { createStore, createLogger } from 'vuex'
import fitbodyAxios from '@/axios/fitbody-requests'
import auth from './modules/auth.module'
import alert from './modules/alert.module'
import register from './modules/register.module'
import menuList from './modules/menuList.module'
import calories from './modules/calories.module'
import update from './modules/update.module'

const plugins = []
if (process.env.NODE_ENV === 'development') {
  plugins.push(createLogger())
}

export default createStore({
  plugins,
  state() {
    return {
      userData: {}
    }
  },
  mutations: {
    setData(state, data) {
      state.userData = data
    },
    clearData(state) {
      state.userData = {}
    }
  },
  getters: {
    userData(state) {
      return state.userData
    },
    isEmpty(state) {
      return Object.keys(state.userData).length === 0
    }
  },
  actions: {
    async load({ rootGetters, commit }) {
      const token = rootGetters['auth/token']
      const uid = rootGetters['auth/userId']
      const { data } = await fitbodyAxios.get(`/users/${uid}.json?auth=${token}`)
      commit('setData', data)
    },
    async update({ state, getters, commit, rootGetters }, additional) {
      const token = rootGetters['auth/token']
      const uid = rootGetters['auth/userId']
      const data = state.userData
      commit('setData', { ...data, ...additional })
      await fitbodyAxios.put(`/users/${uid}.json?auth=${token}`, getters.userData)
    }
  },
  modules: {
    auth,
    alert,
    register,
    menuList,
    calories,
    update
  }
})
