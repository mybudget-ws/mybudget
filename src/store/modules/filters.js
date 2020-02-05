export default {
  namespaced: true,

  state: {
    categories: []
  },

  getters: {
    isVisible: state => state.categories.length > 0
  },

  actions: {
    setCategories({ commit }, { categories }) {
      commit('SET_CATEGORIES', categories);
    },
    addCategory({ commit }, { category }) {
      commit('ADD_CATEGORY', category);
    },
    removeCategory({ commit }, { category }) {
      commit('REMOVE_CATEGORY', category);
    },
    toggleCategory({ commit, state }, { category }) {
      if (state.categories.find(v => v.id === category.id)) {
        commit('REMOVE_CATEGORY', category);
      } else {
        commit('ADD_CATEGORY', category);
      }
    }
  },

  mutations: {
    SET_CATEGORIES(state, categories) {
      state.categories = categories;
    },
    ADD_CATEGORY(state, category) {
      const isPresent = state.categories.find(v => v.id === category.id);
      if (isPresent) { return false; }

      state.categories = [...state.categories, category];
      return true;
    },
    REMOVE_CATEGORY(state, category) {
      state.categories = state.categories.filter(v => v.id !== category.id);
    }
  }
};
