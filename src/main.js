import Vue from 'vue'
import App from './App.vue'
import router from './router'
import api from "./plugins/axios";
import store from "./store";
import '@fortawesome/fontawesome-free/css/all.min.css'
// import { createApp } from 'vue'

// import toast from './utils/toast'

import Toasted from 'vue-toasted'

import { ValidationObserver, ValidationProvider, extend } from 'vee-validate'
import * as rules from 'vee-validate/dist/rules'

// Import global components
// import LoadingSpinner from './components/Common/LoadingSpinner.vue'
// import ConfirmDialog from './components/Common/ConfirmDialog.vue'
// import DataTable from './components/Common/DataTable.vue'
// import FileUpload from './components/Common/FileUpload.vue'

// Import main layout
// import AppLayout from '@/components/layouts/StudentLayout'

// const app = createApp(AppLayout)

// // Register global components
// app.component('LoadingSpinner', LoadingSpinner)
// app.component('ConfirmDialog', ConfirmDialog)
// app.component('DataTable', DataTable)
// app.component('FileUpload', FileUpload)
//
// // Global properties
// app.config.globalProperties.$toast = toast
// app.config.globalProperties.$http = window.axios

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

// Simple toast.js notification
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
