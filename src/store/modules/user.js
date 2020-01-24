import CookieStore from '@/utils/cookie_store';

import api from '@/api';

const NAMESPACE = 'store#user';

function syncToken(token) {
  CookieStore.set(NAMESPACE, 'token', token);
}

export default {
  namespaced: true,

  state: {
    isSignedIn: true,
    email: null,
    token: CookieStore.get(NAMESPACE, 'token', null)
  },

  getters: {
    isSignedIn: state => (state.email != null && state.token != null)
  },

  actions: {
    async fetch({ commit }) {
      commit('START_LOADING');
      const items = await api.currencies();
      commit('FINISH_LOADING', items);
    },
    async login({ commit }, { email, password }) {
      const { user } = await api.login(email, password);
      if (user != null) {
        commit('LOGIN', user);
      }
    },
    logout({ commit }) {
      commit('LOGOUT');
    }
  },

  mutations: {
    START_LOADING(state) {
      state.isLoading = true;
    },
    FINISH_LOADING(state, items) {
      state.items = items;
      state.isLoading = false;
    },
    LOGIN(state, { email, token }) {
      state.email = email;
      state.token = token;
      syncToken(state.token);
    },
    LOGOUT(state) {
      Object.assign(state, { email: null, token: null });
      syncToken(null);
    }
  }
};
