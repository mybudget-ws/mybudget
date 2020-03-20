<template>
  <div>
    <Menu />
    <div class='container'>
      <PageHeader name='Новая цель' />

      <div class='row'>
        <form class='col l10 s12' @submit.prevent='submit'>
          <div class='row'>
            <div class='input-field col l6 s12'>
              <input
                id='name'
                ref='name'
                v-model='name'
                type='text'
                class='validate'
                autofocus
                required
                @focus='$event.target.select()'
              >
              <label for='name' class='active'>Название цели</label>
            </div>
            <div class='input-field col l4 s12'>
              <input
                id='date'
                ref='datepicker'
                type='text'
                class='datepicker'
              >
              <label for='date' class='active'>Крайняя дата</label>
            </div>
          </div>
          <div class='row'>
            <div class='input-field col l6 s12'>
              <input
                id='amount'
                ref='amount'
                v-model='amount'
                type='text'
                class='validate'
                pattern='[0-9,+-/*]+'
                required
                @click='$refs.amount.focus()'
                @focus='$event.target.select()'
              >
              <label for='name' class='active'>Накопить</label>
            </div>
          </div>
          <div class='accounts'>
            <!-- TODO: Extract accounts (components/filters.vue) -->
            <h6>Счета</h6>
            <p v-for='account in displayedAcccounts' :key='account.id'>
              <label>
                <Checkbox
                  :id='account.id'
                  :value='isCheckedAccount(account.id)'
                  @change='onChangeAccount(account)'
                />
                <span>{{ account.name }}</span>
              </label>
            </p>
            <a
              v-if='isNeedShowAllAccounts && !isShowAllAccounts'
              class='btn-flat btn-small waves-effect waves-teal'
              @click='showAll'
            >
              Показать все
            </a>
            <a
              v-if='isNeedShowAllAccounts && isShowAllAccounts'
              class='btn-flat btn-small waves-effect waves-teal'
              @click='hideAll'
            >
              Скрыть счета
            </a>
          </div>

          <div class='row'>
            <div class='col'>
              <Button
                text='Создать цель'
                :is-disabled='isSubmitting'
                :is-loading='isSubmitting'
                @click='submit'
              />
            </div>
            <div class='col'>
              <router-link to='/goals' class='btn-flat btn-large'>
                Отмена
              </router-link>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/button';
import Checkbox from '@/components/checkbox';
import Menu from '@/components/menu';
import PageHeader from '@/components/page_header';
import { get, call } from 'vuex-pathify';

const moment = require('moment');
moment.locale('ru');

export default {
  name: 'NewGoal',
  components: {
    Button,
    Checkbox,
    Menu,
    PageHeader
  },
  props: {},
  data: () => ({
    name: 'Автомобиль',
    date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    amount: '0',
    selectedAccounts: [],

    datepicker: null,
    isShowAllAccounts: false
  }),
  computed: {
    token: get('user/token'),
    accounts: get('accounts/items'),
    isAccountsLoaded: get('accounts/isLoaded'),
    isSubmitting: get('goals/isSubmitting'),
    favouriteAccounts() { return this.accounts.filter(v => v.isFavourite); },
    isNeedShowAllAccounts() {
      return this.favouriteAccounts.length > 0 &&
        this.selectedAccounts.length < this.accounts.length;
    },
    displayedAcccounts() {
      if (this.isNeedShowAllAccounts > 0 && !this.isShowAllAccounts) {
        return this.accounts
          .filter(v => this.selectedAccounts.map(v => v.id).includes(v.id) || v.isFavourite);
      }
      return this.accounts;
    }
  },
  created() {
    if (!this.isAccountsLoaded) { this.fetchAccounts(this.token); }
  },
  async mounted() {
    this.$refs.name.focus();

    /* eslint-disable */
    M.Datepicker.init(
      this.$refs.datepicker,
      {
        format: 'dd mmm, yyyy',
        firstDay: 1,
        setDefaultDate: true,
        defaultDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        i18n: {
          cancel: 'Закрыть',
          months: [
            'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль',
            'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
          monthsShort: [
            'янв.', 'февр.', 'мар.', 'апр.', 'мая', 'июня', 'июля',
            'авг.', 'сент.', 'окт.', 'нояб.', 'дек.'
          ],
          weekdaysShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
          weekdaysAbbrev: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
        }
      }
    );
    M.Datepicker.getInstance(this.$refs.datepicker).setDate(this.date);
    /* eslint-enable */
  },
  methods: {
    create: call('goals/create'),
    fetchAccounts: call('accounts/fetch'),
    showAll() { this.isShowAllAccounts = true; },
    hideAll() { this.isShowAllAccounts = false; },
    isCheckedAccount(id) {
      return this.selectedAccounts.find(v => v.id === id) != null;
    },
    onChangeAccount(account) {
      if (this.isCheckedAccount(account.id)) {
        this.selectedAccounts = this.selectedAccounts
          .filter(v => v.id !== account.id);
      } else {
        this.selectedAccounts.push(account);
      }
    },
    async submit() {
      if (this.isSubmitting) { return; }

      /* eslint-disable */
      const date = M.Datepicker.getInstance(this.$refs.datepicker).date;
      /* eslint-enable */
      const { token, name, amount } = this;
      const accountIds = this.selectedAccounts.map(v => v.id);
      const goal = {
        name,
        amount: amount.toString(),
        dueDateOn: moment(date).format(),
        accountIds
      };
      const isSuccess = await this.create({ token, goal });
      if (isSuccess != null) {
        this.$router.push({ name: 'goals' });
      } else {
        alert('Error');
      }
    }
  }
};
</script>

<style scoped lang='sass'>
.accounts
  margin-bottom: 60px
</style>
