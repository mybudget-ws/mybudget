import Vue from 'vue';
import Router from 'vue-router';
import VueHead from 'vue-head';

import store from '@/store/index';

Vue.use(VueHead);
Vue.use(Router);

function requireAuth(to, from, next) {
  if (!store.getters['user/isSignedIn']) {
    next({ path: '/login', query: { redirect: to.fullPath } });
  } else {
    next();
  }
}

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import(/* webpackChunkName: "landing" */ '@/views/home')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "landing" */ '@/views/sign_in')
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: () => import(/* webpackChunkName: "inner" */ '@/views/transactions/index'),
      beforeEnter: requireAuth
    },
    {
      path: '/transactions/new',
      name: 'new_transaction',
      component: () => import(/* webpackChunkName: "inner" */ '@/views/transactions/new'),
      beforeEnter: requireAuth
    },
    {
      path: '/accounts',
      name: 'accounts',
      component: () => import(/* webpackChunkName: "inner" */ '@/views/accounts/index'),
      beforeEnter: requireAuth
    },
    {
      path: '/accounts/new',
      name: 'new_account',
      component: () => import(/* webpackChunkName: "inner" */ '@/views/accounts/new'),
      beforeEnter: requireAuth
    },
    {
      path: '/reports',
      name: 'reports',
      component: () => import(/* webpackChunkName: "inner" */ '@/views/reports'),
      beforeEnter: requireAuth
    },
    {
      path: '/categories',
      name: 'categories',
      component: () => import(/* webpackChunkName: "inner" */ '@/views/categories'),
      beforeEnter: requireAuth
    },
    {
      path: '/budgets',
      name: 'budgets',
      component: () => import(/* webpackChunkName: "inner" */ '@/views/budgets'),
      beforeEnter: requireAuth
    },
    {
      path: '/projects',
      name: 'projects',
      component: () => import(/* webpackChunkName: "inner" */ '@/views/projects/index'),
      beforeEnter: requireAuth
    },
    {
      path: '/currencies',
      name: 'currencies',
      component: () => import(/* webpackChunkName: "home-group" */ '@/views/currencies/index')
    },
    {
      path: '/settings/:tab',
      name: 'settings',
      component: () => import(/* webpackChunkName: "inner" */ '@/views/settings'),
      beforeEnter: requireAuth
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
