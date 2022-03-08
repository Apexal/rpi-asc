import Vue from 'vue'
import './firebase'
import App from './App.vue'
import router from './router'
import store from './store'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
dayjs.extend(relativeTime)
dayjs.extend(isSameOrBefore)

Vue.config.productionTip = false

setInterval(() => {
  store.commit('UPDATE_NOW')
}, 60 * 1000)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
