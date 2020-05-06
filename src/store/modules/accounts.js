import api from '../../api';

export default {
  namespaced: true,

  state: {
    isLoading: true,
    isLoaded: false,
    isSubmitting: false,
    isDestroying: false,
    items: [],

    itemsFilter: [],
    isLoadingFilter: true,
    isLoadedFilter: false
  },

  actions: {
    async fetch({ commit }, token) {
      commit('START_LOADING');
      const items = await api.accounts(token);
      commit('FINISH_LOADING', items);
    },
    async fetchFilter({ commit }, token) {
      commit('START_LOADING_FILTER');
      const items = await api.accountsFilter(token);
      commit('FINISH_LOADING_FILTER', items);
    },
    async create({ commit }, { token, account }) {
      commit('START_SUBMITTING');
      const item = await api.createAccount(token, account);
      commit('FINISH_SUBMITTING', item);
      return item;
    },
    async destroy({ commit }, { token, account }) {
      try {
        commit('START_DESTROYING');
        await api.destroyAccount(token, account.id);
        commit('FINISH_DESTROYING', account);
        return account;
      } catch {
        commit('FINISH_DESTROYING', {});
        return null;
      }
    },
    async toggleIsFavourite({ commit }, { token, account }) {
      commit('START_SUBMITTING');
      const isFavourite = await api.toggleIsFavourite(token, account.id, 'account');
      commit('TOGGLE_IS_FAVOURITE', { item:account, isFavourite });
      commit('FINISH_SUBMITTING');
      return isFavourite;
    }
  },

  mutations: {
    START_LOADING(state) {
      state.isLoading = true;
    },
    FINISH_LOADING(state, items) {
      state.items = items;
      state.isLoading = false;
      state.isLoaded = true;
    },
    START_SUBMITTING(state) {
      state.isSubmitting = true;
    },
    FINISH_SUBMITTING(state) {
      state.isSubmitting = false;
    },
    ADD_ITEM(state, item) {
      state.items = [...state.items, item];
    },
    TOGGLE_IS_FAVOURITE(state, { item, isFavourite }) {
      const account = state.items.find(v => v.id === item.id);
      if (account) {
        account.isFavourite = isFavourite;
      }
    },
    START_DESTROYING(state) {
      state.isDestroying = true;
    },
    FINISH_DESTROYING(state, { id }) {
      state.items = state.items.filter(v => v.id !== id);
      state.isDestroying = false;
    },

    START_LOADING_FILTER(state) {
      state.isLoadingFilter = true;
    },
    FINISH_LOADING_FILTER(state, items) {
      state.itemsFilter = items;
      state.isLoadingFilter = false;
      state.isLoadedFilter = true;
    }
  }
};
