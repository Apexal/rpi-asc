import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      profile: null,
      data: null
    }
  },
  getters: {
    userRole: (state, getters) => {
      if (getters.loggedIn) {
        if (state.user.profile.email.endsWith('@rpi.edu')) {
          return state.user.data.isAdmin ? 'faculty' : 'current'
        }
        return 'accepted'
      }

      return null
    },
    loggedIn: state => state.user.profile !== null // && state.user.data !== null
  },
  mutations: {
    SET_USER_PROFILE (state, profile) {
      state.user = { ...state.user, profile }
    },
    SET_USER_DATA (state, data) {
      state.user = { ...state.user, data }
    }
  },
  actions: {
  },
  modules: {
  }
})
