<template>
  <div>
    <Menu />
    <div class='container container-wide'>
      <PageHeader name='Редактирование цели' />

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
                required
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
                :type='isPhone ? "number" : "text"'
                :class='{ "validate": !isPhone }'
                autofocus
                required
                @click='$refs.amount.focus()'
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

          <div v-if='isPhone' class='mobile-submit'>
            <Button
              :is-disabled='isSubmitting'
              :is-loading='isSubmitting'
              @click='submit'
            >
              <i
                class='material-icons grey-text text-darken-1'
                style='font-size: 2rem'
              >
                done
              </i>
            </Button>
            <router-link
              to='/goals'
              class='btn-floating btn-large waves-effect waves-light grey lighten-2 z-depth-0'
            >
              <i class='material-icons grey-text text-darken-1' style='font-size: 2rem'>close</i>
            </router-link>
          </div>
          <div v-else class='row'>
            <div class='col'>
              <Button
                text='Изменить'
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
import api from '@/api';
import { get, call } from 'vuex-pathify';

import MobileDetect from 'mobile-detect';
const md = new MobileDetect(window.navigator.userAgent);

const moment = require('moment');
moment.locale('ru');

export default {
  name: 'EditGoal',
  components: {
    Button,
    Checkbox,
    Menu,
    PageHeader
  },
  props: {},
  data: () => ({
    name: '',
    date: null,
    amount: '0',
    selectedAccounts: [],
    isLoading: true,
    isSubmitting: false,

    datepicker: null,
    isShowAllAccounts: false,
    isPhone: md.phone() != null
  }),
  computed: {
    id() { return this.$route.params.id; },
    token: get('user/token'),
    accounts: get('accounts/visibleItems'),
    isAccountsLoaded: get('accounts/isLoaded'),
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
    const item = await api.goal(this.token, { id: this.id });
    this.isLoading = false;

    this.name = item.name;
    this.amount = item.amount;
    this.date = new Date(Date.parse(item.dueDateOn));
    this.selectedAccounts = item.accounts;

    /* eslint-disable */
    M.Datepicker.init(
      this.$refs.datepicker,
      {
        format: 'dd mmm, yyyy',
        firstDay: 1,
        autoClose: true,
        setDefaultDate: true,
        defaultDate: this.date,
        i18n: {
          cancel: 'Закрыть',
          months: [
            'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль',
            'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
          ],
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

    this.$refs.name.focus();
  },
  methods: {
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

      this.isSubmitting = true;
      /* eslint-disable */
      const date = M.Datepicker.getInstance(this.$refs.datepicker).date;
      /* eslint-enable */
      const { id, name, amount } = this;
      const accountIds = this.selectedAccounts.map(v => v.id);
      const isSuccess = await api.updateGoal(
        this.token,
        {
          id,
          name,
          amount: amount.toString(),
          dueDateOn: moment(date).format(),
          accountIds
        }
      );
      if (isSuccess != null) {
        this.$router.push({ name: 'goals' }).catch(_e => {});
      } else {
        alert('Error');
      }
    }
  }
};
</script>

<style scoped lang='sass'>
.mobile-submit
  z-index: 2
  position: fixed
  bottom: 0
  right: 0
  padding: 0 20px 20px 0
  min-width: 146px
  width: 146px

  a
    margin-left: 12px
</style>
