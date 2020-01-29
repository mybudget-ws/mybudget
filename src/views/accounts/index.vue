<template>
  <div>
    <Menu />
    <div class='container'>
      <PageHeader name='Счета' action='/accounts/new' />
      <div class='row'>
        <div class='col s12'>
          <Loader v-if='isLoading' />
          <table v-else>
            <thead>
              <tr>
                <th>Название</th>
                <th>Баланс</th>
                <th class='actions' />
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
                <td>
                  <a
                    class='waves-effect waves-teal btn-flat'
                    @click='onDestroy(item)'
                  >
                    <i class='material-icons grey-text'>delete</i>
                  </a>
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
  name: 'Accounts',
  components: {
    Menu,
    Loader,
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
      'accounts/fetch',
      'accounts/destroy'
    ]),
    async onDestroy(account) {
      if (this.isDestroying) { return; }
      if (confirm('Удалить счет. Вы уверены?')) {
        const res = await this.destroy({ token: this.token, account });
        const message = res != null ?
          'Счет успешно удален' :
          'Непредвиденная ошибка';
        /* eslint-disable */
        M.toast({ html: message });
        /* eslint-enable */
      }
    }
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

.actions
  width: 50px
  text-align: right
</style>
