import api from '../../api';

const KINDS = [
  { value: 'realty', name: 'Недвижимость' },
  { value: 'transport', name: 'Транспорт' },
  { value: 'other', name: 'Другое' }
];

export default {
  namespaced: true,

  state: {
    isLoading: true,
    isLoaded: false,
    isSubmitting: false,
    isDestroying: false,
    items: []
  },

  getters: {
    visibleItems: state => state.items.filter(v => !v.isHidden),
    hiddenItems: state => state.items.filter(v => v.isHidden),
    visibleItemsFilter: state => state.itemsFilter.filter(v => !v.isHidden),
    kinds: _state => KINDS
  },

  actions: {
    async fetch({ commit }, token) {
      commit('START_LOADING');
      const items = await api.properties(token);
      commit('FINISH_LOADING', items);
    },
    async create({ commit }, { token, property }) {
      commit('START_SUBMITTING');
      const item = await api.createProperty(token, property);
      commit('FINISH_SUBMITTING');
      return item;
    },
    async destroy({ commit }, { token, property }) {
      try {
        commit('START_DESTROYING');
        await api.destroyProperty(token, property.id);
        commit('FINISH_DESTROYING', property);
        return property;
      } catch (e) {
        console.error(e);
        commit('FINISH_DESTROYING', {});
        return null;
      }
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
      state.isDestroying = false;
    }
  }
};
