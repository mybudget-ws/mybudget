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
import ColumnsSummary from '@/components/reports/columns_summary';
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
    balanceSummary: [],
    columnsSummary: [],
    modes: ['balance', 'columns', 'donuts'],
    periods: [
      { name: 'Все время', months: 9999 },
      { name: 'Месяц', months: 1 },
      { name: 'Полгода', months: 6 },
      { name: 'Год', months: 12 },
      { name: 'Два года', months: 24 },
      { name: 'Пять лет', months: 60 },
      { name: 'Десять лет', months: 120 },
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
    chartTickFormat() { return this.isPhone ? '%d.%m' : '%d.%m.%Y'; }
  },
  async mounted() {
    const mode = this.$route.params.mode || this.defaultReportMode;
    this.selectedMode = this.modes.find(v => v === mode) || this.selectedMode;
    this.selectedPeriodMonths = this.defaultReportPeriodMonths;
    this.isLoading = true;
    await this.fetchData();
    this.isLoading = false;

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
      const columns = await api.columns(this.token, this.searchParams);
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
            format: 'dd mmm, yyyy',
            firstDay: 1,
            autoClose: true,
            setDefaultDate: true,
            defaultDate: this.dateStart,
            i18n: {
              cancel: 'Закрыть',
              months: [
                'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль',
                'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
              monthsShort: [
                'янв.', 'февр.', 'мар.', 'апр.', 'мая', 'июня', 'июля',
                'авг.', 'сент.', 'окт.', 'нояб.', 'дек.'
              ],
              weekdaysShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
              weekdaysAbbrev: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
            },
            onSelect: this.onSelectDateStart
          }
        );
        M.Datepicker.getInstance(this.$refs.datepickerStart).setDate(this.dateStart);
        /* eslint-enable */

        /* eslint-disable */
        M.Datepicker.init(
          this.$refs.datepickerEnd,
          {
            format: 'dd mmm, yyyy',
            firstDay: 1,
            autoClose: true,
            setDefaultDate: true,
            defaultDate: this.dateEnd,
            i18n: {
              cancel: 'Закрыть',
              months: [
                'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль',
                'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
              monthsShort: [
                'янв.', 'февр.', 'мар.', 'апр.', 'мая', 'июня', 'июля',
                'авг.', 'сент.', 'окт.', 'нояб.', 'дек.'
              ],
              weekdaysShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
              weekdaysAbbrev: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
            },
            onSelect: this.onSelectDateEnd
          }
        );
        M.Datepicker.getInstance(this.$refs.datepickerEnd).setDate(this.dateEnd);
        /* eslint-enable */
      });
    },
    async onChangeFilter() {
      this.isLoading = true;
      await this.fetchData();
      this.isLoading = false;
    },
    async onChangeMode({ target }) {
      this.$router.push({ name: 'reports', params: { mode: target.value } });
      this.selectedMode = target.value;
      this.updateReportMode({ mode: this.selectedMode });
      this.isLoading = true;
      await this.fetchData();
      this.isLoading = false;
    },
    async onChangePeriod() {
      this.setPeriod({
        period: this.selectedPeriodMonths,
        dateStart: moment(this.dateStart).format(),
        dateEnd: moment(this.dateEnd).format()
      });
      this.updateReportPeriodMonths({ months: this.selectedPeriodMonths });
      this.isLoading = true;
      await this.fetchData();
      this.isLoading = false;
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

.chart
  height: 540px
  margin-top: 10px
  margin-left: -20px

  @media only screen and (max-width: 601px)
    margin-top: 0px
    height: 320px
</style>
