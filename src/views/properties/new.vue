<template>
  <div>
    <Menu />
    <div class='container container-wide'>
      <PageHeader name='Новое имущество' />

      <Loader v-if='isLoading' />
      <div v-else class='row'>
        <form class='col l10 s12' @submit.prevent='submit'>
          <div class='row'>
            <div class='input-field col l8 s12'>
              <input
                id='name'
                ref='name'
                v-model='name'
                type='text'
                class='validate'
                autofocus
                required
              >
              <label for='name' class='active'>Название</label>
            </div>
          </div>
          <div class='row'>
            <div
              class='input-field col l4 s12'
              :class='`color c-${color}`'
            >
              <select ref='selectColors' v-model='color' :class="{ 'browser-default': isPhone }">
                <option
                  v-for='color in colors'
                  :key='color.id'
                  :value='color.id'
                >
                  {{ color.name }}
                </option>
              </select>
              <label v-if='!isPhone'>Цвет</label>
            </div>
            <div class='input-field col l4 s12'>
              <select ref='selectKinds' v-model='kind' :class="{ 'browser-default': isPhone }">
                <option
                  v-for='kind in kinds'
                  :key='kind.value'
                  :value='kind.value'
                >
                  {{ kind.name }}
                </option>
              </select>
              <label v-if='!isPhone'>Тип</label>
            </div>
          </div>
          <div class='row'>
            <div class='input-field col l4 s12'>
              <input
                id='amount'
                ref='amount'
                v-model='amount'
                type='number'
                :class='{ "validate": !isPhone }'
                required
                @input='onChangeAmount'
              >
              <label for='amount' class='active'>{{ amountLable }}</label>
              <span class='helper-text'>
                В дальнейшем стоимость можно будет менять, для учета изменений в ценности имущества
              </span>
            </div>
            <div class='input-field col l4 s12'>
              <select ref='selectCurrencies' v-model='currency' :class="{ 'browser-default': isPhone }">
                <option
                  v-for='curr in currencies'
                  :key='curr.id'
                  :value='curr.name'
                >
                  {{ curr.name }}
                </option>
              </select>
              <label v-if='!isPhone'>Валюта</label>
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
              to='/properties'
              class='btn-floating btn-large waves-effect waves-light grey lighten-2 z-depth-0'
            >
              <i class='material-icons grey-text text-darken-1' style='font-size: 2rem'>close</i>
            </router-link>
          </div>
          <div v-else class='row'>
            <div class='col'>
              <Button
                text='Создать имущество'
                :is-disabled='isSubmitting'
                :is-loading='isSubmitting'
                @click='submit'
              />
            </div>
            <div class='col'>
              <router-link to='/properties' class='btn-flat btn-large'>
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
import PageHeader from '@/components/page_header';
import { get, call } from 'vuex-pathify';

import MobileDetect from 'mobile-detect';
const md = new MobileDetect(window.navigator.userAgent);

export default {
  name: 'NewProperty',
  components: {
    Button,
    Menu,
    PageHeader
  },
  props: {},
  data: () => ({
    name: '',
    amount: '0',
    color: 'blue',
    kind: 'realty',
    currency: 'RUB',

    isLoading: true,
    isPhone: md.phone() != null
  }),
  computed: {
    token: get('user/token'),
    colors: get('colors/items'),
    kinds: get('properties/kinds'),
    currencies: get('currencies/items'),
    defaultCurrency: get('user/defaultCurrency'),
    isSubmitting: get('properties/isSubmitting'),
    amountLable() {
      return `Текущая стоимость, ${this.currency}`;
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
      this.selectColors = M.FormSelect.init(this.$refs.selectColors, {});
      M.updateTextFields();

      this.selectKinds = M.FormSelect.init(this.$refs.selectKinds, {});
      M.updateTextFields();

      this.selectCurrencies = M.FormSelect.init(this.$refs.selectCurrencies, {});
      M.updateTextFields();
      /* eslint-enable */

      this.$refs.name.focus();
    });
  },
  methods: {
    fetchProfile: call('user/fetchProfile'),
    fetchCurrencies: call('currencies/fetch'),
    fetchColors: call('colors/fetch'),
    create: call('properties/create'),
    onChangeAmount(_e) {
      this.amount = this.amount.replace(/[^0-9,.+-/*\s]/g, '');
    },
    async submit() {
      if (this.isSubmitting) { return; }

      const { name, color, token, kind, currency, amount } = this;
      if (name === '' || amount === '') { return; }

      const property = { name, color, kind, currency, amount };
      const isSuccess = await this.create({ token, property });
      if (isSuccess != null) {
        this.$router.push({ name: 'properties' });
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

  @media only screen and (max-width: 601px)
    &:before
      margin-top: 0
      width: 12px
      height: 3rem

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
