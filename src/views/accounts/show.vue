<template>
  <div>
    <Menu />
    <div class='container container-wide'>
      <PageHeader
        v-if='!isLoadingAccount'
        :cover=coverClasses
      >
        <a
          class='edit waves-effect waves-teal btn-flat'
          title='Редактировать'
          @click='onEdit(item)'
        >
          <i class='material-icons grey-text'>edit</i>
        </a>
        <span class='account-header'>
          <span class='name-with-operations'>
            <span class='name'>{{ name }}</span>
            <TransactionOperations
              :account-id='parseInt(id)'
              :back-path='backPath'
            />
          </span>
          <Amount :value='balance' :currency='currency' class='balance' />
        </span>
      </PageHeader>

      <div class='row transactions'>
        <div class='col s12'>
          <Loader v-if='isLoading' />
          <Collection
            v-show='!isLoading'
            :account-id='parseInt(id)'
            :back-path='backPath'
            is-filters-disabled
            @loaded='onTransactionLoaded'
            @destroy='onTransactionDestroy'
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Amount from '@/components/amount';
import Collection from '@/components/transactions/collection';
import Loader from '@/components/loader';
import Menu from '@/components/menu';
import PageHeader from '@/components/page_header';
import TransactionOperations from '@/components/transactions/operations';
import api from '@/api';
import { get, call } from 'vuex-pathify';

import MobileDetect from 'mobile-detect';
const md = new MobileDetect(window.navigator.userAgent);

export default {
  name: 'ShowAccount',
  components: {
    Amount,
    Collection,
    Loader,
    Menu,
    PageHeader,
    TransactionOperations
  },
  props: {},
  data: () => ({
    name: '',
    color: '',
    kind: '',
    currency: '',
    balance: 0,

    isLoadingAccount: true,
    isLoadingTransactions: true,
    isPhone: md.phone() != null
  }),
  computed: {
    token: get('user/token'),
    kinds: get('accounts/kinds'),
    ...get('transactions/*'),
    id() { return this.$route.params.id; },
    isLoading() { return this.isLoadingAccount || this.isLoadingTransactions; },
    backPath() { return `/accounts/${this.id}`; },
    coverClasses() {
      if (this.isLoadingAccount) { return null; }
      return `${this.color} lighten-3`;
    }
  },
  async mounted() {
    const account = await api.account(this.token, { id: this.id });
    this.name = account.name;
    this.color = account.color;
    this.kind = account.kind;
    this.currency = account.currency.name;
    this.balance = account.balance;
    this.isLoadingAccount = false;
  },
  methods: {
    ...call([
      'transactions/fetch'
    ]),
    onEdit() {
      this.$router.push({
        name: 'edit_account',
        params: { id: this.id },
        query: { backTo: this.backPath }
      });
    },
    onTransactionDestroy() {
      api.account(this.token, { id: this.id }).then(account => {
        if (account != null && account.balance != null) {
          this.balance = account.balance;
        }
      });
    },
    onTransactionLoaded() {
      this.isLoadingTransactions = false;
    }
  }
};
</script>

<style scoped lang='sass'>
/deep/ h3
  position: relative


/deep/ .cover
  min-height: 220px

.name-with-operations
  display: flex

  .name
    @media only screen and (max-width: 601px)
      max-width: 310px
      overflow: hidden
      text-overflow: ellipsis
      white-space: nowrap
    @media only screen and (max-width: 321px)
      max-width: 270px

.balance
  font-size: 40px

a.edit
  position: absolute
  right: 0
  top: 0

.transactions
  padding-top: 8px
</style>
