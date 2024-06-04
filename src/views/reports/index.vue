<template>
  <div>
    <Menu />
    <div class='container container-wide'>
      <PageHeader name='Отчеты'>
        <div class='select-mode'>
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
          <div v-show='isCustomPeriod' class='custom-period'>
            <input
              id='dateStart'
              ref='datepickerStart'
              type='text'
              class='datepicker'
            >
            <input
              id='dateEnd'
              ref='datepickerEnd'
              type='text'
              class='datepicker'
            >
          </div>
        </div>
      </PageHeader>

      <div class='row'>
        <div class='col s12 chart-description' v-html='displayInterval' />

        <FilterTags class='col s12' @onChange='onChangeFilter' />

        <div class='col s12'>
          <Loader v-if='isLoading' is-fixed />
          <div class='col l10 m9 s12'>
            <div v-if='selectedMode != "donuts"' class='chart' />
            <div v-else>
              <div v-for='id in donutsArray' :key='id'>
                <div :class='`chart-${id}`' />
                <CategoriesSummary v-bind='donuts[id]' />
              </div>
            </div>

            <BalanceSummary v-if='isShowBalanceSummary' :summary='balanceSummary' />

            <form v-if='isShowColumnsSummary' @submit.prevent='submit'>
              <div class='row'>
                <label class='col s12 right-align'>
                  <Checkbox :value='isNoTransfers' @change=onChangeNoTransfers />
                  <span>Без учета переводов</span>
                </label>
              </div>
            </form>
            <ColumnsSummary v-if='isShowColumnsSummary' :data='columnsSummary' />
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
import BalanceSummary from '@/components/reports/balance_summary';
import CategoriesSummary from '@/components/reports/categories_summary';
import Checkbox from '@/components/checkbox';
import ColumnsSummary from '@/components/reports/columns_summary';
import DateFormat from '@/utils/date_format';
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

const moment = require('moment');
moment.locale('ru');

