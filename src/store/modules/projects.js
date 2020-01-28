import api from '../../api';

export default {
  namespaced: true,

  state: {
    isLoading: true,
    isLoaded: false,
    isSubmitting: false,
    items: []
  },

  actions: {
    async fetch({ commit }, token) {
      commit('START_LOADING');
      const items = await api.projects(token);
      commit('FINISH_LOADING', items);
    },
    async create({ commit }, { token, project }) {
      commit('START_SUBMITTING');
      const item = await api.createProject(token, project);
      commit('FINISH_SUBMITTING', item);
      return item;
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
    FINISH_SUBMITTING(state, item) {
      state.items = [...state.items, item];
      state.isSubmitting = false;
    }
  }
};
