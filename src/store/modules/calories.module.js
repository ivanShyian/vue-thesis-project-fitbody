import store from '../index'
export default {
  namespaced: true,
  state() {
    return {
      currentMode: 0,
      currentDaily: 0,
      counter: 0,
      height: '',
      weight: '',
      age: null,
      calculated: null,
      gender: null,
      caloriesComponents: ['mode', 'params', 'activity', 'result'],
      modeButtons: [
        { id: 0, name: 'Gain weight', value: 250 },
        { id: 1, name: 'Lose weight', value: -100 },
        { id: 2, name: 'Keep weight', value: 75 }],
      dailyButtons: [
        { id: 0, name: 'Without', value: 1.2 },
        { id: 1, name: 'Low', value: 1.375 },
        { id: 2, name: 'Normal', value: 1.55 },
        { id: 3, name: 'High', value: 1.725 }]
    }
  },
  mutations: {
    setAge(state, age) {
      state.age = Math.floor((Date.now() - Date.parse(age.join('-'))) / 1000 / 60 / 60 / 24 / 365.25)
    },
    setGender(state) {
      state.gender = store.getters.userData.gender
    },
    setMode(state, id) {
      state.currentMode = id
    },
    setDaily(state, id) {
      state.currentDaily = id
    },
    nextStep(state) {
      if (state.counter + 1 !== state.caloriesComponents.length) {
        state.counter++
      }
    },
    prevStep(state) {
      if (state.counter !== 0) {
        state.counter--
      }
    },
    setHeight(state, height) {
      state.height = height
    },
    setWeight(state, weight) {
      state.weight = weight
    },
    setResult(state, result) {
      state.calculated = result
    },
    clear(state) {
      state.currentMode = 0
      state.currentDaily = 0
      state.counter = 0
      state.height = ''
      state.weight = ''
      state.age = null
      state.calculated = null
      state.gender = null
    }
  },
  getters: {
    result(state) {
      return Math.round(state.calculated)
    },
    currentComponent(state) {
      return state.caloriesComponents[state.counter]
    },
    firstStep(state) {
      return state.counter === 0
    },
    lastStep(_, getters) {
      return getters.currentComponent === 'activity'
    },
    height(state) {
      return state.height
    },
    weight(state) {
      return state.weight
    },
    genderValue(state) {
      return state.gender === 'man' ? 5 : 161
    },
    getAdditionalData(state) {
      return {
        height: state.height,
        weight: state.weight,
        calculated: state.calculated
      }
    }
  },
  actions: {
    calculate({ commit, state, dispatch, getters }) {
      dispatch('age')
      commit('setGender')
      const mode = state.modeButtons[state.currentMode].value
      const activity = state.dailyButtons[state.currentDaily].value
      const result = (((10 * state.weight) + (6.25 * state.height) - (5 * state.age) + getters.genderValue) * activity) + mode
      commit('setResult', result)
    },
    age({ rootGetters, commit }) {
      const birthDate = Object.keys(rootGetters.userData.birth).map(el => rootGetters.userData.birth[el])
      const month = birthDate[1]
      birthDate[1] = birthDate[0]
      birthDate[0] = month
      commit('setAge', birthDate)
    }
  }
}
