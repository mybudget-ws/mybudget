import Vue from 'vue';
import Router from 'vue-router';
import VueHead from 'vue-head';

import store from '@/store/index';

Vue.use(VueHead);
Vue.use(Router);

function requireAuth(to, from, next) {
  if (!store.getters['user/isSignedIn']) {
    next({ path: '/sign_in', query: { redirect: to.fullPath } });
  } else {
    next();
  }
}

export default new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import(/* webpackChunkName: "landing" */ '@/views/home')
    }, {
      path: '/privacy',
      name: 'privacy',
      component: () => import(/* webpackChunkName: "landing" */ '@/views/privacy')
    }, {
      path: '/agreement',
      name: 'agreement',
      component: () => import(/* webpackChunkName: "landing" */ '@/views/agreement')
    }, {
      path: '/sign_in',
      name: 'sign_in',
      component: () => import(/* webpackChunkName: "landing" */ '@/views/sign_in')
    }, {
      path: '/sign_up',
      name: 'sign_up',
      component: () => import(/* webpackChunkName: "landing" */ '@/views/sign_up')
    }, {
      path: '/forgot_password',
      name: 'forgot_password',
      component: () => import(/* webpackChunkName: "landing" */ '@/views/forgot_password')
    }, {
      path: '/transactions',
      name: 'transactions',
      component: () => import(/* webpackChunkName: "inner" */ '@/views/transactions/index'),
      beforeEnter: requireAuth
    }, {
      path: '/transactions/new',
      name: 'new_transaction',
      component: () => import(/* webpackChunkName: "inner" */ '@/views/transactions/new'),
      beforeEnter: requireAuth
    }, {
      path: '/transactions/:id/edit',
      name: 'edit_transaction',
      component: () => import(/* webpackChunkName: "inner" */ '@/views/transactions/edit'),
      beforeEnter: requireAuth
    }, {
      path: '/transactions/transfers/new',
      name: 'new_transfer',
      component: () => import(/* webpackChunkName: "inner" */ '@/views/transactions/new_transfer'),
      beforeEnter: requireAuth
    }, {
      path: '/accounts',
      name: 'accounts',
      component: () => import(/* webpackChunkName: "inner" */ '@/views/accounts/index'),
      beforeEnter: requireAuth
    }, {
      path: '/accounts/new',
      name: 'new_account',
      component: () => import(/* webpackChunkName: "inner" */ '@/views/accounts/new'),
      beforeEnter: requireAuth
    }, {
      path: '/accounts/:id/edit',
      name: 'edit_account',
      component: () => import(/* webpackChunkName: "inner" */ '@/views/accounts/edit'),
      beforeEnter: requireAuth
    }, {
      path: '/accounts/:id',
      name: 'show_account',
      component: () => import(/* webpackChunkName: "inner" */ '@/views/accounts/show'),
      beforeEnter: requireAuth
    }, {
      path: '/reports/:mode?',
      name: 'reports',
      component: () => import(/* webpackChunkName: "inner" */ '@/views/reports/index'),
      beforeEnter: requireAuth
    }, {
      path: '/categories',
      name: 'categories',
      component: () => import(/* webpackChunkName: "inner" */ '@/views/categories/index'),
      beforeEnter: requireAuth
    }, {
      path: '/categories/new',
      name: 'new_category',
      component: () => import(/* webpackChunkName: "inner" */ '@/views/categories/new'),
      beforeEnter: requireAuth
    }, {
      path: '/categories/:id/edit',
      name: 'edit_category',
      component: () => import(/* webpackChunkName: "inner" */ '@/views/categories/edit'),
      beforeEnter: requireAuth
    }, {
      path: '/budgets',
      name: 'budgets',
      component: () => import(/* webpackChunkName: "inner" */ '@/views/budgets/index'),
      beforeEnter: requireAuth
    }, {
      path: '/goals',
      name: 'goals',
      component: () => import(/* webpackChunkName: "inner" */ '@/views/goals/index'),
      beforeEnter: requireAuth
    }, {
      path: '/goals/:id/edit',
      name: 'edit_goal',
      component: () => import(/* webpackChunkName: "inner" */ '@/views/goals/edit'),
      beforeEnter: requireAuth
    }, {
      path: '/goals/new',
      name: 'new_goal',
      component: () => import(/* webpackChunkName: "inner" */ '@/views/goals/new'),
      beforeEnter: requireAuth
    }, {
      path: '/projects',
      name: 'projects',
      component: () => import(/* webpackChunkName: "inner" */ '@/views/projects/index'),
      beforeEnter: requireAuth
    }, {
      path: '/projects/new',
      name: 'new_project',
      component: () => import(/* webpackChunkName: "inner" */ '@/views/projects/new'),
      beforeEnter: requireAuth
    }, {
      path: '/projects/:id/edit',
      name: 'edit_project',
      component: () => import(/* webpackChunkName: "inner" */ '@/views/projects/edit'),
      beforeEnter: requireAuth
    }, {
      path: '/properties',
      name: 'properties',
      component: () => import(/* webpackChunkName: "inner" */ '@/views/properties/index'),
      beforeEnter: requireAuth
    }, {
      path: '/properties/new',
      name: 'new_property',
      component: () => import(/* webpackChunkName: "inner" */ '@/views/properties/new'),
      beforeEnter: requireAuth
    }, {
      path: '/currencies',
      name: 'currencies',
      component: () => import(/* webpackChunkName: "home-group" */ '@/views/currencies/index')
    }, {
      path: '/settings/:tab',
      name: 'settings',
      component: () => import(/* webpackChunkName: "inner" */ '@/views/settings/index'),
      beforeEnter: requireAuth
    }, {
      path: '/finish-sign-up',
      name: 'finish_sign_up',
      component: () => import(/* webpackChunkName: "inner" */ '@/views/settings/finish_sign_up'),
      beforeEnter: requireAuth
    }, {
      path: '/helps/iphone-icon',
      name: 'helps_iphone_icon',
      component: () => import(/* webpackChunkName: "inner" */ '@/views/helps/iphone_icon')
    }, {
      path: '/helps/emoji-and-icons-in-categories',
      name: 'helps_emoji_icon_in_categories',
      component: () => import(
        /* webpackChunkName: "inner" */ '@/views/helps/emoji_icon_in_categories'
      )
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
