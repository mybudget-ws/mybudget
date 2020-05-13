<template>
  <div>
    <Menu />
    <div class='container'>
      <PageHeader name='Отчеты' />

      <div class='row'>
        <FilterTags class='col s12' @onChange='onChangeFilter' />

        <div class='col s12'>
          <Loader v-if='isLoading' />
          <div class='col l9 s12'>
            <div class='chart' />
          </div>

          <Filters
            v-if='!isLoading'
            class='col l3 s12'
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

import { get } from 'vuex-pathify';
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
    isLoading: true
  }),
  computed: {
    token: get('user/token'),
    searchParams: get('filters/searchParams')
  },
  async mounted() {
    this.isLoading = true;
    await this.fetchData();
    this.isLoading = false;
  },
  methods: {
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
              count: 30
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
