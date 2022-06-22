import { createStore } from 'vuex'
import createPersistedState from "vuex-persistedstate"

export default createStore({
  plugins: [
    createPersistedState()
  ],
  state: {
    token: null,
    user: null,
    isLoggedIn: false,
    alert: null
  },
  getters: {
  },
  mutations: {
    setToken(state, token) {
      state.token = token
      if (state.token) {
        state.isLoggedIn = true
      }
      else {
        state.isLoggedIn = false
      }
    },
    setUser(state, user) {
      state.user = user
    },
    setAlert(state, alert) {
      state.alert = alert
    }
  },
  actions: {
    setToken({ commit }, token) {
      commit('setToken', token)
    },
    setUser({ commit }, user) {
      commit('setUser', user)
    },
    setAlert({ commit }, alert) {
      commit('setAlert', alert)
    }
  }
})