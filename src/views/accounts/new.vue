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
            <div class='input-field col l4 s12'>
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
            <div class='input-field col l3 s12'>
              <input
                id='rest'
                v-model='rest'
                type='text'
                class='validate'
                pattern="[0-9,]+"
              >
              <label for='rest' class='active'>Текущий баланс, {{ currency }}</label>
              <span
                class='helper-text'
                data-error='Похоже, что это не число'
                data-success='Отлично'
              >
                Необязательно
              </span>
            </div>
          </div>

          <div class='row'>
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
import Menu from '@/components/menu';
import PageHeader from '@/components/page_header';
import { get, call } from 'vuex-pathify';

export default {
  name: 'Accounts',
  components: {
    Button,
    Menu,
    PageHeader
  },
  props: {},
  data: () => ({
    name: 'Наличные',
    rest: '0',
    color: 'light-blue',
    currency: 'RUB'
  }),
  computed: {
    token: get('user/token'),
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
    create: call('accounts/create'),
    async submit() {
      if (this.isSubmitting) { return; }

      const { name, color, currency, rest, token } = this;
      const account = { name, color, currency, rest };
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
</style>
