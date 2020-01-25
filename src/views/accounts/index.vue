<template>
  <div>
    <Menu />
    <div class='container'>
      <PageHeader name='Счета' />
      <p v-if='isLoading'>Загрузка...</p>
      <div>TODO</div>
      <!--table v-else>
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
      </table-->
    </div>
  </div>
</template>

<script>
import Menu from '@/components/menu';
import PageHeader from '@/components/page_header';
// import { get, call } from 'vuex-pathify';

export default {
  name: 'Accounts',
  components: {
    Menu,
    PageHeader
  },
  props: {}
  // computed: {
  //   // items: get('currencies/displayedItems'),
  //   // isLoading: get('currencies/*')
  //   // ...sync('currencies/*')
  //   ...get('currencies/*')
  // },
  // async created() {
  //   this.fetch();
  // },
  // methods: {
  //   ...call([
  //     'currencies/fetch'
  //   ])
  // }
};
</script>

<style scoped lang='sass'>
</style>
