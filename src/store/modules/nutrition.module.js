import fitbodyAxios from '@/axios/fitbody-requests'

export default {
  namespaced: true,
  state() {
    return {
      nutritionList: []
    }
  },
  getters: {
    nutrition(state) {
      return state.nutritionList
    }
  },
  mutations: {
    setList(state, payload) {
      state.nutritionList = payload
    },
    updateList(state, { source, item }) {
      state.nutritionList[source].push(item)
    }
  },
  actions: {
    async loadNutrition({ commit, rootGetters }) {
      try {
        const token = rootGetters['auth/token']
        const uid = rootGetters['auth/userId']
        const { data } = await fitbodyAxios.get(`/users/${uid}/nutrition.json?auth=${token}`)
        if (!data) {
          throw new Error('List is empty')
        }
        console.log(data)
        // commit('setList', data)
      } catch (e) {
        console.log(e.message)
      }
    },
    async updateNutrition({ commit, rootGetters }, { source, item }) {
      try {
        const token = rootGetters['auth/token']
        const uid = rootGetters['auth/userId']
        commit('updateList', { source, item })
        const response = await fitbodyAxios.put(`/users/${uid}/nutrition/${source}.json?auth=${token}`, item)
        console.log(response)
      } catch (e) {
        console.log(e.message)
      }
    }
  }
}
