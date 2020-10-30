import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import "./ipcRenderer"

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false


/* 其它代码 */
import db from './RendererDB.js'
Vue.prototype.$db = db;

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  template: '<App/>'
}).$mount('#app')

