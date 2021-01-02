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
              <option v-for='(mode, index) in ["balance", "columns"]' :key='index' :value='mode'>
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
            <div class='chart' />

            <div v-if='isShowSummary && isPhone'>
              <div v-for='(row, index) in summary' :key='index' class='card blue-grey lighten-5 z-depth-0'>
                <div class='card-content'>
                  <div class='card-title'>{{ row.currency }}</div>
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
                <tr v-for='(row, index) in summary' :key='index'>
                  <td class='min'>
                    <strong>{{ row.currency }}</strong>
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
    selectedPeriodMonths: 12, // All time: 9999,
    isLoading: true,
    summary: [],
    periods: [
      { name: 'Все время', months: 9999 },
      { name: 'Месяц', months: 1 },
      { name: 'Полгода', months: 6 },
      { name: 'Год', months: 12 },
      { name: 'Два года', months: 24 },
      { name: 'Пять лет', months: 60 },
      { name: 'Десять лет', months: 120 }
    ],

    isPhone: md.phone() != null
  }),
  computed: {
    token: get('user/token'),
    searchParams: get('filters/searchParams'),
    isShowSummary() {
      return this.selectedMode === 'balance' && this.summary.length > 0;
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
    setPeriod: call('filters/setPeriod'),
    async fetchData() {
      if (this.selectedMode === 'balance') {
        this.fetchBalance();
      } else {
        this.fetchColumns();
      }
    },
    async fetchBalance() {
      const columns = await api.balances(this.token, this.searchParams);
      this.fillSummary(columns);
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
    fillSummary(columns) {
      this.summary = columns.slice(1).map(v => ({
        currency: v[0],
        startBalance: parseFloat(v[1]),
        endBalance: parseFloat(v[v.length - 1])
      }));
    },
    displayMode(mode) {
      if (mode === 'balance') { return 'Баланс'; }
      return 'Доход / Расход';
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
    width: 10%
    text-align: left

.card
  .amount
    //display: inline-block
    float: right
</style>
