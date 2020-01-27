<template>
  <div>
    <Menu />
    <div class='container'>
      <PageHeader name='Счета' action='/accounts/new' />
      <div class='row'>
        <div class='col s12'>
          <p v-if='isLoading'>Загрузка...</p>
          <table v-else>
            <thead>
              <tr>
                <th>Название</th>
                <th>Баланс</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for='item in items' :key='item.id'>
                <td>
                  <div class='valign-wrapper'>
                    <span class='color' :class='item.color' />
                    <span>{{ item.name }}</span>
                  </div>
                </td>
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
  display: inline-block
  margin-right: 10px
</style>
