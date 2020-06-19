<template>
  <div>
    <Menu />
    <div class='container container-wide'>
      <PageHeader
        :name='isIncome ? "Доход" : "Расход"'
        :cover='isIncome ? "income" : "expence"'
      />

      <Loader v-if='isLoading' />
      <div v-else class='row'>
        <form class='col l12 s12' @submit.prevent='submit'>
          <div class='row'>
            <div class='input-field col l4 s12'>
              <input
                id='amount'
                ref='amount'
                v-model='amount'
                :type='isPhone ? "number" : "text"'
                :class='{ "validate": !isPhone }'
                autofocus
                required
                @click='$refs.amount.focus()'
                @input='onChangeAmount'
              >
              <label for='name' class='active'>{{ amountLable }}</label>
              <span
                v-if='!isPhone'
                class='helper-text'
                data-error='Похоже, что это не число'
                data-success='Отлично'
              >
                Например 20.4 или 10 + 3 * 2
              </span>
            </div>
            <div class='input-field col l4 s12'>
              <select ref='selectAccounts' v-model='accountId'>
                <option v-for='v in orderedAccounts' :key='v.id' :value='v.id'>
                  {{ v.name }}
                </option>
              </select>
              <label>Счет</label>
            </div>
            <div class='input-field col l4 s12'>
              <input
                id='date'
                ref='datepicker'
                type='text'
                class='datepicker'
              >
              <label for='date' class='active'>Дата</label>
            </div>
          </div>
          <div class='switch'>
            <label>
              Расход
              <input v-model='isIncome' type='checkbox'>
              <span class='lever' />
              Доход
            </label>
          </div>

          <div class='row'>
            <Categories
              class='categories col l4 s12'
              :ids='categoryIds'
              @change='onSelectCategory'
            />
            <div class='col l8 s12'>
              <div class='row'>
                <div class='input-field col s12'>
                  <input
                    id='description'
                    v-model='description'
                    type='text'
                  >
                  <label for='name' class='active'>Комментарий</label>
                </div>
                <div v-if='isProjects' class='input-field col l6 s12'>
                  <select ref='selectProjects' v-model='projectId'>
                    <option value='' selected>Без проекта</option>
                    <option v-for='project in projects' :key='project.id' :value='project.id'>
                      {{ project.name }}
                    </option>
                  </select>
                  <label>Проект</label>
                </div>
              </div>
            </div>
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
              to='/transactions'
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
              <router-link to='/transactions' class='btn-flat btn-large'>
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
import Categories from '@/components/categories';
import Loader from '@/components/loader';
import Menu from '@/components/menu';
import PageHeader from '@/components/page_header';
import api from '@/api';
import { get, call } from 'vuex-pathify';

import MobileDetect from 'mobile-detect';
const md = new MobileDetect(window.navigator.userAgent);

const moment = require('moment');
moment.locale('ru');

export default {
  name: 'EditTransaction',
  components: {
    Button,
    Categories,
    Menu,
    Loader,
    PageHeader
  },
  props: {},
  data: () => ({
    amount: '',
    date: null,
    description: '',
    accountId: '',
    projectId: '',
    isIncome: false,
    categoryIds: [],

    isPhone: md.phone() != null,
    datepicker: null,
    isLoadingTransaction: true,
    isSubmitting: false
  }),
  computed: {
    id() { return this.$route.params.id; },
    token: get('user/token'),
    accounts: get('accounts/visibleItemsFilter'),
    projects: get('projects/itemsFilter'),

    isAccountsLoading: get('accounts/isLoadingFilter'),
    isAccountsLoaded: get('accounts/isLoadedFilter'),
    isProjectsLoading: get('projects/isLoadingFilter'),
    isProjectsLoaded: get('projects/isLoadedFilter'),

    isLoading() {
      return this.isLoadingTransaction ||
        this.isAccountsLoading ||
        this.isProjectsLoading;
    },
    amountLable() {
      return `Величина, ${this.selectedAccount?.currency?.name}`;
    },
    selectedAccount() {
      return this.accounts.find(v => v.id === this.accountId);
    },
    isNotReadyToAdd() {
      return this.isAccountsLoaded &&
        !this.isAccountsLoading &&
        this.accounts.length === 0;
    },
    isProjects() { return this.isProjectsLoaded && this.projects.length > 0; },
    orderedAccounts() {
      return [
        ...this.accounts.filter(v => v.isFavourite),
        ...this.accounts.filter(v => !v.isFavourite)
      ];
    }
  },
  async mounted() {
    if (!this.isAccountsLoaded) { await this.fetchAccounts(this.token); }
    if (!this.isProjectsLoaded) { await this.fetchProjects(this.token); }

    const transaction = await api.transaction(this.token, { id: this.id });
    this.isIncome = transaction.amount > 0;
    this.amount = Math.abs(transaction.amount);
    this.date = new Date(Date.parse(transaction.dateAt));
    this.description = transaction.description;
    this.accountId = transaction.account.id;
    this.projectId = transaction.project?.id || '';
    this.categoryIds = transaction.categories.map(v => v.id);
    this.isLoadingTransaction = false;

    /* eslint-disable */
    this.$nextTick(() => {
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
    });
    /* eslint-enable */

    this.$nextTick(() => {
      /* eslint-disable */
      M.FormSelect.init(this.$refs.selectAccounts, {});
      M.updateTextFields();
      /* eslint-enable */
    });
    if (this.isProjects) {
      this.$nextTick(() => {
        /* eslint-disable */
        M.FormSelect.init(this.$refs.selectProjects, {});
        M.updateTextFields();
        /* eslint-enable */
      });
    }
    this.$nextTick(() => {
      // this.$refs.amount.select();
      this.$refs.amount.focus();
    });
  },
  methods: {
    fetchAccounts: call('accounts/fetchFilter'),
    fetchProjects: call('projects/fetchFilter'),
    onSelectCategory(ids) { this.categoryIds = ids; },
    onChangeAmount(_e) {
      this.amount = this.amount.replace(/[^0-9,.+-/*\s]/g, '');
    },
    async submit() {
      if (this.isSubmitting) { return; }

      this.isSubmitting = true;
      /* eslint-disable */
      const date = M.Datepicker.getInstance(this.$refs.datepicker).date;
      /* eslint-enable */
      const { id, amount, isIncome, description, accountId, projectId, categoryIds } = this;
      const evalAmount = eval(
        amount.toString().replace(/,/g, '.').replace(/\s/g, '').replace(/([.])\1+/g, '$1')
      );
      const transaction = {
        id,
        amount: (evalAmount === Infinity ? 0 : evalAmount).toString(),
        isIncome,
        date: moment(date).format(),
        categoryIds,
        description,
        accountId,
        projectId
      };
      const isSuccess = await api.updateTransaction(this.token, transaction);
      this.isSubmitting = false;

      if (isSuccess != null) {
        this.$router.push({ name: 'transactions' });
      } else {
        alert('Error');
      }
    }
  }
};
</script>

<style scoped lang='sass'>
.switch
  margin-top: -20px
  margin-bottom: 10px

h6.subtitle
  padding-top: 16px

.categories
  padding-bottom: 30px

form
  @media only screen and (max-width: 601px)
    padding-bottom: 3rem !important

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
