<template>
  <div class='operations'>
    <router-link
      title='Новый расход'
      class='btn-floating waves-effect waves-light z-depth-0 red'
      :to='expensePath'
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
      :to='incomePath'
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
      :to='newTransferPath'
      :class='isPhone ? "lighten-3 btn-large" : "lighten-3"'
      class='btn-floating waves-effect waves-light indigo z-depth-0 new-transfer'
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
  props: {
    accountId: { type: Number, required: false, default: null },
    backPath: { type: String, required: false, default: null }
  },
  data: () => ({
    isPhone: md.phone() != null
  }),
  computed: {
    accounts: get('accounts/visibleItemsFilter'),
    selectedAccounts: get('filters/accounts'),
    expensePath() {
      if (this.accountId) {
        if (this.backPath) {
          return `/transactions/new?account=${this.accountId}&backTo=${this.backPath}`;
        } else {
          return `/transactions/new?account=${this.accountId}`;
        }
      }
      if (this.selectedAccounts.length > 0) {
        return `/transactions/new?account=${this.selectedAccounts[0].id}`;
      }
      return '/transactions/new';
    },
    incomePath() {
      if (this.accountId) {
        if (this.backPath) {
          return `/transactions/new??isIncome=true&account=${this.accountId}` +
            `&backTo=${this.backPath}`;
        } else {
          return `/transactions/new??isIncome=true&account=${this.accountId}`;
        }
      }
      if (this.selectedAccounts.length > 0) {
        return `/transactions/new?isIncome=true&account=${this.selectedAccounts[0].id}`;
      }
      return '/transactions/new?isIncome=true';
    },
    newTransferPath() {
      if (this.accountId) {
        return `/transactions/transfers/new?accountIdDst=${this.accountId}&backTo=${this.backPath}`;
      }
      return '/transactions/transfers/new?backTo=${backPath}';
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
