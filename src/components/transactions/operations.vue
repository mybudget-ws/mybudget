<template>
  <div class='operations'>
    <router-link
      title='Новый расход'
      class='btn-floating waves-effect waves-light z-depth-0 red'
      :to='expenseUrl'
      :class='isPhone ? "accent-1 btn-large" : "accent-1"'
    >
      <i
        class='material-icons'
        :class='isPhone ? "white-text" : "white-text"'
        :style='isPhone ? "font-size: 2rem" : ""'
      >
        arrow_downward
      </i>
    </router-link>
    <router-link
      title='Новый доход'
      class='btn-floating waves-effect waves-light green z-depth-0 new-income'
      :to='incomeUrl'
      :class='isPhone ? "accent-4 btn-large" : " accent-4"'
    >
      <i
        class='material-icons'
        :class='isPhone ? "white-text" : "white-text"'
        :style='isPhone ? "font-size: 2rem" : ""'
      >
        arrow_upward
      </i>
    </router-link>
    <router-link
      v-if='isTransferVisible'
      title='Новый перевод'
      to='/transactions/transfers/new'
      class='btn-floating waves-effect waves-light indigo z-depth-0 new-transfer'
      :class='isPhone ? "lighten-3 btn-large" : "lighten-3"'
    >
      <i
        class='material-icons'
        :class='isPhone ? "white-text" : "white-text"'
        :style='isPhone ? "font-size: 2rem" : ""'
      >
        repeat
      </i>
    </router-link>
  </div>
</template>

<script>
import { get } from 'vuex-pathify';

import MobileDetect from 'mobile-detect';
const md = new MobileDetect(window.navigator.userAgent);

export default {
  name: 'TransactionOperations',
  components: {},
  props: {},
  data: () => ({
    isPhone: md.phone() != null
  }),
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
    min-width: 212px
    width: 212px

.new-transfer,
.new-income
  margin-left: 12px
</style>
