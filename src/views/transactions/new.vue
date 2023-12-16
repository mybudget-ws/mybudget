<template>
  <div>
    <Menu />
    <div class='container container-wide'>
      <PageHeader
        :name='isIncome ? "Новый доход" : "Новый расход"'
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
              <label for='amount' class='active'>{{ amountLable }}</label>
              <span
                v-if='!isPhone'
                class='helper-text'
                data-error='Похоже, что это не число'
                data-success=''
              >
                Например 20.4 или 10 + 3 * 2
              </span>
            </div>
            <div class='input-field col l4 s12'>
              <select ref='selectAccounts' v-model='accountId' :class='{ "browser-default": isPhone }'>
                <option v-for='v in orderedAccounts' :key='v.id' :value='v.id'>
                  {{ v.name }}
                  <!--span v-if='v.isFavourite' class='right'>
                    <i class='material-icons yellow-text text-accent-4'>star</i>
                  </span-->
                </option>
              </select>
              <label v-if='!isPhone'>Счет</label>
              <TopAccounts
                :accounts='orderedAccounts'
                :account-id='accountId'
                @select='selectTopAccount'
              />
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
            <div v-if='isPhone' class='input-field col s12'>
              <input
                id='description'
                v-model='description'
                type='text'
              >
              <label for='description'>Комментарий</label>
            </div>
            <Categories
              class='categories col l4 s12'
              :ids='categoryIds'
              @change='onSelectCategory'
            />
            <div class='col l8 s12'>
              <div class='row'>
                <div v-if='!isPhone' class='input-field col s12'>
                  <input
                    id='description'
                    v-model='description'
                    type='text'
                  >
                  <label for='description'>Комментарий</label>
                </div>
                <div v-if='isProjects' class='col l6 s12' :class='{ "input-field": !isPhone }'>
                  <label v-if='isPhone'>Проект</label>
                  <select ref='selectProjects' v-model='projectId' :class='{ "browser-default": isPhone }'>
                    <option value='' selected><span class='grey-text'>Нет</span></option>
                    <option v-for='project in projects' :key='project.id' :value='project.id'>
                      {{ project.name }}
                    </option>
                  </select>
                  <label v-if='!isPhone'>Проект</label>
                </div>
                <div v-if='isProperties' class='col l6 s12' :class='{ "input-field": !isPhone }'>
                  <label v-if='isPhone'>Имущество</label>
                  <select ref='selectProperties' v-model='propertyId' :class='{ "browser-default": isPhone }'>
                    <option value='' selected>Нет</option>
                    <option v-for='property in properties' :key='property.id' :value='property.id'>
                      {{ property.name }}
                    </option>
                  </select>
                  <label v-if='!isPhone'>Имущество</label>
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
              :to='backPath'
              class='btn-floating btn-large waves-effect waves-light grey lighten-2 z-depth-0'
            >
              <i class='material-icons grey-text text-darken-1' style='font-size: 2rem'>close</i>
            </router-link>
          </div>
          <div v-else class='row'>
            <div class='col'>
              <Button
                :text='submitText'
                :is-disabled='isSubmitting'
                :is-loading='isSubmitting'
                @click='submit'
              />
            </div>
            <div class='col'>
              <router-link :to='backPath' class='btn-flat btn-large'>
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
import DateFormat from '@/utils/date_format';
import Loader from '@/components/loader';
import Menu from '@/components/menu';
import PageHeader from '@/components/page_header';
import TopAccounts from '@/components/transactions/top_accounts';
import delay from 'delay';
import { get, call } from 'vuex-pathify';

import MobileDetect from 'mobile-detect';
const md = new MobileDetect(window.navigator.userAgent);

const moment = require('moment');
moment.locale('ru');

