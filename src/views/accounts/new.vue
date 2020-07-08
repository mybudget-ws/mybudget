<template>
  <div>
    <Menu />
    <div class='container container-wide'>
      <PageHeader :name='header' />
      <div v-if='isFirst' class='row'>
        <h6 class='grey-text text-darken-1 col s12'>
          Чтобы начать создайте ваш основной счет
        </h6>
      </div>

      <Loader v-if='isLoading' />
      <div v-else class='row'>
        <form class='col l10 s12' @submit.prevent='submit'>
          <div class='row'>
            <div class='input-field col l9 s12'>
              <input
                id='name'
                ref='name'
                v-model='name'
                type='text'
                class='validate'
                autofocus
                required
              >
              <label for='name' class='active'>Название счета</label>
            </div>
          </div>
          <div class='row'>
            <div
              class='input-field col l3 s12'
              :class='`color c-${color}`'
            >
              <select ref='selectColors' v-model='color'>
                <option
                  v-for='color in colors'
                  :key='color.id'
                  :value='color.id'
                >
                  {{ color.name }}
                </option>
              </select>
              <label>Цвет</label>
            </div>
            <div class='input-field col l3 s12'>
              <select ref='selectCurrencies' v-model='currency'>
                <option
                  v-for='curr in currencies'
                  :key='curr.id'
                  :value='curr.name'
                >
                  {{ curr.name }}
                </option>
              </select>
              <label>Валюта</label>
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
              to='/accounts'
              class='btn-floating btn-large waves-effect waves-light grey lighten-2 z-depth-0'
            >
              <i class='material-icons grey-text text-darken-1' style='font-size: 2rem'>close</i>
            </router-link>
          </div>
          <div v-else class='row'>
            <div class='col'>
              <Button
                text='Создать счет'
                :is-disabled='isSubmitting'
                :is-loading='isSubmitting'
                @click='submit'
              />
            </div>
            <div v-if='!isFirst' class='col'>
              <router-link to='/accounts' class='btn-flat btn-large'>
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

import MobileDetect from 'mobile-detect';
const md = new MobileDetect(window.navigator.userAgent);

export default {
  name: 'Accounts',
  components: {
    Button,
    Loader,
    Menu,
    PageHeader
  },
  props: {},
  data: () => ({
    name: 'Наличные',
    color: 'light-blue lighten-2',
    currency: 'RUB',

    isLoading: true,
    isPhone: md.phone() != null
  }),
  computed: {
    token: get('user/token'),
    defaultCurrency: get('user/defaultCurrency'),
    colors: get('colors/items'),
    currencies: get('currencies/items'),
    isSubmitting: get('accounts/isSubmitting'),
    isFirst() {
      return this.$route.query.first === 'true';
    },
    header() {
      return this.isFirst ?
        'Ваш первый счет' :
        'Новый счет';
    }
  },
  async mounted() {
    await this.fetchProfile();
    this.currency = this.defaultCurrency;
    await this.fetchCurrencies({ base: this.defaultCurrency });
    await this.fetchColors();
    this.isLoading = false;

    /* eslint-disable */
    this.$nextTick(() => {
      this.selectCurrencies = M.FormSelect.init(this.$refs.selectCurrencies, {});
      M.updateTextFields();

      this.selectColors = M.FormSelect.init(this.$refs.selectColors, {});
      M.updateTextFields();

      this.$refs.name.focus();
    });
    /* eslint-enable */
  },
  methods: {
    fetchProfile: call('user/fetchProfile'),
    fetchCurrencies: call('currencies/fetch'),
    fetchColors: call('colors/fetch'),
    create: call('accounts/create'),
    async submit() {
      if (this.isSubmitting) { return; }

      const { name, color, currency, token } = this;
      const account = { name, color, currency };
      const isSuccess = await this.create({ token, account });
      if (isSuccess != null) {
        this.$router.push({ name: 'accounts' });
      } else {
        alert('Error');
      }
    }
  }
};
</script>

<style scoped lang='sass'>
.color
  &:before
    position: absolute
    width: 8px
    height: 2.65rem
    content: ''
    margin-left: -14px
    margin-top: 6px
    border-radius: 2px

  &.c-red
    &:before
      background-color: #f44336

  &.c-pink
    &:before
      background-color: #e91e63

  &.c-purple
    &:before
      background-color: #9c27b0

  &.c-deep-purple
    &:before
      background-color: #673ab7

  &.c-indigo
    &:before
      background-color: #3f51b5

  &.c-blue
    &:before
      background-color: #2196f3

  &.c-light-blue.lighten-2
    &:before
      background-color: #4fc3f7

  &.c-cyan
    &:before
      background-color: #00bcd4

  &.c-teal
    &:before
      background-color: #009688

  &.c-green
    &:before
      background-color: #4caf50

  &.c-light-green
    &:before
      background-color: #8bc34a

  &.c-lime
    &:before
      background-color: #cddc39

  &.c-yellow
    &:before
      background-color: #ffeb3b

  &.c-amber
    &:before
      background-color: #ffc107

  &.c-orange
    &:before
      background-color: #ff9800

  &.c-deep-orange
    &:before
      background-color: #ff5722

  &.c-brown
    &:before
      background-color: #795548

  &.c-grey
    &:before
      background-color: #9e9e9e

  &.c-blue-grey
    &:before
      background-color: #607d8b

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
