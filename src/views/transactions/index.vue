<template>
  <div>
    <Menu />
    <div class='container'>
      <PageHeader name='Операции' action='/transactions/new' />
      <div class='row'>
        <FilterTags class='col s12' @onChange='onChangeFilter' />
        <div class='col s12'>
          <Loader v-if='isLoading' />
          <div v-else-if='isAlert' class='card blue-grey darken-1'>
            <div class='card-content white-text'>
              <span class='card-title'>У вас пока нет операций</span>
              <p>Нажмите на "плюс", чтобы добавить ваш первых доход или расход</p>
            </div>
          </div>
          <div v-if='isEmpty' class='card teal col s9'>
            <div class='card-content white-text'>
              <span class='card-title'>Таких операций нет</span>
              <p>Попробуйте изменить настройки фильтров</p>
            </div>
          </div>
          <div v-if='isTableVisible' class='col s9'>
            <table class='row'>
              <thead>
                <tr>
                  <th class='date'>Дата</th>
                  <th class='amount'>Величина</th>
                  <th />
                  <th />
                </tr>
              </thead>

              <tbody>
                <tr v-for='item in items' :key='item.id'>
                  <td :title='dateTitleFormat(item)'>{{ dateFormat(item) }}</td>
                  <td class='amount' :class='classAmount(item)'>
                    <span class='value'>{{ formatAmount(item) }}</span>
                    <span class='currency grey-text'>{{ item.account.currency.name }}</span>
                  </td>
                  <td>
                    <span
                      class='new badge black-text tag'
                      :class='item.account.color'
                      :data-badge-caption='item.account.name'
                    >
                      <i class='account material-icons left'>
                        account_balance
                      </i>
                    </span>
                    <span
                      v-for='category in item.categories'
                      :key='category.id'
                      class='new badge black-text tag'
                      :class='category.color'
                      :data-badge-caption='category.name'
                    />
                    <span
                      v-if='item.project != null'
                      class='new badge black-text tag'
                      :class='item.project.color'
                      :data-badge-caption='item.project.name'
                    />

                    <i class='grey-text text-darken-1'>
                      {{ item.description }}
                    </i>
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
            <div class='row'>
              <Loader v-if='isLoadingPage' size='small' />
              <br>
              <a
                v-if='!isLoadingPage && !isEmpty && isMore'
                class='btn btn-flat'
                @click='more'
              >
                Загрузить ещё...
              </a>
            </div>
          </div>
          <Filters v-if='!isLoading' class='col s3' @onChange='onChangeFilter' />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FilterTags from '@/components/filter_tags';
import Filters from '@/components/filters';
import Loader from '@/components/loader';
import Menu from '@/components/menu';
import Money from '@/utils/money';
import PageHeader from '@/components/page_header';
import { get, call } from 'vuex-pathify';

// const moment = require('moment/min/moment-with-locales');
const moment = require('moment');
moment.locale('ru');

export default {
  name: 'Transactions',
  components: {
    FilterTags,
    Filters,
    Loader,
    Menu,
    PageHeader
  },
  props: {},
  computed: {
    token: get('user/token'),
    filters: get('filters/params'),
    isVisible: get('filters/isVisible'),
    ...get('transactions/*'),
    // isAccountsLoading: get('accounts/isLoading'),
    // accounts: get('accounts/items'),
    // isAllow() {
    //   return !this.isLoading && !this.isAccountsLoading && this.accounts.length !== 0;
    // },
    isEmpty() { return !this.isLoading && this.items.length === 0; },
    isAlert() { return this.isEmpty && !this.isVisible; },
    isTableVisible() { return !this.isLoading && !this.isEmpty; }
  },
  async created() {
    await this.fetch({ token: this.token, filters: this.filters });
    // if (this.isAlert) {
    //   await this.fetchAccounts(this.token);
    // }
    // if (!this.isAllow) {
    //   this.$router.push({ name: 'new_account', query: { first: true } });
    // }
  },
  methods: {
    more() {
      this.fetchNext({ token: this.token, filters: this.filters });
    },
    fetchAccounts: call('accounts/fetch'),
    ...call([
      'transactions/fetch',
      'transactions/fetchNext',
      'transactions/destroy'
    ]),
    classAmount(transaction) {
      return transaction.amount > 0 ?
        'green-text text-darken-4' :
        'red-text text-darken-4';
    },
    formatAmount(transaction) {
      return Money.format(Math.abs(transaction.amount), 2);
    },
    onChangeFilter() {
      this.fetch({ token: this.token, filters: this.filters });
    },
    onEdit(item) {
      const { id } = item;
      this.$router.push({ name: 'edit_transaction', params: { id } });
    },
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
    },
    dateFormat(transaction) {
      const date = moment(transaction.dateAt);
      const current = moment();
      if (moment(date).isSame(current, 'day')) {
        return 'Сегодня';
      }
      if (current.subtract(1, 'days').isSame(date, 'day')) {
        return 'Вчера';
      }
      if (current.year() === date.year()) {
        return date.format('DD MMMM');
      }

      return date.format('DD.MM.YYYY');
    },
    dateTitleFormat(transaction) {
      return moment(transaction.dateAt).format('DD.MM.YYYY');
    }
  }
};
</script>

<style scoped lang='sass'>
.date
  width: 90px

.amount
  width: 140px
  text-align: right

  .value
    font-weight: 500
    margin-right: 4px

  .currency
    font-weight: 300
    font-size: 10px

.actions
  width: 82px
  text-align: right

  .btn-flat
    padding: 0 8px !important

.tag
  margin-right: 6px

i.account
  font-size: 12px
  line-height: 22px
  margin-right: 3px
  opacity: 0.7
  padding-left: 0px
</style>
