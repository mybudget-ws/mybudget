<template>
  <div>
    <Menu />
    <div class='container'>
      <h3>Курсы валют</h3>
      <p v-if='isLoading'>Загрузка...</p>
      <table v-else>
        <thead>
          <tr>
            <th>Name</th>
            <th>USD</th>
            <th>Description</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for='curr in displayedItems' :key='curr.id'>
            <td>{{ curr.name }}</td>
            <td>{{ curr.usdRate }}</td>
            <td>{{ curr.description }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import Api from '@/api';
import Menu from '@/components/menu';

export default {
  name: 'Currencies',
  components: {
    Menu
  },
  props: {},
  data: () => ({
    isLoading: true,
    items: []
  }),
  computed: {
    displayedItems() {
      if (this.isLoading) { return []; }

      return this.items.filter(v => v.name !== 'USD');
    }
  },
  async created() {
    this.items = await Api.currencies();
    this.isLoading = false;
  },
  methods: {
  }
};
</script>

<style scoped lang='sass'>
</style>
