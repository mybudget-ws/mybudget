<template>
  <div>
    <Menu />
    <div class='container'>
      <PageHeader name='Отчеты' />
      <Loader v-if='isLoading' />
      <div>TODO</div>
    </div>
  </div>
</template>

<script>
import Menu from '@/components/menu';
import Loader from '@/components/loader';
import PageHeader from '@/components/page_header';

export default {
  name: 'Reports',
  components: {
    Menu,
    Loader,
    PageHeader
  },
  props: {}
};
</script>

<style scoped lang='sass'>
</style>
