import Vue from 'vue';
import Vuex from 'vuex';
import pathify, { make } from 'vuex-pathify';

import api from '../api';
import accounts from './modules/accounts';
import colors from './modules/colors';
import currencies from './modules/currencies';
import user from './modules/user';

Vue.use(Vuex);

const state = {
  greeting: 'Hello',
  name: 'World'
};

const getters = {
  message(state) {
    return `${state.greeting} ${state.name}!`;
  }
};

const actions = {
  greet({ getters }) {
    alert(getters.message);
  },
  async ping() {
    await api.ping();
  },
  async pingMutation() {
    await api.pingMutation();
  }
};

const mutations = make.mutations(state);

Vue.use(Vuex);

const store = new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  modules: {
    accounts,
    colors,
    currencies,
    user
  },
  plugins: [pathify.plugin]
});

export default store;
window.store = store;
