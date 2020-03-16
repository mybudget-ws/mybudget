<template>
  <div>
    <Menu />
    <div class='container'>
      <PageHeader name='Счета' action='/accounts/new' />
      <div class='row'>
        <div class='col s12'>
          <Loader v-if='isLoading' />
          <div v-else-if='isAlert' class='card blue-grey darken-1'>
            <div class='card-content white-text'>
              <span class='card-title'>На данный момент у вас нет Счетов</span>
              <p>
                Чтобы начать учет доходов и расходов вам нужно иметь
                как минимум один счет.
                Нажмите на "плюс", чтобы добавить ваш первых счет
              </p>
            </div>
          </div>
          <table v-else>
            <thead>
              <tr>
                <th class='name'>Название</th>
                <th class='amount'>Баланс</th>
                <th />
              </tr>
            </thead>

            <tbody>
              <tr v-for='item in items' :key='item.id'>
                <td>
                  <div class='valign-wrapper'>
                    <span class='color' :class='item.color' />
                    <span>{{ item.name }}</span>
                    <a class='btn-flat' :title='titleFavourite(item)' @click='onFavourite(item)'>
                      <i v-if='item.isFavourite' class='material-icons yellow-text text-accent-4'>star</i>
                      <i v-else class='material-icons grey-text'>star_border</i>
                    </a>
                  </div>
                </td>
                <td class='amount'>
                  <Amount :value='item.balance' :currency='item.currency.name' />
                </td>
                <td class='actions'>
                  <a
                    class='waves-effect waves-teal btn-flat'
                    @click='onEdit(item)'
                  >
                    <i class='material-icons grey-text'>edit</i>
                  </a>
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
import Amount from '@/components/amount';
import Loader from '@/components/loader';
import Menu from '@/components/menu';
import Money from '@/utils/money';
import PageHeader from '@/components/page_header';
import { get, call } from 'vuex-pathify';

export default {
  name: 'Accounts',
  components: {
    Amount,
    Menu,
    Loader,
    PageHeader
  },
  props: {},
  computed: {
    token: get('user/token'),
    ...get('accounts/*'),
    isAlert() {
      return !this.isLoading && this.items.length === 0;
    }
  },
  created() {
    this.fetch(this.token);
  },
  methods: {
    ...call('accounts/*'),
    titleFavourite(item) {
      return item.isFavourite ? 'Удалить из избранного' : 'Добавить в избранное';
    },
    onEdit(account) {
      const { id } = account;
      this.$router.push({ name: 'edit_account', params: { id } });
    },
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
    },
    async onFavourite(account) {
      if (this.isSubmitting) { return; }

      const isFavourite = await this.toggleIsFavourite({ token: this.token, account });
      const message = isFavourite ?
        'Счет добавлен в избранное' :
        'Счет удален из избранного';
      /* eslint-disable */
      M.toast({ html: message });
      /* eslint-enable */
    },
    formatAmount(balance) {
      return Money.format(balance, 2);
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

.name
  width: 200px

.amount
  text-align: right
  width: 140px

.actions
  width: 50px
  text-align: right

  .btn-flat
    padding: 0 8px !important
</style>
