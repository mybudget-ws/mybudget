export default {
  namespaced: true,

  state: {
    accounts: [],
    categories: [],
    projects: [],
    properties: [],
    dateStart: null,
    dateEnd: null,
    period: 12 // All time: 9999
  },

  getters: {
    isVisible: state => (
      state.categories.length > 0 ||
        state.accounts.length > 0 ||
        state.projects.length > 0 ||
        state.properties.length > 0
    ),
    params: state => ({
      accountIds: state.accounts.map(v => v.id),
      categoryIds: state.categories.map(v => v.id),
      projectIds: state.projects.map(v => v.id),
      propertyIds: state.properties.map(v => v.id)
    }),
    searchParams: state => (
      new URLSearchParams({
        accounts: state.accounts.map(v => v.id),
        categories: state.categories.map(v => v.id),
        projects: state.projects.map(v => v.id),
        properties: state.properties.map(v => v.id),
        months: state.period,
        dateStart: state.dateStart,
        dateEnd: state.dateEnd
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
    setProperties({ commit }, { properties }) {
      commit('SET_PROPERTIES', properties);
    },
    removeProperty({ commit }, { property }) {
      commit('REMOVE_PROPERTY', property);
    },
    toggleProperty({ commit, state }, { property }) {
      if (state.properties.find(v => v.id === property.id)) {
        commit('REMOVE_PROPERTY', property);
      } else {
        commit('ADD_PROPERTY', property);
      }
    },
    setPeriod({ commit }, { period, dateStart, dateEnd }) {
      commit('SET_PERIOD', { period, dateStart, dateEnd });
    },
    reset({ commit }) {
      commit('RESET');
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
    REMOVE_PROJECT(state, { id }) {
      state.projects = state.projects.filter(v => v.id !== id);
    },
    SET_PROPERTIES(state, properties) { state.properties = properties; },
    ADD_PROPERTY(state, property) {
      const isPresent = state.properties.find(v => v.id === property.id);
      if (isPresent) { return false; }

      state.properties = [...state.properties, property];
      return true;
    },
    REMOVE_PROPERTY(state, { id }) {
      state.properties = state.properties.filter(v => v.id !== id);
    },
    SET_PERIOD(state, { period, dateStart, dateEnd }) {
      state.period = period;
      state.dateStart = dateStart;
      state.dateEnd = dateEnd;
    },
    RESET(state) {
      state.accounts = [];
      state.categories = [];
      state.projects = [];
    }
  }
};
