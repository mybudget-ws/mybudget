<template>
  <div>
    <Menu />
    <div class='container'>
      <div class='row'>
        <div class='col s12'>
          <PageHeader name='Новая операция' />
        </div>
      </div>

      <div class='row'>
        <form class='col l10 s12' @submit.prevent='submit'>
          <!--div class='row'>
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
            <div class='input-field col s8'>
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
          </div-->

          <div class='row'>
            <div class='col'>
              <Button
                text='Создать счет'
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
    amount: '',
    description: '',
    account_id: ''
  }),
  computed: {
    token: get('user/token'),
    accounts: get('accounts/items'),
    isLoading: get('accounts/isLoading'),
    isSubmitting: get('transactions/isSubmitting')
  },
  async created() {
    await this.fetch(this.token);
    if (!this.isLoading && this.accounts.length === 0) {
      this.$router.push({ name: 'new_account', query: { first: true } });
    }
    this.account_id = this.accounts[0].id;
  },
  async mounted() {
    // await this.fetchCurrencies();
    // /* eslint-disable */
    // this.selectCurrencies = M.FormSelect.init(this.$refs.selectCurrencies, {});
    // M.updateTextFields();
    // /* eslint-enable */

    // await this.fetchColors();
    // /* eslint-disable */
    // this.selectColors = M.FormSelect.init(this.$refs.selectColors, {});
    // M.updateTextFields();
    // /* eslint-enable */
  },
  methods: {
    fetch: call('accounts/fetch'),
    create: call('transactions/create'),
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
