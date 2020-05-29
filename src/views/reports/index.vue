<template>
  <div>
    <Menu />
    <div class='container container-wide'>
      <PageHeader name='Отчеты'>
        <div class='right'>
          <select ref='selectPeriods' v-model='selectedPeriodMonths' @change='onChangePeriod'>
            <option v-for='v in periods' :key='v.months' :value='v.months'>
              {{ v.name }}
            </option>
          </select>
        </div>
      </PageHeader>

      <div class='row'>
        <FilterTags class='col s12' @onChange='onChangeFilter' />

        <div class='col s12'>
          <Loader v-if='isLoading' />
          <div class='col l10 m9 s12'>
            <div class='chart' />
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
import FilterTags from '@/components/filter_tags';
import Filters from '@/components/filters';
import Loader from '@/components/loader';
import Menu from '@/components/menu';
import PageHeader from '@/components/page_header';
import api from '../../api';

import { get, call } from 'vuex-pathify';
import c3 from 'c3';

export default {
  name: 'Reports',
  components: {
    FilterTags,
    Filters,
    Loader,
    Menu,
    PageHeader
  },
  props: {},
  data: () => ({
    selectedPeriodMonths: 12, // All time: 9999,
    isLoading: true,
    periods: [
      { name: 'Все время', months: 9999 },
      { name: 'Десять лет', months: 120 },
      { name: 'Пять лет', months: 60 },
      { name: 'Два года', months: 24 },
      { name: 'Год', months: 12 },
      { name: 'Полгода', months: 6 },
      { name: 'Квартал', months: 3 },
      { name: 'Месяц', months: 1 }
    ]
  }),
  computed: {
    token: get('user/token'),
    searchParams: get('filters/searchParams')
  },
  async mounted() {
    this.isLoading = true;
    await this.fetchData();
    this.isLoading = false;

    setTimeout(() => {
      /* eslint-disable */
      M.FormSelect.init(this.$refs.selectPeriods, {});
      M.updateTextFields();
      /* eslint-enable */
    }, 50);
  },
  methods: {
    setPeriod: call('filters/setPeriod'),
    async fetchData() {
      const columns = await api.balances(this.token, this.searchParams);
      this.chart = c3.generate({
        bindto: '.chart',
        data: { x: 'x', columns: columns },
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
    },
    onChangeFilter() {
      this.fetchData();
    },
    async onChangePeriod() {
      this.setPeriod({ period: this.selectedPeriodMonths });
      // this.isLoading = true;
      await this.fetchData();
      // this.isLoading = false;
    }
  }
};
</script>

<style scoped lang='sass'>
.chart
  height: 400px
  margin-top: 10px
  margin-left: -20px
</style>
