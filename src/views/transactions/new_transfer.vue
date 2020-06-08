<template>
  <div>
    <Menu />
    <div class='container container-wide'>
      <PageHeader name='Новый перевод' cover='transfer' />

      <Loader v-if='isLoading' />
      <div v-else class='row'>
        <form class='col l12 s12' @submit.prevent='submit'>
          <div class='row'>
            <div class='input-field col l4 s12'>
              <select ref='selectSrcAccounts' v-model='accountIdSrc'>
                <option v-for='v in orderedAccounts' :key='v.id' :value='v.id'>
                  {{ v.name }}
                </option>
              </select>
              <label>Со счета</label>
            </div>

            <div class='input-field col l4 s12'>
              <select ref='selectDstAccounts' v-model='accountIdDst'>
                <option v-for='v in orderedAccounts' :key='v.id' :value='v.id'>
                  {{ v.name }}
                </option>
              </select>
              <label>На счет</label>
            </div>
          </div>
          <div class='row'>
            <div class='input-field col l4 s12'>
              <input
                id='amountSrc'
                ref='amountSrc'
                v-model='amountSrc'
                type='text'
                class='validate'
                pattern='[0-9,+-/*]+'
                required
                @focus='$event.target.select()'
                @input='srcChange($event.target.value)'
              >
              <label for='name' class='active'>{{ amountLableSrc }}</label>
              <span
                class='helper-text'
                data-error='Похоже, что это не число'
                data-success='Отлично'
              />
            </div>
            <div class='input-field col l4 s12'>
              <input
                id='amountDst'
                ref='amountDst'
                v-model='amountDst'
                type='text'
                class='validate'
                pattern='[0-9,+-/*]+'
                required
                @focus='$event.target.select()'
              >
              <label for='name' class='active'>{{ amountLableDst }}</label>
              <span
                class='helper-text'
                data-error='Похоже, что это не число'
                data-success='Отлично'
              />
            </div>
          </div>

          <div class='row'>
            <div class='input-field col l4 s12'>
              <input
                id='date'
                ref='datepicker'
                type='text'
                class='datepicker'
              >
              <label for='date' class='active'>Дата</label>
            </div>
            <div class='col l4 s12'>
              <div class='row'>
                <div class='input-field col s12'>
                  <input
                    id='description'
                    v-model='description'
                    type='text'
                  >
                  <label for='name' class='active'>Комментарий</label>
                </div>
              </div>
            </div>
          </div>

          <div class='row'>
            <div class='col'>
              <Button
                text='Новый перевод'
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
import Loader from '@/components/loader';
import Menu from '@/components/menu';
import PageHeader from '@/components/page_header';
import { get, call } from 'vuex-pathify';

// const moment = require('moment/min/moment-with-locales');
const moment = require('moment');
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
    amountSrc: 0,
    amountDst: 0,
    date: new Date(),
    description: '',
    accountIdSrc: '',
    accountIdDst: '',

    datepicker: null
  }),
  computed: {
    token: get('user/token'),
    accounts: get('accounts/visibleItemsFilter'),
    selectedAccounts: get('filters/accounts'),

    isAccountsLoading: get('accounts/isLoadingFilter'),
    isAccountsLoaded: get('accounts/isLoadedFilter'),

    isSubmitting: get('transactions/isSubmitting'),

    isLoading() { return this.isAccountsLoading; },
    amountLableSrc() {
      return `Величина (источник), ${this.selectedAccountSrc?.currency?.name}`;
    },
    amountLableDst() {
      return `Величина (получатель), ${this.selectedAccountDst?.currency?.name}`;
    },
    selectedAccountSrc() {
      return this.accounts.find(v => v.id === this.accountIdSrc);
    },
    selectedAccountDst() {
      return this.accounts.find(v => v.id === this.accountIdDst);
    },
    isNotReadyToAdd() {
      return this.isAccountsLoaded &&
        !this.isAccountsLoading &&
        this.accounts.length === 0;
    },
    orderedAccounts() {
      return [
        ...this.accounts.filter(v => v.isFavourite),
        ...this.accounts.filter(v => !v.isFavourite)
      ];
    }
  },
  async mounted() {
    if (!this.isAccountsLoaded) { await this.fetchAccounts(this.token); }
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
    /* eslint-enable */
    /* eslint-disable */
    M.Datepicker.getInstance(this.$refs.datepicker).setDate(this.date);
    /* eslint-enable */

    if (this.selectedAccounts.length > 0) {
      this.accountIdSrc = this.selectedAccounts[0].id;
      this.accountIdDst = this.orderedAccounts
        .filter(v => v.id != this.accountIdSrc)[0].id;
    } else {
      if (this.$route.query.accountIdSrc) {
        this.accountIdSrc = this.orderedAccounts
          .find(v => v.id == this.$route.query.accountIdSrc)?.id ||
            this.orderedAccounts[0].id;

        this.accountIdDst = this.orderedAccounts
          .filter(v => v.id != this.accountIdSrc)[0].id;
      } else {
        this.accountIdSrc = this.orderedAccounts[0].id;
        this.accountIdDst = this.orderedAccounts[1].id;
      }
    }
    this.$nextTick(() => {
      /* eslint-disable */
      M.FormSelect.init(this.$refs.selectSrcAccounts, {});
      M.FormSelect.init(this.$refs.selectDstAccounts, {});
      M.updateTextFields();
      /* eslint-enable */
    });
  },
  methods: {
    fetchAccounts: call('accounts/fetchFilter'),
    create: call('transactions/createTransfer'),
    async submit() {
      if (this.isSubmitting) { return; }

      /* eslint-disable */
      const date = M.Datepicker.getInstance(this.$refs.datepicker).date;
      /* eslint-enable */
      const {
        token,
        amountSrc,
        amountDst,
        accountIdSrc,
        accountIdDst,
        description
      } = this;
      const evalAmountSrc = amountSrc.replace(/,/g, '.').replace(/\s/g, '').replace(/([.])\1+/g, '$1');
      const evalAmountDst = amountDst.replace(/,/g, '.').replace(/\s/g, '').replace(/([.])\1+/g, '$1');
      const transfer = {
        amountSrc: evalAmountSrc,
        amountDst: evalAmountDst,
        date: moment(date).format(),
        accountIdSrc,
        accountIdDst,
        description
      };
      const isSuccess = await this.create({ token, transfer });
      if (isSuccess != null) {
        this.$router.push({ name: 'transactions' });
      } else {
        alert('Error');
      }
    },
    srcChange(value) {
      if (this.selectedAccountSrc == null) { return; }
      if (this.selectedAccountDst == null) { return; }

      if (this.selectedAccountSrc.currency.name != this.selectedAccountDst.currency.name) {
        return;
      }

      this.amountDst = value;
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
