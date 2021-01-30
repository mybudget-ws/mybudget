<template>
  <div>
    <Menu />
    <div class='container container-wide'>
      <PageHeader name='Отчеты'>
        <div class='row' :class="{ 'right': !isPhone }">
          <div class='col'>
            <select
              ref='selectMode'
              v-model='selectedMode'
              :class="{ 'browser-default': isPhone }"
              @change='onChangeMode'
            >
              <option v-for='(mode, index) in modes' :key='index' :value='mode'>
                {{ displayMode(mode) }}
              </option>
            </select>
          </div>
          <div class='col'>
            <select
              ref='selectPeriods'
              v-model='selectedPeriodMonths'
              :class="{ 'browser-default': isPhone }"
              @change='onChangePeriod'
            >
              <option v-for='v in periods' :key='v.months' :value='v.months'>
                {{ v.name }}
              </option>
            </select>
          </div>
        </div>
      </PageHeader>

      <div class='row'>
        <FilterTags class='col s12' @onChange='onChangeFilter' />

        <div class='col s12'>
          <Loader v-if='isLoading' />
          <div class='col l10 m9 s12'>
            <div v-if='selectedMode != "donuts"' class='chart' />
            <div v-else>
              <div
                v-for='id in donutsArray'
                :key='id'
                :class='`chart-${id}`'
              />
            </div>

            <div v-if='isShowSummary && isPhone'>
              <div v-for='(row, index) in summary' :key='index' class='card blue-grey lighten-5 z-depth-0'>
                <div class='card-content'>
                  <div class='card-title'>{{ row.name }}</div>
                  <div>
                    Начало периода
                    <Amount :value='row.startBalance' :currency='row.currency' class='amount' />
                  </div>
                  <div>
                    Изменение
                    <Amount :value='row.endBalance - row.startBalance' :currency='row.currency' class='amount' />
                  </div>
                  <hr>
                  <div>
                    <b>Итого</b>
                    <Amount :value='row.endBalance' :currency='row.currency' class='amount' />
                  </div>
                </div>
              </div>
            </div>
            <table v-if='isShowSummary && !isPhone'>
              <thead>
                <tr>
                  <th class='min' />
                  <th>Начало периода</th>
                  <th>Изменение</th>
                  <th>Итого</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for='(row, index) in summary' :key='index' :class='row.class'>
                  <td class='min'>
                    <strong>{{ row.name }}</strong>
                  </td>
                  <td>
                    <Amount :value='row.startBalance' :currency='row.currency' />
                  </td>
                  <td>
                    <Amount :value='row.endBalance - row.startBalance' :currency='row.currency' />
                  </td>
                  <td>
                    <Amount :value='row.endBalance' :currency='row.currency' />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <Filters
            v-if='!isLoading'
            class='col l2 m3 s12'
            @onChange='onChangeFilter'
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Amount from '@/components/amount';
import FilterTags from '@/components/filter_tags';
import Filters from '@/components/filters';
import Loader from '@/components/loader';
import Menu from '@/components/menu';
import Money from '@/utils/money';
import PageHeader from '@/components/page_header';
import api from '../../api';
import { get, call } from 'vuex-pathify';

import c3 from 'c3';
import MobileDetect from 'mobile-detect';
const md = new MobileDetect(window.navigator.userAgent);

// import MobileDetect from 'mobile-detect';
// const md = new MobileDetect(window.navigator.userAgent);

