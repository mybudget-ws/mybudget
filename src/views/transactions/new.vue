<template>
  <div>
    <Menu />
    <div class='container container-wide'>
      <PageHeader name='Новая операция' />

      <Loader v-if='isLoading' />
      <div v-else class='row'>
        <form class='col l12 s12' @submit.prevent='submit'>
          <div class='row'>
            <div class='input-field col l4 s12'>
              <input
                id='amount'
                ref='amount'
                v-model='amount'
                type='text'
                class='validate'
                pattern='[0-9,.+-/*\s]+'
                autofocus
                required
                @click='$refs.amount.focus()'
                @input='onChangeAmount'
              >
              <label for='name' class='active'>{{ amountLable }}</label>
              <span
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
                  <!--span v-if='v.isFavourite' class='right'>
                    <i class='material-icons yellow-text text-accent-4'>star</i>
                  </span-->
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

          <div class='row'>
            <div class='col'>
              <Button
                :text='submitText'
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
import { get, call } from 'vuex-pathify';

const moment = require('moment');
moment.locale('ru');

export default {
  name: 'NewTransaction',
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
    date: new Date(),
    description: '',
    accountId: '',
    projectId: '',
    isIncome: false,
    categoryIds: [],

    datepicker: null
  }),
  computed: {
    token: get('user/token'),
    accounts: get('accounts/visibleItemsFilter'),
    projects: get('projects/itemsFilter'),
    filterAccounts: get('filters/accounts'),

    isAccountsLoading: get('accounts/isLoadingFilter'),
    isAccountsLoaded: get('accounts/isLoadedFilter'),
    isProjectsLoading: get('projects/isLoading'),
    isProjectsLoaded: get('projects/isLoaded'),

    isSubmitting: get('transactions/isSubmitting'),

    isLoading() { return this.isAccountsLoading || this.isProjectsLoading; },
    submitText() { return this.isIncome ? 'Создать доход' : 'Создать расход'; },
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
    },
    defaultAccountId() {
      const filterAccount = this.filterAccounts
        .find(v => this.orderedAccounts.map(a => a.id).includes(v.id));
      if (filterAccount) { return filterAccount.id; }
      return this.orderedAccounts[0].id;
    },
    initAccountId() {
      return this.$route.query.account;
    }
  },
  async mounted() {
    if (!this.isAccountsLoaded) { await this.fetchAccounts(this.token); }
    if (!this.isProjectsLoaded) { await this.fetchProjects(this.token); }
    if (this.isNotReadyToAdd) {
      this.$router.push({ name: 'new_account', query: { first: true } });
    }

    /* eslint-disable */
    M.Datepicker.init(
      this.$refs.datepicker,
      {
        format: 'dd mmm, yyyy',
        firstDay: 1,
        autoClose: true,
        setDefaultDate: true,
        defaultDate: new Date(),
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

    this.accountId = this.initAccountId || this.defaultAccountId;
    this.isIncome = this.$route.query.isIncome == 'true';

    setTimeout(() => {
      /* eslint-disable */
      M.FormSelect.init(this.$refs.selectAccounts, {});
      M.updateTextFields();
      /* eslint-enable */
    }, 50);
    if (this.isProjects) {
      setTimeout(() => {
        /* eslint-disable */
        M.FormSelect.init(this.$refs.selectProjects, {});
        M.updateTextFields();
        /* eslint-enable */
      }, 50);
    }
    this.$refs?.amount?.focus();
  },
  methods: {
    fetchAccounts: call('accounts/fetchFilter'),
    fetchProjects: call('projects/fetch'),
    create: call('transactions/create'),
    onSelectCategory(ids) {
      this.categoryIds = ids;
    },
    onChangeAmount(_e) {
      this.amount = this.amount.replace(/[^0-9,.+-/*\s]/g, '');
    },
    async submit() {
      if (this.isSubmitting) { return; }

      /* eslint-disable */
      const date = M.Datepicker.getInstance(this.$refs.datepicker).date;
      /* eslint-enable */
      const { token, amount, isIncome, description, accountId, projectId, categoryIds } = this;
      const evalAmount = eval(amount.replace(',', '.').replace(/([.])\1+/g, '$1'));
      const transaction = {
        amount: (evalAmount === Infinity ? 0 : evalAmount).toString(),
        isIncome,
        date: moment(date).format(),
        categoryIds,
        description,
        accountId,
        projectId
      };
      const isSuccess = await this.create({ token, transaction });
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

.tab
  margin-left: 12px
  &:hover
    background-color: #ffea00

  i.left
    margin-right: 0px
</style>
