import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router'
import firebase from '@/firebase'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      profile: null,
      data: null
    },
    userDataUnsubscribe: null
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
    isAdmin: state => state.user.data ? state.user.data.isAdmin : false,
    loggedIn: state => state.user.profile !== null && state.user.data !== null
  },
  mutations: {
    SET_USER_PROFILE (state, profile) {
      state.user = { ...state.user, profile }
    },
    SET_USER_DATA (state, data) {
      state.user = { ...state.user, data }
    },
    SET_USER_DATA_UNSUNSCRIBE (state, unsubscribe) {
      state.userDataUnsubscribe = unsubscribe
    }
  },
  actions: {
    USER_LOGGED_IN ({ commit }, user) {
      commit('SET_USER_PROFILE', user)
      const collection = user.email.endsWith('@rpi.edu') ? 'current' : 'accepted'
      commit('SET_USER_DATA_UNSUNSCRIBE', firebase.firestore().collection(collection).doc(user.email).onSnapshot(function (doc) {
        commit('SET_USER_DATA', doc.data())
      }))
    },
    USER_LOGGED_OUT ({ state, commit, getters }) {
      commit('SET_USER_PROFILE', null)

      if (state.userDataUnsubscribe) state.userDataUnsubscribe()
      commit('SET_USER_DATA_UNSUNSCRIBE', null)
      commit('SET_USER_DATA', null)

      if (router.currentRoute.matched.some(record => record.meta.requiresAuth) && !getters.loggedIn) {
        router.push({ name: 'Home' })
      }
    }
  },
  modules: {
  }
})
