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
            required
          >
          <label for='new-password'>Новый пароль</label>
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

export default {
  name: 'SettingsPassword',
  components: {
    Button
  },
  props: {},
  data: () => ({
    password: '',
    newPassword: ''
  }),
  computed: {
  },
  methods: {
  }
};
</script>

<style scoped lang='sass'>
</style>