export default {
  name: 'NewTransaction',
  components: {
    Button,
    Categories,
    Menu,
    Loader,
    PageHeader,
    TopAccounts
  },
  props: {},
  data: () => ({
    amount: '',
    date: new Date(),
    description: '',
    accountId: '',
    projectId: '',
    propertyId: '',
    isIncome: false,
    categoryIds: [],
    isSubmitting: false,

    isPhone: md.phone() != null,
    datepicker: null
  }),
  computed: {
    token: get('user/token'),
    accounts: get('accounts/visibleItemsFilter'),
    projects: get('projects/visibleItemsFilter'),
    properties: get('properties/visibleItemsFilter'),
    filterAccounts: get('filters/accounts'),
    filterCategories: get('filters/categories'),
    filterProjects: get('filters/projects'),
    filterProperties: get('filters/properties'),

    isAccountsLoading: get('accounts/isLoadingFilter'),
    isAccountsLoaded: get('accounts/isLoadedFilter'),
    isProjectsLoading: get('projects/isLoadingFilter'),
    isProjectsLoaded: get('projects/isLoadedFilter'),
    isPropertiesLoaded: get('properties/isLoadedFilter'),

    isLoading() { return this.isAccountsLoading || this.isProjectsLoading; },
    submitText() { return this.isIncome ? 'Создать доход' : 'Создать расход'; },
    amountLable() {
      return `Величина, ${this.selectedAccount?.currency?.name}`;
    },
    selectedAccount() {
      return this.accounts.find(
        v => v.id === this.accountId || v.id.toString() === this.accountId
      );
    },
    isNotReadyToAdd() {
      return this.isAccountsLoaded &&
        !this.isAccountsLoading &&
        this.accounts.length === 0;
    },
    isProjects() { return this.isProjectsLoaded && this.projects.length > 0; },
    isProperties() { return this.isPropertiesLoaded && this.properties.length > 0; },
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
    initAccountId() { return this.$route.query.account; },
    initProjectId() { return this.$route.query.project; },
    initPropertyId() { return this.$route.query.property; },
    initCategoryIds() {
      if (this.$route.query.category == null) { return; }
      if (this.$route.query.category == '') { return; }
      return this.$route.query.category.split(',').map(v => parseInt(v));
    },
    backPath() {
      if (this.$route.query.backTo) { return this.$route.query.backTo; }
      return '/transactions';
    }
  },
  async created() {
    this.categoryIds = this.initCategoryIds ||
      this.filterCategories.map(v => v.id);
    this.description = this.$route.query.description;
    this.isIncome = this.$route.query.isIncome == 'true';
    this.amount = this.$route.query.amount ||
      (this.isPhone ? '' : '0');
  },
  async mounted() {
    try {
      if (!this.isAccountsLoaded) { await this.fetchAccounts(this.token); }
      if (!this.isProjectsLoaded) { await this.fetchProjects(this.token); }
      if (!this.isPropertiesLoaded) { await this.fetchProperties(this.token); }
    } catch {
      /* eslint-disable */ M.toast({ html: 'Непредвиденная ошибка' }); /* eslint-enable */
    }
    if (this.isNotReadyToAdd) {
      this.$router.push({ name: 'new_account', query: { first: true } });
    }

    /* eslint-disable */
    this.$nextTick(() => {
      M.Datepicker.init(
        this.$refs.datepicker,
        DateFormat.datePickerInitData(this.date)
      );
      M.Datepicker.getInstance(this.$refs.datepicker).setDate(this.date);
    });
    /* eslint-enable */

    this.accountId = this.initAccountId || this.defaultAccountId;
    this.isIncome = this.$route.query.isIncome == 'true';

    this.$nextTick(() => {
      /* eslint-disable */
      M.FormSelect.init(this.$refs.selectAccounts, {});
      M.updateTextFields();
      /* eslint-enable */
    });
    if (this.isProjects) {
      this.projectId = this.initProjectId ||
        this.filterProjects.map(v => v.id)[0] ||
        '';
      this.$nextTick(() => {
        /* eslint-disable */
        M.FormSelect.init(this.$refs.selectProjects, {});
        M.updateTextFields();
        /* eslint-enable */
      });
    }
    if (this.isProperties) {
      this.propertyId = this.initPropertyId ||
        this.filterProperties.map(v => v.id)[0] ||
        '';
      this.$nextTick(() => {
        /* eslint-disable */
        M.FormSelect.init(this.$refs.selectProperties, {});
        M.updateTextFields();
        /* eslint-enable */
      });
    }
    this.$refs.amount.select();
    this.$refs.amount.focus();
  },
  methods: {
    fetchAccounts: call('accounts/fetchFilter'),
    fetchProjects: call('projects/fetchFilter'),
    fetchProperties: call('properties/fetchFilter'),
    create: call('transactions/create'),
    onSelectCategory(ids) { this.categoryIds = ids; },
    onChangeAmount(_e) {
      this.amount = this.amount.replace(/[^0-9,.+-/*\s]/g, '');
    },
    selectTopAccount(id) {
      this.accountId = id;
      this.$nextTick(() => {
        /* eslint-disable */
        M.FormSelect.init(this.$refs.selectAccounts, {});
        M.updateTextFields();
        /* eslint-enable */
      });
    },
    async submit() {
      if (this.isSubmitting) { return; }

      this.isSubmitting = true;
      /* eslint-disable */
      const date = M.Datepicker.getInstance(this.$refs.datepicker).date;
      /* eslint-enable */
      const {
        token,
        amount,
        isIncome,
        description,
        accountId,
        categoryIds,
        projectId,
        propertyId
      } = this;

      let evalAmount = undefined;
      try {
        evalAmount = eval(
          amount.replace(/,/g, '.').replace(/\s/g, '').replace(/([.])\1+/g, '$1')
        );
        evalAmount = Math.round(evalAmount * 100) / 100;
      } catch {
        /* eslint-disable */ M.toast({ html: 'Ошибка в выражении' }); /* eslint-enable */
        await delay(100); // Избегаем двойного отображения ошибки.
        this.isSubmitting = false;
      }
      if (evalAmount == undefined) { return; }

      const transaction = {
        amount: (evalAmount === Infinity ? 0 : evalAmount).toString(),
        isIncome,
        date: moment(date).format(),
        categoryIds,
        description,
        accountId,
        projectId,
        propertyId
      };
      const isSuccess = await this.create({ token, transaction });
      this.isSubmitting = false;
      if (isSuccess != null) {
        this.$router.push({ path: this.backPath }).catch(_e => {});
      } else {
        /* eslint-disable */ M.toast({ html: 'Непредвиденная ошибка' }); /* eslint-enable */
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

select.browser-default
  margin-bottom: 1em

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
