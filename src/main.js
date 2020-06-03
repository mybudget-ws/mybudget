import Vue from 'vue';
import App from './app.vue';
import router from './router';
import store from './store/index';

import VueAnalytics from 'vue-analytics';
if (process.env.NODE_ENV === 'production') {
  Vue.use(VueAnalytics, {
    id: 'UA-49766114-6',
    router
  });
}

import 'materialize-css';
import 'materialize-css/dist/css/materialize.css';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
