import Vue from 'vue';
import Vuex from 'vuex';
import pathify, { make } from 'vuex-pathify';

import accounts from './modules/accounts';
import api from '../api';
import categories from './modules/categories';
import colors from './modules/colors';
import currencies from './modules/currencies';
import filters from './modules/filters';
import goals from './modules/goals';
import projects from './modules/projects';
import properties from './modules/properties';
import property from './modules/property';
import transactions from './modules/transactions';
import user from './modules/user';

// Vue.config.devtools = process.env.NODE_ENV === 'development';

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
    categories,
    colors,
    currencies,
    filters,
    goals,
    projects,
    properties,
    property,
    transactions,
    user
  },
  plugins: [pathify.plugin]
});

export default store;
window.store = store;
