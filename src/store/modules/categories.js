import api from '../../api';

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
    isEmpty(state) { return state.items.length === 0; },
    visibleItems: state => state.items.filter(v => !v.isHidden),
    hiddenItems: state => state.items.filter(v => v.isHidden)
  },

  actions: {
    async fetch({ commit }, token) {
      commit('START_LOADING');
      const items = await api.categories(token);
      commit('FINISH_LOADING', items);
    },
    async create({ commit }, { token, category }) {
      commit('START_SUBMITTING');
      const item = await api.createCategory(token, category);
      commit('FINISH_SUBMITTING');
      commit('ADD_ITEM', item);
      return item;
    },
    async destroy({ commit }, { token, category }) {
      try {
        commit('START_DESTROYING');
        await api.destroyCategory(token, category.id);
        commit('FINISH_DESTROYING', category);
        return category;
      } catch {
        commit('FINISH_DESTROYING', {});
        return null;
      }
    },
    async toggleIsFavourite({ commit }, { token, category }) {
      commit('START_SUBMITTING');
      const isFavourite = await api.toggleIsFavourite(token, category.id, 'category');
      commit('TOGGLE_IS_FAVOURITE', { item:category, isFavourite });
      commit('FINISH_SUBMITTING');
      return isFavourite;
    },
    async toggleIsHidden({ commit }, { token, category }) {
      commit('START_SUBMITTING');
      const isHidden = await api.toggleIsHidden(token, category.id, 'category');
      commit('TOGGLE_IS_HIDDEN', { item:category, isHidden });
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
    ADD_ITEM(state, item) {
      state.items = [...state.items, item];
    },
    TOGGLE_IS_FAVOURITE(state, { item, isFavourite }) {
      const category = state.items.find(v => v.id === item.id);
      if (category) {
        category.isFavourite = isFavourite;
      }
    },
    TOGGLE_IS_HIDDEN(state, { item, isHidden }) {
      const category = state.items.find(v => v.id === item.id);
      if (category == null) { return; }
      category.isHidden = isHidden;
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