export default {
  name: 'Reports',
  components: {
    BalanceSummary,
    CategoriesSummary,
    Checkbox,
    ColumnsSummary,
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
    dateStart: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    dateEnd: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    isLoading: true,
    isNoTransfers: true,
    balanceSummary: [],
    columnsSummary: [],
    modes: ['balance', 'columns', 'donuts'],
    periods: [
      { name: 'Месяц', months: 1 },
      { name: 'Полгода', months: 6 },
      { name: 'Год', months: 12 },
      { name: 'Два года', months: 24 },
      { name: 'Пять лет', months: 60 },
      { name: 'Десять лет', months: 120 },
      { name: 'Все время', months: 9999 },
      { name: 'Свой интервал', months: 0 }
    ],
    donuts: [],
    donutsCount: 0,

    isPhone: md.phone() != null,
    isSelectDateStartInit: false,
    isSelectDateEndInit: false
  }),
  computed: {
    token: get('user/token'),
    defaultReportMode: get('user/reportMode'),
    defaultReportPeriodMonths: get('user/reportPeriodMonths'),
    searchParams: get('filters/searchParams'),
    isCustomPeriod() { return this.selectedPeriodMonths === 0; },
    isShowBalanceSummary() {
      if (this.isLoading) { return false; }
      return this.selectedMode === 'balance' && this.balanceSummary.length > 0;
    },
    isShowColumnsSummary() { return !this.isLoading && this.selectedMode === 'columns'; },
    donutsArray() { return [...Array(this.donutsCount).keys()]; },
    chartTickCount() { return this.isPhone ? 8 : 14; },
    chartTickFormat() { return this.isPhone ? '%d.%m' : '%d.%m.%Y'; },
    displayInterval() {
      if (this.selectedPeriodMonths === 9999) {
        return 'За весь период';
      }
      return `${this.displayDateStart } &mdash; ${this.displayDateEnd}`;
    },
    displayDateStart() {
      if (this.isCustomPeriod) {
        return DateFormat.reportAdaptive(this.dateStart);
      }
      return DateFormat.reportAdaptiveMonthAgo(this.selectedPeriodMonths);
    },
    displayDateEnd() {
      if (this.isCustomPeriod) {
        return DateFormat.reportAdaptive(this.dateEnd);
      }
      return DateFormat.reportAdaptive();
    }
  },
  async mounted() {
    const mode = this.$route.params.mode || this.defaultReportMode;
    this.selectedMode = this.modes.find(v => v === mode) || this.selectedMode;
    this.selectedPeriodMonths = this.defaultReportPeriodMonths;
    await this.fetchData();

    this.initSelects();
    this.initDatepickers();
  },
  methods: {
    ...call([
      'user/fetchProfile',
      'user/updateReportMode',
      'user/updateReportPeriodMonths'
    ]),
    setPeriod: call('filters/setPeriod'),
    async fetchData() {
      this.isLoading = true;
      if (this.selectedMode === 'balance') {
        await this.fetchBalance();
      } else if (this.selectedMode === 'columns') {
        await this.fetchColumns();
      } else {
        await this.fetchDonuts();
      }
      this.isLoading = false;
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
            tick: { format: this.chartTickFormat, count: this.chartTickCount },
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
      const params = this.isNoTransfers ?
        (this.searchParams + '&wo_transfers=true') :
        this.searchParams;
      const columns = await api.columns(this.token, params);
      if (columns != null) { this.columnsSummary = columns; }
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
            tick: { culling: this.isPhone, multiline: false },
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
      this.donuts = [];
      this.donutsCount = 0;
      this.donuts = await api.donuts(this.token, this.searchParams);
      this.donutsCount = this.donuts.length;
      await this.$nextTick();

      this.donuts.forEach((json, index) => {
        c3.generate({
          bindto: `.chart-${index}`,
          data: {
            columns: json['data'],
            type: 'donut'
          },
          donut: {
            title: json['title'],
            width: 70,
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
      this.balanceSummary = columns.slice(1).map(v => ({
        name: v[0],
        currency: v[0],
        startBalance: parseFloat(v[1]),
        endBalance: parseFloat(v[v.length - 1]),
        startBalanceInDefaultCurrency: parseFloat(v[1]) * currencies[v[0]].rate,
        endBalanceInDefaultCurrency: parseFloat(v[v.length - 1]) * currencies[v[0]].rate
      }));

      if (this.balanceSummary.length > 1) {
        this.balanceSummary.push(
          {
            class: 'total',
            name: `Всего, ${currencies['default']}`,
            currency: currencies['default'],
            startBalance: this.balanceSummary
              .map(v => v.startBalanceInDefaultCurrency)
              .reduce((a, b) => a + b),
            endBalance: this.balanceSummary
              .map(v => v.endBalanceInDefaultCurrency)
              .reduce((a, b) => a + b)
          }
        );
      }
    },
    displayMode(mode) {
      if (mode === 'balance') { return 'Баланс'; }
      if (mode === 'columns') { return 'Доходы и расходы'; }
      return 'Категории';
    },
    initSelects() {
      this.$nextTick(() => {
        /* eslint-disable */
        M.FormSelect.init(this.$refs.selectPeriods, {});
        M.FormSelect.init(this.$refs.selectMode, {});
        M.updateTextFields();
        /* eslint-enable */
      });
    },
    initDatepickers() {
      this.$nextTick(() => {
        /* eslint-disable */
        M.Datepicker.init(
          this.$refs.datepickerStart,
          {
            ...DateFormat.datePickerInitData(this.dateStart),
            onSelect: this.onSelectDateStart
          }
        );
        M.Datepicker.getInstance(this.$refs.datepickerStart).setDate(this.dateStart);

        M.Datepicker.init(
          this.$refs.datepickerEnd,
          {
            ...DateFormat.datePickerInitData(this.dateEnd),
            onSelect: this.onSelectDateEnd
          }
        );
        M.Datepicker.getInstance(this.$refs.datepickerEnd).setDate(this.dateEnd);
        /* eslint-enable */
      });
    },
    async onChangeFilter() { await this.fetchData(); },
    async onChangeMode({ target }) {
      this.$router.push({ name: 'reports', params: { mode: target.value } });
      this.selectedMode = target.value;
      this.updateReportMode({ mode: this.selectedMode });
      await this.fetchData();
    },
    async onChangePeriod() {
      this.setPeriod({
        period: this.selectedPeriodMonths,
        dateStart: moment(this.dateStart).format(),
        dateEnd: moment(this.dateEnd).format()
      });
      this.updateReportPeriodMonths({ months: this.selectedPeriodMonths });
      await this.fetchData();
    },
    onSelectDateStart(date) {
      if (date == null) { return; }
      if (date == this.dateStart) { return; }
      if (this.isSelectDateStartInit == false) {
        this.isSelectDateStartInit = true;
        return;
      }

      this.dateStart = date;
      this.onChangePeriod();
    },
    onSelectDateEnd(date) {
      if (date == null) { return; }
      if (date == this.dateEnd) { return; }
      if (this.isSelectDateEndInit == false) {
        this.isSelectDateEndInit = true;
        return;
      }

      this.dateEnd = date;
      this.onChangePeriod();
    },
    onChangeNoTransfers(value) {
      this.isNoTransfers = value;
      this.fetchData();
    }
  }
};
</script>

<style scoped lang='sass'>
/deep/
  .page-header
    h3
      justify-content: space-between

      @media only screen and (max-width: 601px)
        align-items: flex-start
        flex-direction: column

  .select-mode
    display: flex
    align-items: center
    justify-content: flex-end

    @media only screen and (max-width: 601px)
      margin-top: 10px
      flex-direction: column
      width: 100%

    select + select,
    .select-wrapper + .select-wrapper
      margin-left: 10px

      @media only screen and (max-width: 601px)
        margin-top: 4px
        margin-left: 0

  .custom-period
    display: flex
    align-items: center

    input.datepicker
      margin-left: 10px

      @media only screen and (max-width: 601px)
        margin-left: 0

  .select-wrapper
    input.select-dropdown
      margin-bottom: 0px

.chart-description
  margin-top: -14px
  margin-bottom: 8px
  color: #9e9e9e
  font-size: 1rem

.chart
  height: 540px
  margin-top: 10px
  margin-left: -30px

  @media only screen and (max-width: 601px)
    margin-top: 0px
    height: 320px
</style>
