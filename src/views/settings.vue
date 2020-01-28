<template>
  <div>
    <Menu />
    <div class='container'>
      <PageHeader name='Настройки' />

      <Loader v-if='isLoading' />
      <div>TODO</div>
    </div>
  </div>
</template>

<script>
import Menu from '@/components/menu';
import Loader from '@/components/Loader';
import PageHeader from '@/components/page_header';

export default {
  name: 'Settings',
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
