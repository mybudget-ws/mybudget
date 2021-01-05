<template>
  <div>
    <Menu />
    <div class='container container-wide'>
      <PageHeader name='Счета' action='/accounts/new' />
      <div class='row'>
        <div class='col s12'>
          <Loader v-if='isLoading' />
          <div v-else-if='isAlert' class='card blue-grey'>
            <div class='card-content white-text'>
              <span class='card-title'>На данный момент у вас нет Счетов</span>
              <p>
                Чтобы начать учет доходов и расходов вам нужно иметь
                как минимум один счет.
                Нажмите на "плюс", чтобы добавить ваш первых счет
              </p>
            </div>
          </div>
          <table v-else-if='!isPhone'>
            <thead>
              <tr>
                <th class='name'>Название</th>
                <th class='amount'>Баланс</th>
                <th />
                <th />
              </tr>
            </thead>

            <tbody>
              <tr v-for='item in orderedVisibleAccounts' :key='item.id'>
                <td>
                  <div class='valign-wrapper'>
                    <span class='color' :class='item.color' />
                    <span>{{ item.name }}</span>
                    <span v-if='item.kind === "credit"' class='badge' title='Кредитная карта'>K</span>
                    <a class='btn-flat' :title='titleFavourite(item)' @click='onFavourite(item)'>
                      <i v-if='item.isFavourite' class='material-icons yellow-text text-accent-4'>star</i>
                      <i v-else class='material-icons grey-text'>star_border</i>
                    </a>
                  </div>
                </td>
                <td class='amount'>
                  <Amount :value='item.balance' :currency='item.currency.name' />
                </td>
                <td class='transacton-actions'>
                  <router-link
                    :to="`/transactions/new?account=${item.id}&${backTo}`"
                    title='Новый расход'
                    class='btn-small waves-effect waves-light red lighten-4 z-depth-0'
                  >
                    <i class='material-icons grey-text text-darken-1'>arrow_downward</i>
                  </router-link>
                  <router-link
                    :to="`/transactions/new?account=${item.id}&isIncome=true&${backTo}`"
                    title='Новый доход'
                    class='btn-small waves-effect waves-light green accent-1 z-depth-0'
                  >
                    <i class='material-icons grey-text text-darken-1'>arrow_upward</i>
                  </router-link>
                  <router-link
                    v-if='isTransferAllow'
                    :to="`/transactions/transfers/new?accountIdDst=${item.id}&${backTo}`"
                    title='Новый перевод'
                    class='btn-small waves-effect waves-light indigo lighten-5 z-depth-0'
                  >
                    <i class='material-icons grey-text text-darken-1'>repeat</i>
                  </router-link>
                  <router-link
                    :to="`/accounts/${item.id}?${backTo}`"
                    title='Просмотр счета'
                    class='btn-small waves-effect waves-light grey lighten-2 z-depth-0'
                  >
                    <i class='material-icons grey-text text-darken-1'>list</i>
                  </router-link>
                </td>
                <td class='actions'>
                  <a
                    class='waves-effect waves-teal btn-flat'
                    title='Редактировать'
                    @click='onEdit(item)'
                  >
                    <i class='material-icons grey-text'>edit</i>
                  </a>
                  <a
                    class='waves-effect waves-teal btn-flat'
                    title='Скрыть'
                    @click='onHide(item)'
                  >
                    <i class='material-icons grey-text'>visibility_off</i>
                  </a>
                  <a
                    v-if='isTransferAllow'
                    class='waves-effect waves-teal btn-flat'
                    title='Удалить'
                    @click='onDestroy(item)'
                  >
                    <i class='material-icons grey-text'>delete</i>
                  </a>
                </td>
              </tr>
              <tr v-if='orderedVisibleAccounts.length > 1' class='totals'>
                <td>
                  <b>Всего</b>
                </td>
                <td class='amount-total'>
                  <Amount
                    v-for='total in orderedTotals'
                    :key='total.currency_name'
                    class='value'
                    :value='total.balance'
                    :currency='total.currency_name'
                  />
                  <Amount
                    v-if='isShowBalanceBase'
                    class='value amount-base-total'
                    :value='balanceBaseTotal'
                    :currency='defaultCurrency'
                  />
                </td>
                <td />
                <td />
              </tr>
            </tbody>
          </table>
          <div v-for='item in orderedVisibleAccounts' v-else :key='item.id'>
            <Card
              v-bind='item'
              :is-transfer-allow='isTransferAllow'
              @edit='onEdit(item)'
              @hide='onHide(item)'
              @destroy='onDestroy(item)'
              @favourite='onFavourite(item)'
            />
          </div>
          <div v-if='isPhone && !isLoading' class='card blue-grey lighten-5 z-depth-0 card-total'>
            <div class='card-content'>
              <b>Всего</b>
              <div v-for='total in orderedTotals' :key='total.currency_name'>
                <Amount :value='total.balance' :currency='total.currency_name' />
              </div>
              <hr v-if='isShowBalanceBase'>
              <div v-if='isShowBalanceBase'>
                <b>По текущему курсу</b>
                <Amount :value='balanceBaseTotal' :currency='defaultCurrency' />
              </div>
            </div>
          </div>

          <!-- Archive -->
          <table v-if='hiddenItems.length' class='hidden-table'>
            <thead>
              <tr>
                <th>Архив</th>
                <th />
                <th />
              </tr>
            </thead>
            <tbody>
              <tr v-for='item in hiddenItems' :key='item.id'>
                <td>
                  <div class='valign-wrapper'>
                    <span class='color' :class='item.color' />
                    <span>{{ item.name }}</span>
                  </div>
                </td>
                <td>
                  <i class='description grey-text text-darken-1'>В архиве</i>
                </td>
                <td class='actions-hidden'>
                  <a
                    class='waves-effect waves-teal btn-flat'
                    title='Сделать активным'
                    @click='onHide(item)'
                  >
                    <i class='material-icons grey-text'>visibility</i>
                  </a>
                  <a
                    class='waves-effect waves-teal btn-flat'
                    title='Удалить'
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
import Card from '@/components/accounts/card';
import Loader from '@/components/loader';
import Menu from '@/components/menu';
import Money from '@/utils/money';
import PageHeader from '@/components/page_header';
import { get, call } from 'vuex-pathify';

