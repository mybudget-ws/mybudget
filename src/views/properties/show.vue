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
        <div class='col s12'>
          <div class='chart' />
        </div>
      </div>

      <div v-if='!isLoading && (totalIncome !== 0 || totalExpense !== 0)' class='row'>
        <div class='col s12'>
          <table>
            <thead>
              <tr>
                <th>Всего</th>
                <th />
              </tr>
            </thead>
            <tbody>
              <tr v-if='totalIncome !== 0'>
                <td>Доходы</td>
                <td>
                  <Amount :value='totalIncome' :currency='currency' class='amount' />
                </td>
              </tr>
              <tr v-if='totalExpense !== 0'>
                <td>Расходы</td>
                <td>
                  <Amount :value='totalExpense' :currency='currency' class='amount' />
                </td>
              </tr>
            </tbody>
          </table>
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
          <PriceList
            :items='visiblePrices'
            @onDestroy='onDestroyPrice'
          />
        </div>
      </div>
      <div v-if='!isLoading && isMorePrices' class='row'>
        <div class='col s12'>
          <a
            v-if='true'
            class='btn btn-flat w-100'
            @click='morePrices'
          >
            Вся история...
          </a>
        </div>
      </div>

      <div v-if='!isLoading' class='row'>
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
            v-if='transactions.length > 0'
            :items='transactions'
            :back-path='backPath'
            @onDestroy='onDestroyTransaction'
          />
          <p v-else class='grey-text text-darken-1'>
            Нет операций связанных с данным имуществом
          </p>
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
import api from '../../api';

import { get, call } from 'vuex-pathify';
import c3 from 'c3';
import MobileDetect from 'mobile-detect';
const md = new MobileDetect(window.navigator.userAgent);
const DEFAULT_PRICES_LENGTH = 3;

export default {
  components: {
    Amount,
    Loader,
    Menu,
    PageHeader,
    PriceList,
    TransactionList
  },
  data: () => ({
    isPhone: md.phone() != null,
    isDestroying: false,
    isShowAllPrices: false
  }),
  computed: {
    token: get('user/token'),
    ...get('property/*'),
    id() { return this.$route.params.id; },
    backPath() { return `/properties/${this.id}`; },
    newTransactionUrl() {
      return `/transactions/new?property=${this.id}&backTo=${this.backPath}`;
    },
    chartTickCount() {
      return this.isPhone ? 4 : 14;
    },
    visiblePrices() {
      if (this.isShowAllPrices) return this.prices;
      return this.prices.slice(0, DEFAULT_PRICES_LENGTH);
    },
    isMorePrices() { return this.prices.length > this.visiblePrices.length; }
  },
  created() {
    this.fetch({ token: this.token, id: this.id });
  },
  async mounted() {
    const { columns } = await api.propertyPricesChart(this.token, this.id);
    this.chart = c3.generate({
      bindto: '.chart',
      data: {
        x: 'x',
        columns: columns
      },
      axis: {
        x: {
          type: 'timeseries',
          tick: { format: '%d.%m.%Y', count: this.chartTickCount },
          padding: { left: 0, right: 0 }
        },
        y: {
          padding: { top: 20 }
        }
      },
      point: { show: false },
      grid: {
        x: { show: true },
        y: { show: true }
      },
      legend: { show: false }
    });
  },
  methods: {
    ...call('property/*'),
    async onDestroyTransaction({ id }) {
      if (this.isDestroying) { return; }
      this.isDestroying = true;

      if (confirm('Удалить операцию. Вы уверены?')) {
        await this.destroyTransaction({ token: this.token, id });
        this.isDestroying = false;
        this.fetch({ token: this.token, id: this.id });
      }
    },
    async onDestroyPrice(id) {
      if (this.isDestroying) { return; }
      this.isDestroying = true;

      if (confirm('Удалить цену. Вы уверены?')) {
        await this.destroyPropertyPrice({
          token: this.token,
          propertyId: this.id,
          id
        });
        this.isDestroying = false;
        this.fetch({ token: this.token, id: this.id });
      }
    },
    morePrices() {
      this.isShowAllPrices = true;
    }
  }
};
</script>

<style scoped lang='sass'>
h5
  @media only screen and (min-width: 600px)
    margin-bottom: 0

.balance
  font-weight: 500
  font-size: 36px

.btn-floating.yellow
  margin-left: 10px

.chart
  height: 300px
  margin-left: -20px

  @media only screen and (max-width: 601px)
    height: 220px

.amount
  text-align: right
</style>
