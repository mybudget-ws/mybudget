import CookieStore from '@/utils/cookie_store';

import api from '@/api';

const NAMESPACE = 'mybudget#store#user';

function saveCookies(key, value) {
  CookieStore.set(NAMESPACE, key, value);
}

export default {
  namespaced: true,

  state: {
    email: CookieStore.get(NAMESPACE, 'email', null),
    token: CookieStore.get(NAMESPACE, 'token', null)
  },

  getters: {
    isSignedIn: state => (state.email != null && state.token != null)
  },

  actions: {
    async login({ commit }, { email, password }) {
      const { user } = await api.login(email, password);
      if (user != null) {
        commit('LOGIN', user);
        return true;
      }
      return false;
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
      saveCookies('email', state.email);
      saveCookies('token', state.token);
    },
    LOGOUT(state) {
      Object.assign(state, { email: null, token: null });
      saveCookies('email', null);
      saveCookies('token', null);
    }
  }
};
