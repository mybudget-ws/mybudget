import api from '../../api';

export default {
  namespaced: true,

  state: {
    isLoading: true,
    isSubmitting: false,
    items: [],
    page: 1
  },

  actions: {
    async fetch({ commit, state }, token) {
      commit('START_LOADING');
      const { page } = state;
      const items = await api.transactions(token, { page });
      commit('FINISH_LOADING', items);
    }
    // async create({ commit }, { token, account }) {
    //   commit('START_SUBMITTING');
    //   const item = await api.createAccount(token, account);
    //   commit('FINISH_SUBMITTING', item);
    //   return item;
    // }
  },

  mutations: {
    START_LOADING(state) {
      state.isLoading = true;
    },
    FINISH_LOADING(state, items) {
      state.items = items;
      state.isLoading = false;
    },
    START_SUBMITTING(state) {
      state.isSubmitting = true;
    },
    FINISH_SUBMITTING(state, item) {
      state.items = [...state.items, item];
      state.isSubmitting = false;
    }
  }
};
