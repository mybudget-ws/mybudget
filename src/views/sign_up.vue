<template>
  <div class='main-background'>
    <Menu />
    <div class='container'>
      <div class='row'>
        <div class='col m6 s12'>
          <div class='block z-depth-1'>
            <h4>Регистрация</h4>
            <p>Для тех, кто на сайте впервые</p>
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
              :is-disabled='isSubmitting'
              :is-loading='isSubmitting'
              @click='submit'
            />
          </div>
        </div>
        <div class='col m6 s12'>
          <div class='block z-depth-1'>
            <h4>Вход</h4>
            <p>
              У вас уже есть аккаунт или вы пользователь
              <a href='https://mybudget.ws' target='_blank'>classic.mybudget.ws</a>
            </p>
            <p class='grey-text'>
              Больше подробностей для пользователей classic.mybudget.ws
              <a href='//mybudget.ws/blog/11/mybudget2' target='_blank'>
                <b class='grey-text'>на блоге сайта</b>
              </a>
            </p>
            <router-link
              to='/sign_in'
              class='
                sign-in btn btn-large grey lighten-5
                waves-effect grey-text text-darken-4 z-depth-0
              '
            >
              Войти
            </router-link>
          </div>
        </div>
      </div>
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
    isSubmitting: false
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
      'user/autoSignUp'
    ]),
    async submit() {
      this.isSubmitting = true;
      const isSuccess = await this.autoSignUp();
      this.isSubmitting = false;

      if (isSuccess) {
        this.$router.push({ name: 'transactions' });
      } else {
        /* eslint-disable */
        M.toast({ html: 'Непредвиденная ошибка' });
        /* eslint-enable */
      }
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

.btn.sign-in
  border: 1px #cfd8dc solid

.btn
  margin-top: 8px
</style>
