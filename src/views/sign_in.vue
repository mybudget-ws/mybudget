<template>
  <div class='main-background'>
    <Menu />
    <div class='container'>
      <PageHeader :name='`Войти в\xa0Мой\xa0Бюджет`' />

      <div class='row'>
        <form class='col s12 m12 l10 xl8' @submit.prevent='submit'>
          <div class='row'>
            <div class='input-field col s12'>
              <input
                id='email'
                v-model='email'
                type='email'
                class='validate'
                required
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
                required
              >
              <label for='password'>Пароль</label>
            </div>
          </div>

          <div class='row mb-0'>
            <div class='col s12 m6 l4 xl4'>
              <Button
                text='Продолжить'
                is-mobile-disable
                :is-disabled='isSubmitting'
                :is-loading='isSubmitting'
                @click='submit'
              />
            </div>
            <div class='col s12 m6 l8 xl8'>
              <router-link class='btn btn-large btn-flat right' :to='{ name: "forgot_password" }'>
                Забыли пароль?
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
    isSubmitting: false
    // isAuthError: false
  }),
  computed: {
    isSignedIn: get('user/isSignedIn')
  },
  created() {
    if (this.isSignedIn) {
      this.$router.push({ name: 'transactions' });
    }
  },
  methods: {
    ...call([
      'user/login'
    ]),
    async submit() {
      if (this.isSubmitting) { return; }

      const { email, password } = this;
      if (email == '' || password == '') { return; }

      this.isSubmitting = true;

      const isSuccess = await this.login({ email, password });
      this.isSubmitting = isSuccess;
      if (isSuccess) {
        this.$router.push({ name: 'transactions' });
      } else {
        /* eslint-disable */ M.toast({ html: 'Неверный email или пароль' }); /* eslint-enable */
      }
    }
  }
};
</script>

<style scoped lang='sass'>
.main-background
  &:before
    background-image: url('../assets/home-background.svg')
    background-repeat: no-repeat
    position: absolute
    width: 100%
    min-height: 100%
    height: 840px
    content: ''
    background-size: cover
    z-index: -1

.container
  background-color: #fff
  border-radius: 10px
  padding: 0 18px 12px

  @media only screen and (max-width: 601px)
    margin-top: 20px

    form
      button,
      .btn
        width: 100%

.row.mb-0
  margin-bottom: 0
</style>
