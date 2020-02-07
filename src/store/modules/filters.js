export default {
  namespaced: true,

  state: {
    accounts: [],
    categories: []
  },

  getters: {
    isVisible: state => state.categories.length > 0 || state.accounts.length > 0,
    params: state => ({
      accountIds: state.accounts.map(v => v.id),
      categoryIds: state.categories.map(v => v.id)
    })
  },

  actions: {
    setAccounts({ commit }, { accounts }) {
      commit('SET_ACCOUNTS', accounts);
    },
    removeAccount({ commit }, { account }) {
      commit('REMOVE_ACCOUNT', account);
    },
    toggleAccount({ commit, state }, { account }) {
      if (state.accounts.find(v => v.id === account.id)) {
        commit('REMOVE_ACCOUNT', account);
      } else {
        commit('ADD_ACCOUNT', account);
      }
    },
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
    SET_ACCOUNTS(state, accounts) { state.accounts = accounts; },
    ADD_ACCOUNT(state, account) {
      const isPresent = state.accounts.find(v => v.id === account.id);
      if (isPresent) { return false; }

      state.accounts = [...state.accounts, account];
      return true;
    },
    REMOVE_ACCOUNT(state, account) {
      state.accounts = state.accounts.filter(v => v.id !== account.id);
    },
    SET_CATEGORIES(state, categories) { state.categories = categories; },
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
