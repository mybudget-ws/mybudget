<template>
  <div>
    <Menu />
    <div class='container container-wide'>
      <PageHeader
        v-if='!isLoadingAccount'
        :name='name'
        :cover=coverClasses
        class='header'
      >
        <Amount :value='balance' :currency='currency' class='balance' />
        <a
          class='edit waves-effect waves-teal btn-flat'
          title='Редактировать'
          @click='onEdit(item)'
        >
          <i class='material-icons grey-text'>edit</i>
        </a>
      </PageHeader>

      <Loader v-if='isLoadingAccount' />
    </div>
  </div>
</template>

<script>
import Amount from '@/components/amount';
import Loader from '@/components/loader';
import Menu from '@/components/menu';
import PageHeader from '@/components/page_header';
import api from '@/api';
import { get, call } from 'vuex-pathify';

import MobileDetect from 'mobile-detect';
const md = new MobileDetect(window.navigator.userAgent);

export default {
  name: 'ShowAccount',
  components: {
    Amount,
    Loader,
    Menu,
    PageHeader
  },
  props: {
    // initName: { type: String, required: false, default: '' },
    // initColor: { type: String, required: false, default: '' }
  },
  data: () => ({
    name: '',
    color: '',
    kind: '',
    currency: '',
    balance: 0,

    isLoadingAccount: true,
    isPhone: md.phone() != null
  }),
  computed: {
    token: get('user/token'),
    kinds: get('accounts/kinds'),
    ...get('transactions/*'),
    id() { return this.$route.params.id; },
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
    this.fetch({ token: this.token, filters: { accountIds: [parseInt(this.id)] } });
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
    }
    // fetchCurrencies: call('currencies/fetch'),
    // fetchColors: call('colors/fetch'),
    // async submit() {
    //   if (this.isSubmitting) { return; }
    //   const { id, name, color, kind, currency } = this;
    //   const isSuccess = await api.updateAccount(
    //     this.token,
    //     { id, name, color, kind, currency }
    //   );
    //   if (isSuccess != null) {
    //     this.$router.push({ name: 'accounts' }).catch(_e => {});
    //   } else {
    //     alert('Error');
    //   }
    // }
  }
};
</script>

<style scoped lang='sass'>
/deep/ h3
  position: relative

/deep/ .cover
  min-height: 230px

.balance
  margin-top: 10px

a.edit
  position: absolute
  right: 0
  top: 0
</style>
