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

import * as Sentry from '@sentry/browser';
import { Vue as VueIntegration } from '@sentry/integrations';
Sentry.init({
  dsn: 'https://31a2997a7521403fa04ac9e939bd5bf2@o242649.ingest.sentry.io/5266881',
  integrations: [new VueIntegration({ Vue, attachProps: true })]
});

import 'materialize-css';
import 'materialize-css/dist/css/materialize.css';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
