import api from '../../api';

const KIND = {
  realty: 'Недвижимость',
  transport: 'Транспорт',
  other: 'Другое'
};

export default {
  namespaced: true,

  state: {
    id: null,
    name: null,
    kind: null,
    amount: null,
    currency: null,
    isLoading: true,
    isLoaded: false
  },

  getters: {
    kindText: state => KIND[state.kind]
  },

  actions: {
    async fetch({ commit }, { token, id }) {
      commit('START_LOADING', id);
      const item = await api.property(token, { id });
      commit('FINISH_LOADING', item);
    }
  },

  mutations: {
    START_LOADING(state, id) {
      state.id = id;
      state.isLoading = true;
    },
    FINISH_LOADING(state, { name, kind, amount, currency }) {
      state.name = name;
      state.kind = kind;
      state.amount = amount;
      state.currency = currency.name;
      state.isLoading = false;
      state.isLoaded = true;
    }
  }
};
