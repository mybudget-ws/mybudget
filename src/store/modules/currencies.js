import api from '../../api';
// import { make } from 'vuex-pathify';

export default {
  namespaced: true,

  state: {
    base: 'RUB',
    selected: 'USD',
    isLoading: true,
    items: []
  },

  getters: {
    displayedItems: state => state.items.filter(v => v.name !== state.base)
  },

  actions: {
    async fetch({ commit }, { base }) {
      commit('START_LOADING');
      const items = await api.currencies(base);
      commit('FINISH_LOADING', items);
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
    SET_SELECTED(state, selected) {
      state.selected = selected;
    }
  }
};
