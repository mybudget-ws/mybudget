<template>
  <div>
    <Menu />
    <div class='container'>
      <PageHeader name='Операции' />
      <p v-if='isLoading'>Загрузка...</p>
      <div>TODO</div>
    </div>
  </div>
</template>

<script>
import Menu from '@/components/menu';
import PageHeader from '@/components/page_header';

export default {
  name: 'Transactions',
  components: {
    Menu,
    PageHeader
  },
  props: {},
  async created() {
    // TODO: Load accounts, if accounts is zero then show wizard
    //       to create the first.
  }
};
</script>

<style scoped lang='sass'>
</style>
