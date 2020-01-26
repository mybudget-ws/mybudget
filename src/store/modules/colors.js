import api from '../../api';

export default {
  namespaced: true,

  state: {
    isLoading: true,
    items: []
  },

  actions: {
    async fetch({ state, commit }) {
      if (!state.isLoading) { return; }

      commit('START_LOADING');
      const items = await api.colors();
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
