<template>
  <div>
    <Menu />
    <div class='container container-wide'>
      <PageHeader name='Завершение регистрации' />
      <div class='row'>
        <div class='subheader col s12'>
          Таким образом, вы сможете вернуться позже и не потерять данные
        </div>
      </div>

      <div class='row'>
        <form class='col l5 m8 s12' autocomplete='off' @submit.prevent='submit'>
          <div class='row'>
            <!-- Work around to avoid autocomplete in chrome -->
            <input id='email' type='email' style='height: 0px; width: 0px'>
            <input id='password' type='password' style='height: 0px; width: 0px'>
            <!-- end -->

            <div class='input-field col s12'>
              <input
                id='new-email'
                ref='email'
                type='email'
                :value='email'
                autofocus
              >
              <label for='new-email' class='active'>Email</label>
            </div>
          </div>
          <div class='row'>
            <div class='input-field col s12'>
              <input
                id='new-password'
                type='password'
                :value='password'
              >
              <label for='new-password'>Пароль</label>
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
    </div>
  </div>
</template>

<script>
import Button from '@/components/button';
import Menu from '@/components/menu';
import PageHeader from '@/components/page_header';

export default {
  name: 'SettingsFinishSignUp',
  components: {
    Button,
    Menu,
    PageHeader
  },
  props: {},
  data: () => ({
    // TODO: Move isSubmitting to store.
    isSubmitting: false,
    email: '',
    password: ''
  }),
  computed: {
  },
  mounted() {
    this.$refs.email.focus();
  },
  methods: {
    // async submit() {
    submit() {
      alert('todo');
    }
  }
};
</script>

<style scoped lang='sass'>
</style>