export default {
  name: 'Reports',
  components: {
    Amount,
    FilterTags,
    Filters,
    Loader,
    Menu,
    PageHeader
  },
  props: {},
  data: () => ({
    selectedMode: 'balance',
    // selectedMode: 'columns',
    // selectedMode: 'donuts',
    selectedPeriodMonths: 12, // All time: 9999,
    isLoading: true,
    summary: [],
    modes: ['balance', 'columns', 'donuts'],
    periods: [
      { name: 'Все время', months: 9999 },
      { name: 'Месяц', months: 1 },
      { name: 'Полгода', months: 6 },
      { name: 'Год', months: 12 },
      { name: 'Два года', months: 24 },
      { name: 'Пять лет', months: 60 },
      { name: 'Десять лет', months: 120 }
    ],
    donutsCount: 0,

    isPhone: md.phone() != null
  }),
  computed: {
    token: get('user/token'),
    searchParams: get('filters/searchParams'),
    isShowSummary() {
      return this.selectedMode === 'balance' && this.summary.length > 0;
    },
    donutsArray() {
      return [...Array(this.donutsCount).keys()];
    }
  },
  async mounted() {
    this.isLoading = true;
    await this.fetchData();
    this.isLoading = false;

    this.$nextTick(() => {
      /* eslint-disable */
      M.FormSelect.init(this.$refs.selectPeriods, {});
      M.FormSelect.init(this.$refs.selectMode, {});
      M.updateTextFields();
      /* eslint-enable */
    });
  },
  methods: {
    ...call(['user/fetchProfile']),
    setPeriod: call('filters/setPeriod'),
    async fetchData() {
      if (this.selectedMode === 'balance') {
        return this.fetchBalance();
      }
      if (this.selectedMode === 'columns') {
        return this.fetchColumns();
      }
      return this.fetchDonuts();
    },
    async fetchBalance() {
      const { columns, currencies } = await api.balances(this.token, this.searchParams);
      this.fillSummary(columns, currencies);
      this.chart = c3.generate({
        bindto: '.chart',
        data: {
          x: 'x',
          columns: columns
        },
        axis: {
          x: {
            type: 'timeseries',
            tick: { format: '%d.%m.%Y', count: 14 },
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
    },
    async fetchColumns() {
      const columns = await api.columns(this.token, this.searchParams);
      this.chart = c3.generate({
        bindto: '.chart',
        data: {
          x: 'x',
          columns: columns,
          type: 'bar'
        },
        bar: { width: { ratio: 0.8 } },
        axis: {
          x: {
            type: 'category',
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
    },
    async fetchDonuts() {
      this.donutsCount = 0;
      const donuts = await api.donuts(this.token, this.searchParams);
      this.donutsCount = donuts.length;
      await this.$nextTick();

      donuts.forEach((json, index) => {
        c3.generate({
          bindto: `.chart-${index}`,
          data: {
            columns: json['data'],
            type: 'donut'
          },
          donut: {
            title: json['title'],
            width: 68,
            label: {
              format: function(value) {
                const digits = (value > 1000 || (value | 0) == value) ? 0 : 2;
                return Money.format(Math.abs(value), digits);
              }
            }
          }
        });
      });
    },
    fillSummary(columns, currencies) {
      this.summary = columns.slice(1).map(v => ({
        name: v[0],
        currency: v[0],
        startBalance: parseFloat(v[1]),
        endBalance: parseFloat(v[v.length - 1]),
        startBalanceInDefaultCurrency: parseFloat(v[1]) * currencies[v[0]].rate,
        endBalanceInDefaultCurrency: parseFloat(v[v.length - 1]) * currencies[v[0]].rate
      }));
      if (this.summary.length > 1) {
        this.summary.push(
          {
            class: 'total',
            name: `Всего, ${currencies['default']}`,
            currency: currencies['default'],
            startBalance: this.summary.reduce((a, b) => (
              a.startBalanceInDefaultCurrency + b.startBalanceInDefaultCurrency
            )),
            endBalance: this.summary.reduce((a, b) => (
              a.endBalanceInDefaultCurrency + b.endBalanceInDefaultCurrency
            ))
          }
        );
      }
    },
    displayMode(mode) {
      if (mode === 'balance') { return 'Баланс'; }
      if (mode === 'columns') { return 'Доходы и расходы'; }
      return 'Категории';
    },
    onChangeFilter() {
      this.fetchData();
    },
    onChangeMode({ target }) {
      this.selectedMode = target.value;
      this.fetchData();
    },
    async onChangePeriod() {
      this.setPeriod({ period: this.selectedPeriodMonths });
      this.isLoading = true;
      await this.fetchData();
      this.isLoading = false;
    }
  }
};
</script>

<style scoped lang='sass'>
.chart
  height: 540px
  margin-top: 10px
  margin-left: -20px

  @media only screen and (max-width: 601px)
    margin-top: 0px
    height: 320px

th, td
  text-align: right
  width: 30%

  &.min
    width: 16%
    text-align: left

tbody
  tr.total
    background-color: #fafafa

    td
      &:first-child
        &:after
          color: #757575
          content: '(по текущему курсу)'
          font-size: 13px
          display: block
          font-weight: 200

.card
  .amount
    float: right
</style>
