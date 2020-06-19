<template>
  <div class='row'>
    <form class='col l6 m8 s12' autocomplete='off' @submit.prevent='submit'>
      <div class='row'>
        <div class='input-field col s12'>
          <input
            id='current-password'
            v-model='password'
            type='password'
            class='validate'
            required
          >
          <label for='current-password'>Текущий пароль</label>
        </div>
      </div>

      <div class='row'>
        <div class='input-field col s12'>
          <input
            id='new-password'
            v-model='newPassword'
            type='password'
            class='validate'
            minlength='6'
            required
          >
          <label for='new-password'>Новый пароль</label>
          <span class='helper-text'>Минимум 6 символов</span>
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
import { call } from 'vuex-pathify';

export default {
  name: 'SettingsPassword',
  components: {
    Button
  },
  props: {},
  data: () => ({
    password: '',
    newPassword: '',
    isSubmitting: false
  }),
  computed: {
  },
  methods: {
    ...call([
      'user/changePassword'
    ]),
    async submit() {
      if (this.isSubmitting) { return; }
      const { newPassword, password } = this;
      if (newPassword.length < 6) { return; }
      this.isSubmitting = true;
      const isSuccess = await this.changePassword({ newPassword, password });
      this.isSubmitting = false;

      const message = isSuccess ?
        'Пароль успешно изменен' :
        'Ошибка изменения пароля';
      /* eslint-disable */ M.toast({ html: message }); /* eslint-enable */
      if (isSuccess) {
        this.password = '';
        this.newPassword = '';
      }
    }
  }
};
</script>

<style scoped lang='sass'>
</style>
