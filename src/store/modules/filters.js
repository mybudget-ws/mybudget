// TODO: Uncomment if need to save preferences to the database
// import api from '../../api';

export default {
  namespaced: true,

  state: {
    categories: []
  },

  getters: {
    isVisible: state => state.categories.length > 0
  },

  actions: {
    // async fetch({ commit }) {
    //   commit('START_LOADING');
    //   const items = await api.currencies();
    //   commit('FINISH_LOADING', items);
    // }
  },

  mutations: {
    // START_LOADING(state) {
    //   state.isLoading = true;
    // },
    // FINISH_LOADING(state, items) {
    //   state.items = items;
    //   state.isLoading = false;
    // }
  }
};
