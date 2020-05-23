<template>
  <div class='row'>
    <form class='col l6 m8 s12' autocomplete='off' @submit.prevent='submit'>
      <div class='row'>
        <!-- Work around to avoid autocomplete in chrome -->
        <input id='email' type='email' style='height: 0px; width: 0px'>
        <input id='password' type='password' style='height: 0px; width: 0px'>
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
        <div class='input-field col s12'>
          <input
            id='email-new'
            v-model='newEmail'
            type='email'
            class='validate'
            required
          >
          <label for='email-new'>Новый Email</label>
        </div>
      </div>

      <div class='row'>
        <div class='input-field col s12'>
          <input
            id='confirm-password'
            v-model='password'
            type='password'
            class='validate'
            required
          >
          <label for='confirm-password'>Пароль</label>
        </div>
      </div>

      <Button
        text='Сохранить'
        :is-disabled='isSubmitting'
        :is-loading='isSubmitting'
        @click='submit'
      />
    </form>
  </div>
</template>

<script>
import Button from '@/components/button';
import { get, call } from 'vuex-pathify';

export default {
  name: 'SettingsProfile',
  components: {
    Button
  },
  props: {},
  data: () => ({
    newEmail: '',
    password: '',
    isSubmitting: false
  }),
  computed: {
    currentEmail: get('user/email')
  },
  methods: {
    ...call([
      'user/changeEmail'
    ]),
    submit() {
      const { newEmail, password } = this;
      // const isSuccess = await this.changeEmail({ newEmail, password });
      const isSuccess = this.changeEmail({ newEmail, password });
      console.log('TODO: submit');
      console.log(isSuccess);
    }
  }
};
</script>

<style scoped lang='sass'>
</style>
