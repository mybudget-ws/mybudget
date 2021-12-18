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
    transactions: [],
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
    },
    async destroyTransaction({ commit }, { token, id }) {
      await api.destroyTransaction(token, id);
      commit('FINISH_TRANSACTION_DESTROYING', id);
    }
  },

  mutations: {
    START_LOADING(state, id) {
      state.id = id;
      state.isLoading = true;
    },
    FINISH_LOADING(state, { name, kind, amount, currency, transactions }) {
      state.name = name;
      state.kind = kind;
      state.amount = amount;
      state.currency = currency.name;
      state.transactions = transactions;
      state.isLoading = false;
      state.isLoaded = true;
    },
    FINISH_TRANSACTION_DESTROYING(state, id) {
      state.transactions = state.transactions.filter(v => v.id !== id);
    }
  }
};