import MobileDetect from 'mobile-detect';
const md = new MobileDetect(window.navigator.userAgent);

export default {
  name: 'Accounts',
  components: {
    Amount,
    Card,
    Menu,
    Loader,
    PageHeader
  },
  props: {},
  data: () => ({
    isPhone: md.phone() != null
  }),
  computed: {
    token: get('user/token'),
    defaultCurrency: get('user/defaultCurrency'),
    ...get('accounts/*'),
    isAlert() {
      return !this.isLoading && this.items.length === 0;
    },
    isTransferAllow() {
      return this.orderedVisibleAccounts.length > 1;
    },
    orderedVisibleAccounts() {
      return [
        ...this.visibleItems.filter(v => v.isFavourite),
        ...this.visibleItems.filter(v => !v.isFavourite)
      ];
    },
    orderedTotals() {
      const totals = this.visibleItems.reduce((r, a) => {
        r[a.currency.name] = (r[a.currency.name] || 0) + a.balance;
        return r;
      }, {});

      // return [
      //   { currency_name: 'RUB', balance: 110000 },
      //   { currency_name: 'USD', balance: 2000 }
      // ];
      return Object
        .entries(totals)
        .map(v => ({ currency_name: v[0], balance: v[1] }));
    },
    isShowBalanceBase() { return this.orderedTotals.length > 1; },
    balanceBaseTotal() {
      return this.visibleItems.map(v => v.balanceBase).reduce((a, b) => a + b);
    },
    backTo() {
      return 'backTo=/accounts';
    }
  },
  async created() {
    if (this.defaultCurrency == null) {
      await this.fetchProfile();
    }
    await this.fetch(this.token);
  },
  methods: {
    ...call('accounts/*'),
    ...call(['user/fetchProfile']),
    titleFavourite(item) {
      return item.isFavourite ? 'Удалить из избранного' : 'Добавить в избранное';
    },
    onEdit({ id }) {
      this.$router.push({ name: 'edit_account', params: { id } });
    },
    async onHide(account) {
      if (this.isSubmitting) { return; }

      const isHidden = await this.toggleIsHidden({ token: this.token, account });
      const message = isHidden ? 'Счет добавлен в архив' : 'Счет удален из архива';
      /* eslint-disable */ M.toast({ html: message }); /* eslint-enable */
    },
    async onDestroy(account) {
      if (this.isDestroying) { return; }

      if (confirm('Удалить счет. Вы уверены?')) {
        const res = await this.destroy({ token: this.token, account });
        const message = res != null ? 'Счет успешно удален' : 'Непредвиденная ошибка';
        /* eslint-disable */ M.toast({ html: message }); /* eslint-enable */
      }
    },
    async onFavourite(account) {
      if (this.isSubmitting) { return; }

      const isFavourite = await this.toggleIsFavourite({ token: this.token, account });
      const message = isFavourite ? 'Счет добавлен в избранное' : 'Счет удален из избранного';
      /* eslint-disable */ M.toast({ html: message }); /* eslint-enable */
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

.badge
  background-color: #eceff1
  border-radius: 4px
  border: 1px solid #b0bec5
  box-sizing: border-box
  color: #607d8b
  font-size: 12px
  height: 20px
  line-height: 18px
  margin-left: 8px
  min-width: 1.8rem

.amount
  text-align: right
  width: 140px

.actions,
.actions-hidden
  padding-right: 0px
  width: 54px
  text-align: right

  .btn-flat
    padding: 0 8px !important

.transacton-actions
  width: 208px
  max-width: 10px // magic style
  text-align: right

  .btn-small + .btn-small
    margin-left: 8px

  .btn-small
    padding: 0 14px
    border-radius: 4px

.actions-hidden
  width: 82px

.hidden-table
  margin-top: 60px
  opacity: 0.4

.totals
  background-color: #fafafa

  .amount-total
    text-align: right
    padding-right: 0

    .value + .value
      margin-top: 6px

  .amount-base-total
    border-top: 1px solid #d4d4d4
    padding-top: 4px

    &:before
      color: #757575
      content: 'Всего по текущему курсу:'
      font-size: 13px
      font-weight: 200
      margin-left: -164px
      margin-top: -3.6px
      padding-top: 4px
      position: absolute

.card-total
  text-align: right

  .card-title
    text-align: left

  b
    float: left
</style>
