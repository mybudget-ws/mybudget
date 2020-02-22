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
                <th class='name'>Название</th>
                <th class='usd right'>Курс к USD</th>
                <th>Описание</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for='curr in displayedItems' :key='curr.id'>
                <td class='name'>{{ curr.name }}</td>
                <td class='usd right'>{{ curr.usdRate.toFixed(6) }}</td>
                <td>
                  <span class='grey-text'>{{ curr.description }}</span>
                </td>
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
.name
  width: 80px

.usd
  padding-right: 20px
</style>
