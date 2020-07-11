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
      const items = await api.projects(token);
      commit('FINISH_LOADING', items);
    },
    async create({ commit }, { token, project }) {
      commit('START_SUBMITTING');
      const item = await api.createProject(token, project);
      commit('FINISH_SUBMITTING', item);
      return item;
    },
    async destroy({ commit }, { token, project }) {
      try {
        commit('START_DESTROYING');
        await api.destroyProject(token, project.id);
        commit('FINISH_DESTROYING', project);
        return project;
      } catch {
        commit('FINISH_DESTROYING', {});
        return null;
      }
    },
    async toggleIsHidden({ commit }, { token, project }) {
      console.log('toggle');
      commit('START_SUBMITTING');
      console.log(token);
      console.log(project);
      const isHidden = await api.toggleIsHidden(token, project.id, 'project');
      commit('TOGGLE_IS_HIDDEN', { item:project, isHidden });
      commit('FINISH_SUBMITTING');
      return isHidden;
    },

    async fetchFilter({ commit }, token) {
      commit('START_LOADING_FILTER');
      const items = await api.projectsFilter(token);
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
      state.isLoadedFilter = false;
    },
    START_DESTROYING(state) {
      state.isDestroying = true;
    },
    FINISH_DESTROYING(state, { id }) {
      state.items = state.items.filter(v => v.id !== id);
      state.itemsFilter = state.itemsFilter.filter(v => v.id !== id);
      state.isDestroying = false;
    },
    TOGGLE_IS_HIDDEN(state, { item, isHidden }) {
      const project = state.items.find(v => v.id === item.id);
      if (project == null) { return; }
      project.isHidden = isHidden;
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
