<template>
  <div>
    <Menu />
    <div class='container container-wide'>
      <Loader v-if='isLoading' />

      <PageHeader v-if='!isLoading' :name='name'>
        <template v-slot:subtitle>
          <div class='col grey-text text-darken-1'>
            {{ kindText }}
          </div>
          <div class='col s12'>
            <Amount :value='amount' :currency='currency' class='balance' />
          </div>
        </template>
      </PageHeader>

      <div class='row'>
        <div class='col'>
          <span class='blue-grey-text'>График изменения цены (скоро)</span>
        </div>
      </div>

      <div v-if='!isLoading' class='row'>
        <h5 class='col s12'>
          История изменения цены
          <router-link
            :to="`/properties/${id}/prices/new`"
            class='btn-floating waves-effect waves-light yellow z-depth-0'
          >
            <i class='material-icons grey-text text-darken-4'>add</i>
          </router-link>
        </h5>
        <div class='col s12'>
          <PriceList :items='prices' />
        </div>
      </div>

      <div v-if='isTransactionVisible' class='row'>
        <h5 class='col s12'>
          Операции
          <router-link
            :to='newTransactionUrl'
            class='btn-floating waves-effect waves-light yellow z-depth-0'
          >
            <i class='material-icons grey-text text-darken-4'>add</i>
          </router-link>
        </h5>
        <div class='col s12'>
          <TransactionList
            :items='transactions'
            :back-path='backPath'
            @onDestroy='onDestroy'
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Amount from '@/components/amount';
import Loader from '@/components/loader';
import Menu from '@/components/menu';
import PageHeader from '@/components/page_header';
import PriceList from '@/components/properties/price_list';
import TransactionList from '@/components/transactions/list';
import { get, call } from 'vuex-pathify';

export default {
  components: {
    Amount,
    Loader,
    Menu,
    PageHeader,
    PriceList,
    TransactionList
  },
  data: () => ({}),
  computed: {
    token: get('user/token'),
    ...get('property/*'),
    id() { return this.$route.params.id; },
    backPath() { return `/properties/${this.id}`; },
    isTransactionVisible() {
      return !this.isLoading && this.transactions.length > 0;
    },
    newTransactionUrl() {
      return `/transactions/new?property=${this.id}&backTo=${this.backPath}`;
    }
  },
  created() {
    this.fetch({ token: this.token, id: this.id });
  },
  methods: {
    ...call('property/*'),
    async onDestroy({ id }) {
      if (this.isDestroying) { return; }
      if (confirm('Удалить операцию. Вы уверены?')) {
        await this.destroyTransaction({ token: this.token, id });
      }
      this.fetch({ token: this.token, id: this.id });
    }
  }
};
</script>

<style scoped lang='sass'>
h5
  margin-bottom: 0

.balance
  font-weight: 500
  font-size: 36px

.btn-floating.yellow
  margin-left: 10px
</style>