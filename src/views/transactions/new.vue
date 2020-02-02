<template>
  <div>
    <Menu />
    <div class='container'>
      <div class='row'>
        <div class='col s12'>
          <PageHeader name='Новая операция' />
        </div>
      </div>

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
                pattern='[0-9,+-/*]+'
                autofocus
                required
                @click='$refs.amount.focus()'
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
            <div v-if='isCategories' class='categories col l4 s12'>
              <h6 class='subtitle'>Категории</h6>
              <p v-for='category in displayedCategories' :key='category.id'>
                <label>
                  <input
                    :id='category.id'
                    v-model='categoryIds'
                    type='checkbox'
                    :value='category.id'
                  >
                  <span>{{ category.name }}</span>
                </label>
              </p>
              <a
                v-if='isNeedShowAll && !isShowAllCategories'
                class='btn-flat btn-small waves-effect waves-teal'
                @click='showAll'
              >
                Показать все
              </a>
              <a
                v-if='isNeedShowAll && isShowAllCategories'
                class='btn-flat btn-small waves-effect waves-teal'
                @click='hideAll'
              >
                Только избранные
              </a>
            </div>
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
import Menu from '@/components/menu';
import Loader from '@/components/loader';
import PageHeader from '@/components/page_header';
import { get, call } from 'vuex-pathify';

// const moment = require('moment');
const moment = require('moment/min/moment-with-locales');
moment.locale('ru');

export default {
  name: 'NewTransaction',
  components: {
    Button,
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
    datepicker: null,
    categoryIds: [],
    isShowAllCategories: false
  }),
  computed: {
    token: get('user/token'),
    accounts: get('accounts/items'),
    projects: get('projects/items'),
    categories: get('categories/items'),

    isAccountsLoading: get('accounts/isLoading'),
    isAccountsLoaded: get('accounts/isLoaded'),
    isProjectsLoading: get('projects/isLoading'),
    isProjectsLoaded: get('projects/isLoaded'),
    isCategoiresLoaded: get('categories/isLoaded'),

    isSubmitting: get('transactions/isSubmitting'),

    isLoading() { return this.isAccountsLoading && this.isProjectsLoading; },
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
    isCategories() { return this.isCategoiresLoaded && this.categories.length > 0; },
    formatDate() {
      // return moment(this.date).format('MMM DD, YYYY');
      // return moment(this.date).format('ll');
      /* eslint-disable */
      const date = M.Datepicker.getInstance(this.$refs.datepicker).date;
      console.log(moment(date).format().toString());
      /* eslint-enable */
      return moment(this.date).format('DD MMM, YYYY');
    },
    orderedAccounts() {
      return [
        ...this.accounts.filter(v => v.isFavourite),
        ...this.accounts.filter(v => !v.isFavourite)
      ];
    },
    favouriteCategories() {
      return this.categories.filter(v => v.isFavourite);
    },
    isNeedShowAll() {
      return this.favouriteCategories.length > 0;
    },
    displayedCategories() {
      if (this.isNeedShowAll > 0 && !this.isShowAllCategories) {
        return this.favouriteCategories;
      }
      return this.categories;
    }
  },
  async mounted() {
    if (!this.isAccountsLoaded) { await this.fetchAccounts(this.token); }
    if (!this.isProjectsLoaded) { await this.fetchProjects(this.token); }
    if (!this.isCategoiresLoaded) { await this.fetchCategoires(this.token); }
    if (this.isNotReadyToAdd) {
      this.$router.push({ name: 'new_account', query: { first: true } });
    }

    /* eslint-disable */
    M.Datepicker.init(
      this.$refs.datepicker,
      {
        format: 'dd mmm, yyyy',
        firstDay: 1,
        // onSelect: this.onSelect,
        setDefaultDate: true,
        defaultDate: new Date(),
        i18n: {
          cancel: 'Закрыть',
          months: [
            'Январь',
            'Февраль',
            'Март',
            'Апрель',
            'Май',
            'Июнь',
            'Июль',
            'Август',
            'Сентябрь',
            'Октябрь',
            'Ноябрь',
            'Декабрь'
          ],
          monthsShort: [
            'янв.',
            'февр.',
            'мар.',
            'апр.',
            'мая',
            'июня',
            'июля',
            'авг.',
            'сент.',
            'окт.',
            'нояб.',
            'дек.'
          ],
          weekdaysShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
          weekdaysAbbrev: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
        }
      }
    );
    /* eslint-enable */
    /* eslint-disable */
    M.Datepicker.getInstance(this.$refs.datepicker).setDate(this.date);
    /* eslint-enable */

    this.accountId = this.orderedAccounts[0].id;
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
    fetchAccounts: call('accounts/fetch'),
    fetchProjects: call('projects/fetch'),
    fetchCategoires: call('categories/fetch'),
    create: call('transactions/create'),
    async submit() {
      if (this.isSubmitting) { return; }

      /* eslint-disable */
      const date = M.Datepicker.getInstance(this.$refs.datepicker).date;
      // console.log(moment(date).format().toString());
      /* eslint-enable */
      const { token, amount, isIncome, description, accountId, projectId, categoryIds } = this;
      const transaction = {
        amount,
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
    },
    // onSelect(date) {
    //   console.log('test');
    //   console.log(date);
    // },
    showAll() { this.isShowAllCategories = true; },
    hideAll() { this.isShowAllCategories = false; }
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
</style>
