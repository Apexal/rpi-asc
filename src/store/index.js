import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router'
import firebase from '@/firebase'
import dayjs from 'dayjs'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    queueEnd: dayjs('2020-04-04T18:30:00.000Z'),
    loaded: false,
    alerts: [],
    user: {
      profile: null,
      data: null
    },
    userDataUnsubscribe: null,
    now: new Date()
  },
  getters: {
    queueOpen: state => dayjs(state.now).isSameOrBefore(state.queueEnd),
    userEmail: state => state.user.profile.email,
    userRole: (state, getters) => {
      if (getters.loggedIn) {
        return state.user.profile.email.endsWith('@rpi.edu') ? 'current' : 'accepted'
      }

      return null
    },
    isAdmin: state => state.user.data ? state.user.data.isAdmin : false,
    loggedIn: state => state.user.profile !== null && state.user.data !== null
  },
  mutations: {
    ADD_ALERT (state, { type = 'info', text }) {
      state.alerts = [...state.alerts, { type, text }]
    },
    REMOVE_ALERT (state, alertIndex) {
      state.alerts = state.alerts.filter((_, i) => i !== alertIndex)
    },
    SET_USER_PROFILE (state, profile) {
      state.user = { ...state.user, profile }
    },
    SET_USER_DATA (state, data) {
      state.user = { ...state.user, data }
    },
    SET_USER_DATA_UNSUNSCRIBE (state, unsubscribe) {
      state.userDataUnsubscribe = unsubscribe
    },
    SET_LOADED (state, status) {
      state.loaded = status
    },
    UPDATE_NOW (state) {
      state.now = new Date()
    }
  },
  actions: {
    async UPDATE_USER ({ state, commit, getters }, updates) {
      return firebase.firestore().collection(getters.userRole).doc(state.user.profile.email).update(updates)
    },
    USER_LOGGED_IN ({ commit }, user) {
      commit('SET_USER_PROFILE', user)
      const collection = user.email.endsWith('@rpi.edu') ? 'current' : 'accepted'
      commit('SET_USER_DATA_UNSUNSCRIBE', firebase.firestore().collection(collection).doc(user.email).onSnapshot(function (doc) {
        commit('SET_USER_DATA', doc.data())
        commit('SET_LOADED', true)
      }))
    },
    USER_LOGGED_OUT ({ state, commit, getters }) {
      commit('SET_USER_PROFILE', null)

      if (state.userDataUnsubscribe) state.userDataUnsubscribe()
      commit('SET_USER_DATA_UNSUNSCRIBE', null)
      commit('SET_USER_DATA', null)
      commit('SET_LOADED', true)

      if (router.currentRoute.matched.some(record => record.meta.requiresAuth) && !getters.loggedIn) {
        router.push({ name: 'Home' })
      }
    }
  },
  modules: {
  }
})
