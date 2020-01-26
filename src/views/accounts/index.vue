<template>
  <div>
    <Menu />
    <div class='container'>
      <PageHeader name='Счета' />
      <p v-if='isLoading'>Загрузка...</p>
      <table v-else>
        <thead>
          <tr>
            <th colspan='2'>Название</th>
            <th>Баланс</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for='item in items' :key='item.id'>
            <td class='color-td'>
              <div class='color' :class='item.color' />
            </td>
            <td>{{ item.name }}</td>
            <td>
              {{ item.balance }}
              &nbsp;
              <span class='grey-text'>{{ item.currency.name }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import Menu from '@/components/menu';
import PageHeader from '@/components/page_header';
import { get, call } from 'vuex-pathify';

export default {
  name: 'Accounts',
  components: {
    Menu,
    PageHeader
  },
  props: {},
  computed: {
    token: get('user/token'),
    ...get('accounts/*')
  },
  async created() {
    this.fetch(this.token);
  },
  methods: {
    ...call([
      'accounts/fetch'
    ])
  }
};
</script>

<style scoped lang='sass'>
.color
  width: 20px
  height: 20px
  border-radius: 3px

.color-td
  width: 32px
</style>
