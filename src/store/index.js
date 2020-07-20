import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    editable: false,
    fireUser: null,
    user: null,
    token: '',
    isAdmin: false,
    userLevel: 9
  },
  mutations: {
    setToken (state, token) {
      if (token) state.token = 'Bearer ' + token
    },
    setEdit (state, edit) {
      if (state.isAdmin) state.editable = edit // admin 만 가능
    },
    setFireUser (state, fu) {
      state.fireUser = fu
    },
    setUser (state, user) {
      state.user = user
    },
    setIsAdmin (state, isAdmin) {
      state.isAdmin = isAdmin
    },
    setLevel (state, level) {
      state.userLevel = level
    }
  },
  actions: {
    setFireUser ({ commit }, payload) {
      commit('setFireUser', payload)
    }
  },
  modules: {
  }
})
