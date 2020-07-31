import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import './plugins/firebase'
import './plugins/toast-editor'
import './plugins/moment'
import './plugins/vue-qrcode'
import './plugins/vee-validate'
import './error'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app')
