<template>
  <div class='main-background'>
    <Menu />
    <div class='container container-wide'>
      <PageHeader name='Курсы валют'>
        <div v-if='!isLoading' class='currencies right'>
          <select ref='selectCurrencies' v-model='currency' @change='change'>
            <option v-for='curr in items' :key='curr.id' :value='curr.name'>
              {{ curr.name }}
            </option>
          </select>
        </div>
      </PageHeader>
      <div class='row'>
        <div class='col s12'>
          <div class='chart' />
        </div>
      </div>
      <div class='row'>
        <div class='col s12'>
          <Loader v-if='isLoading' />
          <table v-else>
            <thead>
              <tr>
                <th class='name'>Название</th>
                <th class='usd right'>Курс, {{ defaultCurrency || 'RUB' }}</th>
                <th>Описание</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for='curr in displayedItems' :key='curr.id'>
                <td class='name'>{{ curr.name }}</td>
                <td class='usd right'>{{ curr.baseRate.toFixed(6) }}</td>
                <td>
                  <span class='grey-text darken-1'>{{ curr.description }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Menu from '@/components/menu';
import Loader from '@/components/loader';
import PageHeader from '@/components/page_header';
import api from '../../api';
import { get, call, sync } from 'vuex-pathify';
import c3 from 'c3';

export default {
  name: 'Currencies',
  components: {
    Menu,
    Loader,
    PageHeader
  },
  props: {},
  computed: {
    ...get('currencies/*'),
    currency: sync('currencies/selected'),
    isSignedIn: get('user/isSignedIn'),
    defaultCurrency: get('user/defaultCurrency')
  },
  async mounted() {
    if (this.isSignedIn) {
      await this.fetchProfile();
    }
    await this.fetch({ base: this.defaultCurrency });
    /* eslint-disable */
    this.selectCurrencies = M.FormSelect.init(this.$refs.selectCurrencies, {});
    M.updateTextFields();
    /* eslint-enable */
    this.loadChart();
  },
  methods: {
    ...call([
      'currencies/fetch',
      'user/fetchProfile'
    ]),
    change() {
      this.loadChart();
    },
    async loadChart() {
      const columns = await api.currenciesChart(this.currency, this.defaultCurrency);
      this.chart = c3.generate({
        bindto: '.chart',
        data: {
          x: 'x',
          columns: columns
        },
        axis: {
          x: {
            type: 'timeseries',
            tick: {
              format: '%d.%m.%Y',
              count: 14
            },
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
        }
      });
    }
  }
};
</script>

<style scoped lang='sass'>
.currencies
  max-width: 110px
  margin-top: 0px

.name
  width: 80px

.usd
  padding-right: 20px

.chart
  height: 300px
  margin-left: -20px

.container
  background-color: #fff
  margin-top: 10px
  border-radius: 20px

  @media only screen and (min-width: 601px)
    padding: 0 30px
    margin-top: 20px


@media only screen and (max-width: 601px)
  .main-background
    &:before
      background-image: url('../../assets/home-background.svg')
      background-repeat: no-repeat
      position: absolute
      width: 100%
      height: 100%
      content: ''
      background-size: cover
      z-index: -1

@media only screen and (min-width: 601px)
  .main-background
    background-image: url('../../assets/home-background.svg')
    background-repeat: no-repeat
    width: 100%
    height: 100%
    background-size: 100%
</style>
