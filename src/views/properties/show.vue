<template>
  <div>
    <Menu />
    <div class='container container-wide'>
      <Loader v-if='isLoading' />

      <PageHeader v-if='!isLoading' :name='name' />

      {{ $route.params.id }}
    </div>
  </div>
</template>

<script>
import Menu from '@/components/menu';
import Loader from '@/components/loader';

export default {
  components: {
    Menu,
    Loader
  },
  data: () => ({
    isLoading: true,
    name: null
  })
};
</script>

<style scoped lang='sass'>
</style>
