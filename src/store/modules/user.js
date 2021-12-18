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
    token: CookieStore.get(NAMESPACE, 'token', null),
    reportMode: CookieStore.get(NAMESPACE, 'report_mode', 'balance'),
    currency: undefined
  },

  getters: {
    isSignedIn: state => (state.email != null && state.token != null),
    isGuest: state => (state.email != null && state.email.match(/@2\.mybudget/)),
    defaultCurrency: state => (state?.currency?.name)
  },

  actions: {
    async login({ commit }, { email, password }) {
      const { user } = await api.login(email, password);
      if (user == null) { return false; }

      commit('LOGIN', user);
      return true;
    },
    async autoSignUp({ commit }) {
      const { user } = await api.autoSignUp();
      if (user == null) { return false; }

      commit('LOGIN', user);
      return true;
    },
    async registration({ commit, state }, { email, password }) {
      const { token } = state;
      const data = await api.registration(token, { email, password });
      if (data.user == null) { return data; }

      commit('LOGIN', data.user);
      return data;
    },
    async resetPassword({ _commit }, { email }) {
      return await api.resetPassword({ email });
    },
    logout({ commit }) {
      commit('LOGOUT');
    },
    async fetchProfile({ commit, state }) {
      const { token } = state;
      const user = await api.fetchProfile(token);
      if (user == null) { return; }

      commit('FETCH', user);
      return true;
    },
    async updateProfile({ state }, { currency }) {
      const { token } = state;
      console.warn('store');
      const user = await api.updateProfile(token, { currency });
      if (user == null) { return false; }

      return true;
    },
    async changeEmail({ commit, state }, { newEmail, password }) {
      const { token } = state;
      const data = await api.updateEmail(token, { newEmail, password });
      if (data.user == null) { return data; }

      commit('LOGIN', data.user);
      return data;
    },
    async changePassword({ commit, state }, { password, newPassword }) {
      const { token } = state;
      const user = await api.updatePassword(token, { password, newPassword });
      if (user == null) { return false; }

      commit('LOGIN', user);
      return true;
    },
    updateReportMode({ commit, state }, { mode }) {
      if (mode == null) { return; }
      if (mode == state.reportMode) { return; }
      commit('UPDATE_REPORT_MODE', mode);
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
    },
    FETCH(state, user) {
      state.email = user.email;
      state.currency = user.defaultCurrency;
    },
    UPDATE_REPORT_MODE(state, mode) {
      state.reportMode = mode;
      saveCookies('report_mode', mode);
    }
  }
};
