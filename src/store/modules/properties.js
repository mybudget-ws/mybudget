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
    items: [],

    itemsFilter: [],
    isLoadingFilter: true,
    isLoadedFilter: false
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
    async toggleIsHidden({ commit }, { token, property }) {
      commit('START_SUBMITTING');
      const isHidden = await api.toggleIsHidden(token, property.id, 'property');
      commit('TOGGLE_IS_HIDDEN', { item:property, isHidden });
      commit('FINISH_SUBMITTING');
      return isHidden;
    },

    async fetchFilter({ commit }, token) {
      commit('START_LOADING_FILTER');
      const items = await api.propertiesFilter(token);
      commit('FINISH_LOADING_FILTER', items);
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
      const property = state.items.find(v => v.id === item.id);
      if (property == null) { return; }
      property.isHidden = isHidden;
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
