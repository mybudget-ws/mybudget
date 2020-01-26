<template>
  <div>
    <Menu />
    <div class='container'>
      <div class='row'>
        <div class='col s12'>
          <PageHeader :name='header' />
          <h6
            v-if='!isWizardFinished'
            class='grey-text text-darken-1'
          >
            Чтобы начать создайте ваш основной счет
          </h6>
        </div>
      </div>

      <div class='row'>
        <form class='col l10 s12' @submit.prevent='submit'>
          <div class='row'>
            <div class='input-field col s8'>
              <input
                id='name'
                v-model='name'
                type='text'
                class='validate'
                autofocus
                required
              >
              <label for='name' class='active'>Название счета</label>
            </div>
            <div class='input-field col s4'>
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
          </div>
          <div class='row'>
            <div class='input-field col s8'>
              <input
                id='rest'
                v-model='rest'
                type='text'
                class='validate'
                pattern="[0-9,]+"
              >
              <label for='rest' class='active'>Текущий баланс</label>
              <span
                class='helper-text'
                data-error='Похоже, что это не число'
                data-success='Отлично'
              >
                Необязательно
              </span>
            </div>
            <div class='input-field col s4'>
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

          <Button
            text='Создать счет'
            :is-disabled='isSubmitting'
            :is-loading='isSubmitting'
            @click='submit'
          />
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
    color: 'grey',
    currency: 'RUB',
    isSubmitting: false
  }),
  computed: {
    colors: get('colors/items'),
    currencies: get('currencies/items'),
    isWizardFinished: get('user/isWizardFinished'),
    header() {
      return this.isWizardFinished ?
        'Новый счет' :
        'Ваш первый счет';
    }
  },
  async mounted() {
    await this.fetch();
    /* eslint-disable */
    this.selectCurrencies = M.FormSelect.init(this.$refs.selectCurrencies, {});
    M.updateTextFields();
    /* eslint-enable */

    await this.fetchColors();
    /* eslint-disable */
    this.selectColors = M.FormSelect.init(this.$refs.selectColors, {});
    M.updateTextFields();
    /* eslint-enable */
  },
  methods: {
    ...call([
      'currencies/fetch'
    ]),
    fetchColors: call('colors/fetch'),
    async submit() {
      this.isSubmitting = true;

      // const { name, rest } = this;
      // const isSuccess = await this.login({ email, password });
      // this.isSubmitting = isSuccess;
      // if (isSuccess) {
      //   this.$router.push('accounts');
      // }

      this.isSubmitting = false;
    }
  }
};
</script>

<style scoped lang='sass'>
</style>
