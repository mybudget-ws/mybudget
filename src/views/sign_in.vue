<template>
  <div>
    <Menu />
    <div class='container'>
      <PageHeader name='Вход в Мой Бюджет' />

      <div class='row'>
        <form class='col s12' @submit.prevent='submit'>
          <div class='row'>
            <div class='input-field col s12'>
              <input id='email' type='email' class='validate'>
              <label for='email'>Email</label>
            </div>
          </div>
          <div class='row'>
            <div class='input-field col s12'>
              <input id='password' type='password' class='validate'>
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

      <p v-if='isSignedIn'>
        Signed In!
      </p>
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
    isSubmitting: false,
    isAuthError: false
  }),
  computed: {
    ...get('user/*')
  },
  methods: {
    async submit() {
      this.isSubmitting = true;
      // TODO: User user (login result) to redirect
      await this.login({
        email: 'alexander.kalinichev@gmail.com',
        password: '123'
      });
      this.isSubmitting = false;
    },
    ...call([
      'user/login'
    ])
  }
};
</script>

<style scoped lang='sass'>
</style>
