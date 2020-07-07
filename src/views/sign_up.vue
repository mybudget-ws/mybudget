<template>
  <div class='main-background'>
    <Menu />
    <div class='container'>
      <div class='row'>
        <div class='col m6 s12'>
          <div class='block z-depth-1'>
            <h4>Регистрация</h4>
            <p>Для тех кто на сайте первый раз</p>
            <p class='grey-text'>
              Регистрируясь на сайте вы подтверждаете согласие с
              <a href='/#/agreement' target='_blank'>
                <b class='grey-text'>пользовательским соглашением</b>
              </a>
              и
              <a href='/#/privacy' target='_blank'>
                <b class='grey-text'>политикой конфиденциальности</b>
              </a>
            </p>
            <Button
              text='Продолжить'
              @click='autoSignUp'
            />
          </div>
        </div>
        <div class='col m6 s12'>
          <div class='block z-depth-1'>
            <h4>Вход</h4>
            <p>У вас уже есть аккаунт или вы пользователь classic.mybudget.ws</p>
            <p class='grey-text'>
              Больше подробностей для пользователей classic.mybudget.ws
              <a href='//mybudget.ws/blog/11/mybudget2' target='_blank'>
                <b class='grey-text'>на блоге сайта</b>
              </a>
            </p>
            <router-link
              to='/sign_in'
              class='btn btn-large blue-grey lighten-5 waves-effect grey-text text-darken-4 z-depth-0'
            >
              Войти
            </router-link>
          </div>
        </div>
      </div>
      <!--
      <PageHeader name='Регистраиця' />

      <div class='row'>
        <form class='col l6 m8 s12' @submit.prevent='submit'>
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
      -->
    </div>
  </div>
</template>

<script>
import Button from '@/components/button';
import Menu from '@/components/menu';
import { get, call } from 'vuex-pathify';

export default {
  name: 'SignUp',
  components: {
    Button,
    Menu
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
      this.$router.push({ name: 'transactions' });
    }
  },
  methods: {
    ...call([
      'user/registration'
    ]),
    async submit() {
      this.isSubmitting = true;

      const { email, password } = this;
      const isSuccess = await this.registration({ email, password });
      this.isSubmitting = isSuccess;
      if (isSuccess) {
        this.$router.push({ name: 'transactions' });
      }
    },
    async autoSignUp() {
      alert('todo');
    }
  }
};
</script>

<style scoped lang='sass'>
.block
  background: #fff
  padding: 10px 20px 20px
  border-radius: 10px
  min-height: 10px
  margin-top: 20px

  h4
    margin-top: 10px

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

.btn-large.blue-grey
  border: 1px #cfd8dc solid

.btn
  margin-top: 8px
</style>
