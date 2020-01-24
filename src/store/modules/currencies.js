import api from '../../api';

export default {
  namespaced: true,

  state: {
    isLoading: 'true',
    items: []
  },

  getters: {
    displayedItems: state => state.items.filter(v => v.name !== 'USD')
  },

  actions: {
    async fetch({ commit }) {
      commit('START_LOADING');
      const items = await api.currencies();
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
    }
  }
};
