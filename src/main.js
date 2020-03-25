import Vue from 'vue'
import { firestorePlugin } from 'vuefire'
import './firebase'
import App from './App.vue'
import router from './router'
import store from './store'
Vue.use(firestorePlugin)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
