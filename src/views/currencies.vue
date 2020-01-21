<template>
  <div>
    <Menu />
    <div class='container'>
      <h3>Курсы валют</h3>
      <p>...</p>
    </div>
  </div>
</template>

<script>
// import Api from '../api';
import Menu from '@/components/menu';

export default {
  name: 'Currencies',
  components: {
    Menu
  },
  props: {},
  methods: {
    async create() {
      // await Api.fetch();
    }
  }
};
</script>

<style scoped lang='sass'>
</style>
