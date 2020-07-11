<template>
  <div class='row'>
    <form class='col l6 m8 s12' autocomplete='off' @submit.prevent='submit'>
      <div class='row'>
        <!-- Work around to avoid autocomplete in chrome -->
        <input id='email' type='email' style='height: 0px; width: 0px'>
        <!-- end -->

        <div class='input-field col s12'>
          <input
            id='current-email'
            type='email'
            :value='currentEmail'
            disabled
          >
          <label for='current-email' class='active'>Email</label>
        </div>
      </div>
      <div class='row'>
        <Loader v-if='isLoading' />
        <div v-else class='input-field col l6 s12'>
          <select ref='selectCurrencies' v-model='currency'>
            <option
              v-for='curr in currencies'
              :key='curr.id'
              :value='curr.name'
            >
              {{ curr.name }}
            </option>
          </select>
          <label>Валюта по умолчанию</label>
        </div>
      </div>

      <Button
        text='Сохранить'
        :is-mobile='false'
        :is-disabled='isSubmitting'
        :is-loading='isSubmitting'
        @click='submit'
      />
    </form>
  </div>
</template>

<script>
import Button from '@/components/button';
import Loader from '@/components/loader';
import { get, call } from 'vuex-pathify';

export default {
  name: 'SettingsProfile',
  components: {
    Button,
    Loader
  },
  props: {},
  data: () => ({
    currency: '',
    isLoading: true,
    isSubmitting: false
  }),
  computed: {
    isGuest: get('user/isGuest'),
    email: get('user/email'),
    currencies: get('currencies/items'),
    defaultCurrency: get('user/defaultCurrency'),
    currentEmail() {
      return this.isGuest ?
        'Почта не задана, необходимо завершить регистрацию' :
        this.email;
    }
  },
  async mounted() {
    await this.fetchProfile();
    await this.fetchCurrencies({ base: this.defaultCurrency });
    this.isLoading = false;
    this.currency = this.defaultCurrency;

    /* eslint-disable */
    this.$nextTick(() => {
      this.selectCurrencies = M.FormSelect.init(this.$refs.selectCurrencies, {});
      M.updateTextFields();
    });
    /* eslint-enable */
  },
  methods: {
    ...call([
      'user/updateProfile',
      'user/fetchProfile'
    ]),
    fetchCurrencies: call('currencies/fetch'),
    async submit() {
      if (this.isSubmitting) { return; }
      this.isSubmitting = true;
      const { currency } = this;
      const isSuccess = await this.updateProfile({ currency });
      this.isSubmitting = false;

      const message = isSuccess ?
        'Профль успешно изменен' :
        'Ошибка изменения профиля';
      /* eslint-disable */ M.toast({ html: message }); /* eslint-enable */
    }
  }
};
</script>

<style scoped lang='sass'>
</style>
