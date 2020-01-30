<template>
  <div>
    <Menu />
    <div class='container'>
      <PageHeader name='Операции' action='/transactions/new' />
      <div class='row'>
        <div class='col s12'>
          <Loader v-if='isLoading' />
          <div v-else-if='isAlert' class='card blue-grey darken-1'>
            <div class='card-content white-text'>
              <span class='card-title'>У вас пока нет операций</span>
              <p>
                Нажмите на "плюс", чтобы добавить ваш первых доход или расход
              </p>
            </div>
          </div>
          <table v-else>
            <thead>
              <tr>
                <th>Дата</th>
                <th>Величина</th>
                <th class='actions' />
              </tr>
            </thead>

            <tbody>
              <tr v-for='item in items' :key='item.id'>
                <td>{{ item.dateAt }}</td>
                <td>
                  <!--div class='valign-wrapper'>
                    <span class='color' :class='item.color' />
                    <span>{{ item.name }}</span>
                  </div-->
                  {{ item.amount }}
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
  name: 'Transactions',
  components: {
    Menu,
    Loader,
    PageHeader
  },
  props: {},
  computed: {
    token: get('user/token'),
    ...get('transactions/*'),
    isAccountsLoading: get('accounts/isLoading'),
    accounts: get('accounts/items'),
    isAllow() {
      return !this.isLoading && !this.isAccountsLoading && this.accounts.length !== 0;
    },
    isAlert() {
      return !this.isLoading && this.items.length === 0;
    }
  },
  async created() {
    await this.fetch(this.token);
    if (this.isAlert) {
      await this.fetchAccounts(this.token);
    }
    // TODO: Fix account for new user.
    // if (!this.isAllow) {
    //   this.$router.push({ name: 'new_account', query: { first: true } });
    // }
  },
  methods: {
    fetchAccounts: call('accounts/fetch'),
    ...call([
      'transactions/fetch',
      'transactions/destroy'
    ]),
    async onDestroy(transaction) {
      if (this.isDestroying) { return; }
      if (confirm('Удалить операцию. Вы уверены?')) {
        const res = await this.destroy({ token: this.token, transaction });
        const message = res != null ?
          'Операция успешно удалена' :
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
.actions
  width: 50px
  text-align: right
</style>
