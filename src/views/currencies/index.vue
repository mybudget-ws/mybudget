<template>
  <div>
    <Menu />
    <div class='container'>
      <PageHeader name='Курсы валют' />
      <div class='row'>
        <div class='col s12'>
          <Loader v-if='isLoading' />
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
    </div>
  </div>
</template>

<script>
import Menu from '@/components/menu';
import Loader from '@/components/loader';
import PageHeader from '@/components/page_header';
import { get, call } from 'vuex-pathify';

export default {
  name: 'Currencies',
  components: {
    Menu,
    Loader,
    PageHeader
  },
  props: {},
  computed: {
    ...get('currencies/*')
  },
  created() {
    this.fetch();
  },
  methods: {
    ...call([
      'currencies/fetch'
    ])
  }
};
</script>

<style scoped lang='sass'>
</style>
