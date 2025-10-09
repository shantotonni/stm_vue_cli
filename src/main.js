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

// Simple toast notification
Vue.prototype.$toast = {
  success(message) {
    this.show(message, 'success');
  },
  error(message) {
    this.show(message, 'danger');
  },
  info(message) {
    this.show(message, 'info');
  },
  warning(message) {
    this.show(message, 'warning');
  },
  show(message, type) {
    const toast = document.createElement('div');
    toast.className = `alert alert-${type} alert-dismissible fade show toast-notification`;
    toast.innerHTML = `
      ${message}
      <button type="button" class="close" data-dismiss="alert">
        <span>&times;</span>
      </button>
    `;
    toast.style.cssText = `
      position: fixed;
      background:green;
      top: 20px;
      right: 20px;
      min-width: 250px;
      z-index: 9999;
      animation: slideInRight 0.3s ease-out;
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 5000);
  }
};

new Vue({
  store,
  router,
  render: h => h(App),
  created() {
    this.$store.dispatch("loadUser");
  },
}).$mount('#app')
