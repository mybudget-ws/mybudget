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

  actions: {
    async fetch({ commit }, token) {
      commit('START_LOADING');
      const items = await api.goals(token);
      commit('FINISH_LOADING', items);
    },
    async create({ commit }, { token, goal }) {
      commit('START_SUBMITTING');
      const item = await api.createGoal(token, goal);
      commit('FINISH_SUBMITTING', item);
      return item;
    },
    async destroy({ commit }, { token, goal }) {
      try {
        commit('START_DESTROYING');
        await api.destroyGoal(token, goal.id);
        commit('FINISH_DESTROYING', goal);
        return goal;
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
