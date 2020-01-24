import Vue from 'vue';
import Vuex from 'vuex';
import pathify, { make } from 'vuex-pathify';
import Api from '../api';

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
    await Api.ping();
  },
  async pingMutation() {
    await Api.pingMutation();
  }
};

const mutations = make.mutations(state);

Vue.use(Vuex);

const store = new Vuex.Store({
  // use the plugin
  plugins: [
    pathify.plugin
  ],
  // properties
  state,
  getters,
  actions,
  mutations
});

export default store;
window.store = store;
