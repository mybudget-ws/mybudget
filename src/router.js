import Vue from 'vue';
import Router from 'vue-router';
import VueHead from 'vue-head';

// import store from '@/store/index';

Vue.use(VueHead);
Vue.use(Router);

// function requireAuth(to, from, next) {
//   if (!store.getters['user/isSignedIn']) {
//     next({ path: '/login', query: { redirect: to.fullPath } });
//   } else {
//     next();
//   }
// }

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import(/* webpackChunkName: "landing" */ '@/views/home')
    },
    // {
    //   path: '/summary',
    //   name: 'summary',
    //   component: () => import(/* webpackChunkName: "inner" */ '@/views/summary'),
    //   beforeEnter: requireAuth
    // },
    {
      path: '/currencies',
      name: 'currencies',
      component: () => import(/* webpackChunkName: "home-group" */ '@/views/currencies.vue')
    }
    // , {
    //   path: '*',
    //   component: () => import(/* webpackChunkName: "landing" */ '@/views/dynamic')
    // }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  }
});
