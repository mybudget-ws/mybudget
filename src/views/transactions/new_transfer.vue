<template>
  <div>
    <Menu />
    <div class='container container-wide'>
      <PageHeader name='Новый перевод' cover='transfer' />

      <Loader v-if='isLoading' />
      <div v-else-if='isAlert' class='card blue-grey'>
        <div class='card-content white-text'>
          <span class='card-title'>На данный момент у вас меньше двух счетов</span>
          <p>
            Чтобы создать перевод средств со счета на счет
            нужно как минимум два счета.
            Создать новый счет можно на странице списка счетов.
          </p>
        </div>
        <div class='card-action'>
          <a href='/#/accounts'>Перейти к списку счетов</a>
        </div>
      </div>
      <div v-else class='row'>
        <form class='col l12 s12' @submit.prevent='submit'>
          <div class='row'>
            <div v-if='isPhone' class='col l4 s12'>
              <label>Со счета</label>
              <select
                ref='selectSrcAccounts'
                v-model='accountIdSrc'
                class='browser-default'
                @change='onChangeAccountSrc'
              >
                <option v-for='v in orderedAccounts' :key='v.id' :value='v.id'>
                  {{ v.name }}
                </option>
              </select>
            </div>
            <div v-else class='input-field col l4 s12'>
              <select
                ref='selectSrcAccounts'
                v-model='accountIdSrc'
                @change='onChangeAccountSrc'
              >
                <option v-for='v in orderedAccounts' :key='v.id' :value='v.id'>
                  {{ v.name }}
                </option>
              </select>
              <label>Со счета</label>
            </div>

            <div v-if='isPhone' class='col l4 s12'>
              <label>На счет</label>
              <select
                ref='selectDstAccounts'
                v-model='accountIdDst'
                class='browser-default'
                @change='onChangeAccountDst'
              >
                <option v-for='v in orderedAccounts' :key='v.id' :value='v.id'>
                  {{ v.name }}
                </option>
              </select>
            </div>
            <div v-else class='input-field col l4 s12'>
              <select
                ref='selectDstAccounts'
                v-model='accountIdDst'
                @change='onChangeAccountDst'
              >
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
                :type='isPhone ? "number" : "text"'
                :class='{ "validate": !isPhone }'
                required
                @focus='$event.target.select()'
                @input='onChangeSrcAmount'
              >
              <label for='name' class='active'>{{ amountLableSrc }}</label>
              <span
                class='helper-text'
                data-error='Похоже, что это не число'
                data-success=''
              />
            </div>
            <div class='input-field col l4 s12'>
              <input
                id='amountDst'
                ref='amountDst'
                v-model='amountDst'
                :type='isPhone ? "number" : "text"'
                class='validate'
                pattern='[0-9,.+-/*\s]+'
                required
                @focus='$event.target.select()'
                @input='onChangeDstAmount'
              >
              <label for='name' class='active'>{{ amountLableDst }}</label>
              <span
                class='helper-text'
                data-error='Похоже, что это не число'
                data-success=''
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
              <FastDates
                :selected-date='date'
                @select='setSelectedDate'
              />
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
                text='Новый перевод'
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
import DateFormat from '@/utils/date_format';
import FastDates from '@/components/transactions/fast_dates';
import Loader from '@/components/loader';
import Menu from '@/components/menu';
import PageHeader from '@/components/page_header';
import { get, call } from 'vuex-pathify';

import MobileDetect from 'mobile-detect';
const md = new MobileDetect(window.navigator.userAgent);

// const moment = require('moment/min/moment-with-locales');
const moment = require('moment');
moment.locale('ru');

export default {
  name: 'NewTransaction',
  components: {
    Button,
    FastDates,
    Loader,
    Menu,
    PageHeader
  },
  props: {},
  data: () => ({
    amountSrc: '0',
    amountDst: '0',
    date: new Date(),
    description: '',
    accountIdSrc: '',
    accountIdDst: '',

    isPhone: md.phone() != null,
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
    isAlert() {
      return this.isAccountsLoaded &&
        !this.isAccountsLoading &&
        this.accounts.length < 2;
    },
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
    orderedAccounts() {
      return [
        ...this.accounts.filter(v => v.isFavourite),
        ...this.accounts.filter(v => !v.isFavourite)
      ];
    },
    backPath() {
      if (this.$route.query.backTo) { return this.$route.query.backTo; }
      return '/transactions';
    }
  },
  async mounted() {
    if (!this.isAccountsLoaded) { await this.fetchAccounts(this.token); }

    if (!this.isAlert) {
      /* eslint-disable */
      this.$nextTick(() => {
        M.Datepicker.init(
          this.$refs.datepicker,
          DateFormat.datePickerInitData(this.date, this.onSelectDate)
        );
        // M.Datepicker.getInstance(this.$refs.datepicker).setDate(this.date);
      });
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
        } else if (this.$route.query.accountIdDst) {
          this.accountIdDst = this.orderedAccounts
            .find(v => v.id == this.$route.query.accountIdDst)?.id ||
              this.orderedAccounts[0].id;
          this.accountIdSrc = this.orderedAccounts
            .filter(v => v.id != this.accountIdDst)[0].id;
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
    }
  },
  methods: {
    fetchAccounts: call('accounts/fetchFilter'),
    create: call('transactions/createTransfer'),
    onSelectDate(value) {
      this.date = new Date(value);
    },
    setSelectedDate(value) {
      this.date = new Date(value);
      /* eslint-disable */
      this.$nextTick(() => {
        const instance = M.Datepicker.getInstance(this.$refs.datepicker);
        instance.setDate(this.date);
        instance.setInputValue();
      });
      /* eslint-enable */
    },
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
      const evalAmountSrc = amountSrc
        .replace(/,/g, '.')
        .replace(/\s/g, '')
        .replace(/([.])\1+/g, '$1');
      const evalAmountDst = amountDst
        .replace(/,/g, '.')
        .replace(/\s/g, '')
        .replace(/([.])\1+/g, '$1');
      if (evalAmountSrc == null) { return; }
      if (evalAmountDst == null) { return; }

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
        this.$router.push({ path: this.backPath });
      } else {
        alert('Error');
      }
    },
    onChangeSrcAmount(_e) {
      if (this.selectedAccountSrc == null) { return; }
      if (this.selectedAccountDst == null) { return; }

      if (this.selectedAccountSrc.currency.name != this.selectedAccountDst.currency.name) {
        return;
      }

      this.amountSrc = this.amountSrc.replace(/[^0-9,.+-/*\s]/g, '');
      this.amountDst = this.amountSrc;
    },
    onChangeDstAmount(_e) {
      this.amountDst = this.amountDst.replace(/[^0-9,.+-/*\s]/g, '');
    },
    onChangeAccountSrc(_e) {
      if (this.accountIdSrc === this.accountIdDst) {
        this.accountIdDst = this.orderedAccounts
          .find(v => v.id !== this.accountIdSrc)?.id || this.accountIdDst;
        this.$nextTick(() => {
          /* eslint-disable */
          M.FormSelect.init(this.$refs.selectDstAccounts, {});
          /* eslint-enable */
        });
      }
    },
    onChangeAccountDst(_e) {
      if (this.accountIdSrc === this.accountIdDst) {
        this.accountIdSrc = this.orderedAccounts
          .find(v => v.id !== this.accountIdDst)?.id || this.accountIdSrc;
        this.$nextTick(() => {
          /* eslint-disable */
          M.FormSelect.init(this.$refs.selectSrcAccounts, {});
          /* eslint-enable */
        });
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

form
  @media only screen and (max-width: 601px)
    padding-bottom: 2rem !important

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
