import Vue from 'vue'
import App from './App.vue'
import router from './router'
import api from "./plugins/axios";
import store from "./store";
import '@fortawesome/fontawesome-free/css/all.min.css'

import Toasted from 'vue-toasted'

import { ValidationObserver, ValidationProvider, extend } from 'vee-validate'
import * as rules from 'vee-validate/dist/rules'

Object.keys(rules).forEach(rule => {
  extend(rule, rules[rule]);
});

Vue.component('ValidationObserver', ValidationObserver)
Vue.component('ValidationProvider', ValidationProvider)

Vue.use(Toasted, {
  duration: 3000,
  position: 'top-right',
  theme: 'bubble'
})

Vue.prototype.$api = api;
Vue.config.productionTip = false

//Global CSS Import
import '@/assets/css/main.css'

new Vue({
  store,
  router,
  render: h => h(App),
  created() {
    this.$store.dispatch("loadUser");
  },
}).$mount('#app')
