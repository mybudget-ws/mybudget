<template>
  <div class='operations'>
    <router-link
      :to='expenseUrl'
      title='Новый расход'
      class='btn-floating waves-effect waves-light red lighten-4 z-depth-0'
    >
      <i class='material-icons grey-text text-darken-1'>arrow_downward</i>
    </router-link>
    <router-link
      :to='incomeUrl'
      title='Новый доход'
      class='btn-floating waves-effect waves-light green accent-1 z-depth-0 new-income'
    >
      <i class='material-icons grey-text text-darken-1'>arrow_upward</i>
    </router-link>
    <router-link
      v-if='isTransferVisible'
      to='/transactions/transfers/new'
      title='Новый перевод'
      class='btn-floating waves-effect waves-light indigo lighten-5 z-depth-0 new-transfer'
    >
      <i class='material-icons grey-text text-darken-1'>repeat</i>
    </router-link>
  </div>
</template>

<script>
import { get } from 'vuex-pathify';

export default {
  name: 'TransactionOperations',
  components: {},
  props: {},
  computed: {
    accounts: get('accounts/visibleItemsFilter'),
    selectedAccounts: get('filters/accounts'),
    expenseUrl() {
      if (this.selectedAccounts.length > 0) {
        return `/transactions/new?account=${this.selectedAccounts[0].id}`;
      }
      return '/transactions/new';
    },
    incomeUrl() {
      if (this.selectedAccounts.length > 0) {
        return `/transactions/new?isIncome=true&account=${this.selectedAccounts[0].id}`;
      }
      return '/transactions/new?isIncome=true';
    },
    isTransferVisible() { return this.accounts.length > 1; }
  },
  methods: {}
};
</script>

<style scoped lang='sass'>
.operations
  display: inline-block
  @media only screen and (max-width: 601px)
    z-index: 2
    position: fixed
    bottom: 0
    right: 0
    padding: 0 20px 20px 0
    min-width: 160px

.new-transfer,
.new-income
  margin-left: 12px
</style>
