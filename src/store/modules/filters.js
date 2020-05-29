export default {
  namespaced: true,

  state: {
    accounts: [],
    categories: [],
    projects: [],
    period: 12 // All time: 9999
  },

  getters: {
    isVisible: state => (
      state.categories.length > 0 ||
        state.accounts.length > 0 ||
        state.projects.length > 0
    ),
    params: state => ({
      accountIds: state.accounts.map(v => v.id),
      categoryIds: state.categories.map(v => v.id),
      projectIds: state.projects.map(v => v.id)
    }),
    searchParams: state => (
      new URLSearchParams({
        accounts: state.accounts.map(v => v.id),
        categories: state.categories.map(v => v.id),
        projects: state.projects.map(v => v.id),
        months: state.period
      }).toString()
    )
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
    removeCategory({ commit }, { category }) {
      commit('REMOVE_CATEGORY', category);
    },
    toggleCategory({ commit, state }, { category }) {
      if (state.categories.find(v => v.id === category.id)) {
        commit('REMOVE_CATEGORY', category);
      } else {
        commit('ADD_CATEGORY', category);
      }
    },
    setProjects({ commit }, { projects }) {
      commit('SET_PROJECTS', projects);
    },
    removeProject({ commit }, { project }) {
      commit('REMOVE_PROJECT', project);
    },
    toggleProject({ commit, state }, { project }) {
      if (state.projects.find(v => v.id === project.id)) {
        commit('REMOVE_PROJECT', project);
      } else {
        commit('ADD_PROJECT', project);
      }
    },
    setPeriod({ commit }, { period }) {
      commit('SET_PERIOD', period);
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
    },
    SET_PROJECTS(state, projects) { state.projects = projects; },
    ADD_PROJECT(state, project) {
      const isPresent = state.projects.find(v => v.id === project.id);
      if (isPresent) { return false; }

      state.projects = [...state.projects, project];
      return true;
    },
    REMOVE_PROJECT(state, project) {
      state.projects = state.projects.filter(v => v.id !== project.id);
    },
    SET_PERIOD(state, period) {
      state.period = period;
    }
  }
};
