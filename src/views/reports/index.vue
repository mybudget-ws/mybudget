<template>
  <div>
    <Menu />
    <div class='container'>
      <PageHeader name='Отчеты' />

      <div class='row'>
        <FilterTags class='col s12' @onChange='onChangeFilter' />

        <div class='col s12'>
          <Loader v-if='isLoading' />
          <div class='col s9'>
            <div class='chart' />
          </div>

          <Filters
            v-if='!isLoading'
            class='col s3'
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
  }),
  computed: {
    token: get('user/token'),
    isLoading() {
      return false;
    }
  },
  async mounted() {
    const columns = await api.balances(this.token);
    this.chart = c3.generate({
      bindto: '.chart',
      data: {
        x: 'x',
        columns: columns
      },
      axis: {
        x: {
          type: 'timeseries',
          tick: { format: '%Y-%m-%d' },
          padding: { left: 0, right: 0 }
        },
        y: {
          min: 0,
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
  methods: {
    onChangeFilter() {
      alert('filter');
    }
  }
};
</script>

<style scoped lang='sass'>
</style>
