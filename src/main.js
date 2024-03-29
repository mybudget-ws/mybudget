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
import { Integrations } from '@sentry/tracing';
if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://31a2997a7521403fa04ac9e939bd5bf2@o242649.ingest.sentry.io/5266881',
    integrations: [new Integrations.BrowserTracing()],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0
  });
}

import 'materialize-css';
import 'materialize-css/dist/css/materialize.css';

Vue.config.productionTip = false;

// NOTE: Remove Vue.config.devtools when devtools will fixed (from store/index.js as well).
// Vue.config.devtools = process.env.NODE_ENV === 'development';
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
// window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app.constructor;
