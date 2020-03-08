import api from '../../api';

export default {
  namespaced: true,

  state: {
    isLoading: true,
    isLoadingPage: false,
    isSubmitting: false,
    isDestroying: false,
    items: [],
    page: 1,
    perPage: 50,
    isMore: true
  },

  actions: {
    async fetch({ commit, state }, { token, filters }) {
      commit('START_LOADING');
      const { page, perPage } = state;
      const items = await api.transactions(token, { page, perPage, filters });
      commit('FINISH_LOADING', items);
    },
    async fetchNext({ commit, state }, { token, filters }) {
      commit('START_NEXT_PAGE');
      const { page, perPage } = state;
      const items = await api.transactions(token, { page, perPage, filters });
      commit('FINISH_NEXT_PAGE', items);
    },
    async create({ commit }, { token, transaction }) {
      commit('START_SUBMITTING');
      const item = await api.createTransaction(token, transaction);
      commit('FINISH_SUBMITTING', item);
      return item;
    },
    async createTransfer({ commit }, { token, transfer }) {
      commit('START_SUBMITTING');
      const item = await api.createTransactionTransfer(token, transfer);
      commit('FINISH_SUBMITTING', item);
      return item;
    },
    async destroy({ commit, state }, { token, transaction, filters }) {
      try {
        commit('START_DESTROYING');
        await api.destroyTransaction(token, transaction.id);
        commit('FINISH_DESTROYING', transaction);
        const { page, perPage } = state;
        const items = await api.transactions(token, { page, perPage, filters });
        commit('FINISH_LOADING', items);
        return transaction;
      } catch (e) {
        console.error(e);
        commit('FINISH_DESTROYING', {});
        return null;
      }
    }
  },

  mutations: {
    START_LOADING(state) {
      state.isLoading = true;
      state.isMore = true;
      state.page = 1;
    },
    FINISH_LOADING(state, items) {
      state.items = items;
      state.isLoading = false;
      state.isMore = items.length >= state.perPage;
    },
    START_SUBMITTING(state) { state.isSubmitting = true; },
    FINISH_SUBMITTING(state, item) {
      state.items = [item, ...state.items];
      state.isSubmitting = false;
    },
    START_DESTROYING(state) { state.isDestroying = true; },
    FINISH_DESTROYING(state, { id }) {
      state.items = state.items.filter(v => v.id !== id);
      state.isDestroying = false;
    },
    START_NEXT_PAGE(state) {
      state.isLoadingPage = true;
      state.page = state.page + 1;
    },
    FINISH_NEXT_PAGE(state, items) {
      state.isLoadingPage = false;
      state.isMore = items.length >= state.perPage;
      state.items = [...state.items, ...items];
    }
  }
};
