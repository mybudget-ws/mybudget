<template>
  <div class='main-background'>
    <Menu />
    <div v-if='!isSubmitted' class='container'>
      <PageHeader name='Забыли пароль?' />
      <div class='row'>
        <p class='col'>
          Введите адрес электронной почты, который вы использовали
          при регистрации, и мы пришлем вам инструкции по изменению пароля.
        </p>
      </div>

      <div class='row'>
        <form class='col l6 m12 s12' @submit.prevent='submit'>
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

          <Button
            text='Сбросить пароль'
            is-mobile-disable
            :is-disabled='isSubmitting'
            :is-loading='isSubmitting'
            @click='submit'
          />
        </form>
      </div>
    </div>
    <div v-else class='container'>
      <PageHeader name='Инструкция отправлена!' />
      <div class='row'>
        <div class='col'>
          <p>
            Инструкция по изменению пароля отправлена на адрес <b>{{ email }}</b>.
          </p>
          <p>
            Вы получите письмо в течение 5 минут.
            Не забудьте проверить папку <b>спам</b>,
            письмо может случайно оказаться там :)
          </p>
        </div>
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
  name: 'ForgotPassword',
  components: {
    Button,
    Menu,
    PageHeader
  },
  props: {},
  data: () => ({
    email: '',
    isSubmitting: false,
    isSubmitted: false
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
      'user/resetPassword'
    ]),
    async submit() {
      if (this.isSubmitting) { return; }

      const { email } = this;
      if (email == '') { return; }

      this.isSubmitting = true;

      const result = await this.resetPassword({ email });

      this.isSubmitting = false;
      this.isSubmitted = true;

      if (result.error == null || result.error === '') {
        /* eslint-disable */ M.toast({ html: 'Инструкция отправлена.' }); /* eslint-enable */
      } else {
        /* eslint-disable */ M.toast({ html: result.error }); /* eslint-enable */
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
</style>
