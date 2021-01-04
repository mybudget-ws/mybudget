<template>
  <div>
    <Menu />
    <div class='container container-wide'>
      <PageHeader name='Редактирование' />

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
            <div class='input-field col l3 s12'>
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
            <div class='input-field col l3 s12'>
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
                text='Изменить'
                :is-disabled='isSubmitting'
                :is-loading='isSubmitting'
                @click='submit'
              />
            </div>
            <router-link :to='backPath' class='btn-flat btn-large'>
              Отмена
            </router-link>
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
import api from '@/api';
import { get, call } from 'vuex-pathify';

import MobileDetect from 'mobile-detect';
const md = new MobileDetect(window.navigator.userAgent);

export default {
  name: 'EditAccount',
  components: {
    Button,
    Loader,
    Menu,
    PageHeader
  },
  props: {},
  data: () => ({
    name: '',
    color: '',
    currency: '',
    kind: '',

    isLoading: true,
    isSubmitting: false,
    isPhone: md.phone() != null
  }),
  computed: {
    token: get('user/token'),
    defaultCurrency: get('user/defaultCurrency'),
    colors: get('colors/items'),
    currencies: get('currencies/items'),
    kinds: get('accounts/kinds'),
    id() { return this.$route.params.id; },
    backPath() {
      if (this.$route.query.backTo) { return this.$route.query.backTo; }
      return '/accounts';
    }
  },
  async mounted() {
    const account = await api.account(this.token, { id: this.id });
    this.name = account.name;
    this.color = account.color;
    this.currency = account.currency.name;
    this.kind = account.kind;

    await this.fetchCurrencies({ base: this.currency });
    await this.fetchColors();
    this.isLoading = false;

    /* eslint-disable */
    this.$nextTick(() => {
      this.selectCurrencies = M.FormSelect.init(this.$refs.selectCurrencies, {});
      M.updateTextFields();

      this.selectColors = M.FormSelect.init(this.$refs.selectColors, {});
      M.updateTextFields();

      this.selectKinds = M.FormSelect.init(this.$refs.selectKinds, {});
      M.updateTextFields();

      this.$refs.name.focus();
    });
    /* eslint-enable */
  },
  methods: {
    fetchCurrencies: call('currencies/fetch'),
    fetchColors: call('colors/fetch'),
    async submit() {
      if (this.isSubmitting) { return; }

      this.isSubmitting = true;
      const { id, name, color, kind, currency } = this;
      const isSuccess = await api.updateAccount(
        this.token,
        { id, name, color, kind, currency }
      );
      if (isSuccess != null) {
        this.$router.push({ path: this.backPath }).catch(_e => {});
      } else {
        alert('Error');
      }
      this.isSubmitting = false;
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
