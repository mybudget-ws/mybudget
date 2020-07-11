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

  getters: {
    visibleItems: state => state.items.filter(v => !v.isHidden),
    hiddenItems: state => state.items.filter(v => v.isHidden),
    visibleItemsFilter: state => state.itemsFilter.filter(v => !v.isHidden)
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
      commit('FINISH_SUBMITTING');
      return item;
    },
    async destroy({ commit }, { token, account }) {
      try {
        commit('START_DESTROYING');
        await api.destroyAccount(token, account.id);
        commit('FINISH_DESTROYING', account);
        return account;
      } catch (e) {
        console.error(e);
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
    },
    async toggleIsHidden({ commit }, { token, account }) {
      commit('START_SUBMITTING');
      const isHidden = await api.toggleIsHidden(token, account.id, 'account');
      commit('TOGGLE_IS_HIDDEN', { item:account, isHidden });
      commit('FINISH_SUBMITTING');
      return isHidden;
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
      state.isLoadedFilter = false;
    },
    TOGGLE_IS_FAVOURITE(state, { item, isFavourite }) {
      const account = state.items.find(v => v.id === item.id);
      if (account == null) { return; }
      account.isFavourite = isFavourite;
    },
    TOGGLE_IS_HIDDEN(state, { item, isHidden }) {
      const account = state.items.find(v => v.id === item.id);
      if (account == null) { return; }
      account.isHidden = isHidden;
    },
    START_DESTROYING(state) {
      state.isDestroying = true;
    },
    FINISH_DESTROYING(state, { id }) {
      state.items = state.items.filter(v => v.id !== id);
      state.itemsFilter = state.itemsFilter.filter(v => v.id !== id);
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
