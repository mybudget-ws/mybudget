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
            TODO: Reports
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
  computed: {
    isLoading() {
      return false;
    }
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
