<template>
  <div>
    <Menu />
    <div class='container'>
      <div class='row'>
        <div class='col s12'>
          <PageHeader name='Новая операция' />
        </div>
      </div>

      <Loader v-if='isLoading' />
      <div v-else class='row'>
        <form class='col l10 s12' @submit.prevent='submit'>
          <div class='row'>
            <div class='input-field col l8 s12'>
              <input
                id='amount'
                ref='amount'
                v-model='amount'
                type='text'
                class='validate'
                pattern="[0-9,]+"
                autofocus
                required
              >
              <label for='name' class='active'>{{ amountLable }}</label>
              <span
                class='helper-text'
                data-error='Похоже, что это не число'
                data-success='Отлично'
              >
                Например 20.4 или 10 + 3 * 2
              </span>
            </div>
            <div class='input-field col l4 s12'>
              <select ref='selectAccounts' v-model='accountId'>
                <option
                  v-for='acc in accounts'
                  :key='acc.id'
                  :value='acc.id'
                >
                  {{ acc.name }}
                </option>
              </select>
              <label>Счет</label>
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
            <div class='input-field col s12'>
              <input
                id='description'
                v-model='description'
                type='text'
              >
              <label for='name' class='active'>Комментарий</label>
            </div>
          </div>

          <div class='row'>
            <div class='col'>
              <Button
                :text='submitText'
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
import Loader from '@/components/loader';
import PageHeader from '@/components/page_header';
import { get, call } from 'vuex-pathify';

export default {
  name: 'Accounts',
  components: {
    Button,
    Menu,
    Loader,
    PageHeader
  },
  props: {},
  data: () => ({
    amount: '',
    description: '',
    accountId: '',
    isIncome: false
  }),
  computed: {
    token: get('user/token'),
    accounts: get('accounts/items'),
    isLoading: get('accounts/isLoading'),
    isLoaded: get('accounts/isLoaded'),
    isSubmitting: get('transactions/isSubmitting'),
    submitText() {
      // TODO: Доход / Расход
      return 'Создать расход';
    },
    amountLable() {
      return `Величина, ${this.selectedAccount?.currency?.name}`;
    },
    selectedAccount() {
      return this.accounts.find(v => v.id === this.accountId);
    }
  },
  async created() {
    if (!this.isLoaded) {
      await this.fetch(this.token);
    }
    if (this.isLoaded && !this.isLoading && this.accounts.length === 0) {
      this.$router.push({ name: 'new_account', query: { first: true } });
    }
    this.accountId = this.accounts[0].id;
    setTimeout(() => {
      /* eslint-disable */
      M.FormSelect.init(this.$refs.selectAccounts, {});
      M.updateTextFields();
      /* eslint-enable */
    }, 50);
  },
  mounted() {
    this.$refs.amount.focus();
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
.switch
  margin-top: -20px
  margin-bottom: 10px
</style>
