import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import store from './store'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

Vue.use(VueMaterial)

Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  el: '#app',
  store,
  render: h => h(App),
})
