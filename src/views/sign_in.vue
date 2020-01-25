<template>
  <div>
    <Menu />
    <div class='container'>
      <PageHeader name='Вход в Мой Бюджет' />

      <div class='row'>
        <form class='col s12' @submit.prevent='submit'>
          <div class='row'>
            <div class='input-field col s12'>
              <input
                id='email'
                v-model='email'
                type='email'
                class='validate'
              >
              <label for='email'>Email</label>
            </div>
          </div>
          <div class='row'>
            <div class='input-field col s12'>
              <input
                id='password'
                v-model='password'
                type='password'
                class='validate'
              >
              <label for='password'>Пароль</label>
            </div>
          </div>

          <Button
            text='Продолжить'
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

// NOTE: Toasts.
// M.toast({html: 'I am a toast!'})
// https://materializecss.com/toasts.html
export default {
  name: 'SignIn',
  components: {
    Button,
    Menu,
    PageHeader
  },
  props: {},
  data: () => ({
    email: '',
    password: '',
    isSubmitting: false,
    isAuthError: false
  }),
  computed: {
    isSignedIn: get('user/isSignedIn')
  },
  mounted() {
    if (this.isSignedIn) {
      this.$router.push('accounts');
    }
  },
  methods: {
    ...call([
      'user/login'
    ]),
    async submit() {
      this.isSubmitting = true;

      const { email, password } = this;
      const isSuccess = await this.login({ email, password });
      this.isSubmitting = isSuccess;
      if (isSuccess) {
        this.$router.push('accounts');
      }
    }
  }
};
</script>

<style scoped lang='sass'>
</style>
