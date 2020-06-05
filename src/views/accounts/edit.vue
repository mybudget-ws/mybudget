<template>
  <div>
    <Menu />
    <div class='container container-wide'>
      <PageHeader name='Редактирование счета' />

      <div class='row'>
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
              <label for='name' class='active'>Название счета</label>
            </div>
          </div>
          <div class='row'>
            <div
              class='input-field col l4 s12'
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
            <div class='input-field col l4 s12'>
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

          <div class='row'>
            <div class='col'>
              <Button
                text='Изменить'
                :is-disabled='isSubmitting'
                :is-loading='isSubmitting'
                @click='submit'
              />
            </div>
            <router-link to='/accounts' class='btn-flat btn-large'>
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
import Menu from '@/components/menu';
import PageHeader from '@/components/page_header';
import api from '@/api';
import { get, call } from 'vuex-pathify';

export default {
  name: 'EditAccount',
  components: {
    Button,
    Menu,
    PageHeader
  },
  props: {},
  data: () => ({
    name: '',
    color: '',
    currency: '',
    isLoading: true,
    isSubmitting: false
  }),
  computed: {
    token: get('user/token'),
    colors: get('colors/items'),
    currencies: get('currencies/items'),
    id() { return this.$route.params.id; }
  },
  async mounted() {
    const account = await api.account(this.token, { id: this.id });
    this.isLoading = false;
    this.name = account.name;
    this.color = account.color;
    this.currency = account.currency.name;

    await this.fetchCurrencies();
    /* eslint-disable */
    this.selectCurrencies = M.FormSelect.init(this.$refs.selectCurrencies, {});
    M.updateTextFields();
    /* eslint-enable */

    await this.fetchColors();
    /* eslint-disable */
    this.selectColors = M.FormSelect.init(this.$refs.selectColors, {});
    M.updateTextFields();
    /* eslint-enable */

    this.$refs.name.focus();
  },
  methods: {
    fetchCurrencies: call('currencies/fetch'),
    fetchColors: call('colors/fetch'),
    async submit() {
      if (this.isSubmitting) { return; }

      const { id, name, color, currency } = this;
      const isSuccess = await api.updateAccount(
        this.token,
        { id, name, color, currency }
      );
      if (isSuccess != null) {
        this.$router.push({ name: 'accounts' }).catch(_e => {});
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
</style>
