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
      if (user == null) { return false; }

      commit('LOGIN', user);
      return true;
    },
    logout({ commit }) {
      commit('LOGOUT');
    },
    async changeProfile({ commit, state }, { currency }) {
      const { token } = state;
      const user = await api.updateProfile(token, { currency });
      if (user == null) { return false; }

      commit('LOGIN', user);
      return true;
    },
    async changeEmail({ commit, state }, { newEmail, password }) {
      const { token } = state;
      const user = await api.updateEmail(token, { newEmail, password });
      if (user == null) { return false; }

      commit('LOGIN', user);
      return true;
    },
    async changePassword({ commit, state }, { password, newPassword }) {
      const { token } = state;
      const user = await api.updatePassword(token, { password, newPassword });
      if (user == null) { return false; }

      commit('LOGIN', user);
      return true;
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
