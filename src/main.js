import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import store from './store'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import VueGoogleCharts from 'vue-google-charts'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'

// configure language
locale.use(lang)

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI)
Vue.use(VueGoogleCharts)
Vue.use(VueMaterial)

Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  el: '#app',
  store,
  render: h => h(App),
})
