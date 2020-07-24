import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: () => ({
    editable: false,
    fireUser: null,
    user: null,
    isAdmin: false,
    userLevel: 9
  }),
  getters: {
    isLogged: (state) => {
      return state.fireUser !== null
    }
  },
  mutations: {
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
