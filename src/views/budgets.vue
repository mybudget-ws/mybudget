<template>
  <div>
    <Menu />
    <div class='container'>
      <PageHeader name='Бюджеты' action='/accounts/new' />
      <Loader v-if='isLoading' />
      <div class='row'>
        <div class='col'>
          TODO: Budgets
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Menu from '@/components/menu';
import Loader from '@/components/loader';
import PageHeader from '@/components/page_header';

export default {
  name: 'Budgets',
  components: {
    Menu,
    Loader,
    PageHeader
  },
  props: {},
  computed: {
    isLoading() { return false; }
  }
};
</script>

<style scoped lang='sass'>
</style>
