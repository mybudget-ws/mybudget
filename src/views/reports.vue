<template>
  <div>
    <Menu />
    <div class='container'>
      <PageHeader name='Отчеты' />
      <p v-if='isLoading'>Загрузка...</p>
      <div>TODO</div>
    </div>
  </div>
</template>

<script>
import Menu from '@/components/menu';
import PageHeader from '@/components/page_header';

export default {
  name: 'Reports',
  components: {
    Menu,
    PageHeader
  },
  props: {}
};
</script>

<style scoped lang='sass'>
</style>
