<template>
  <div>
    <Menu />
    <div class='container'>
      <PageHeader name='Новая цель' />

      <div class='row'>
        <form class='col l10 s12' @submit.prevent='submit'>
          <div class='row'>
            <div class='input-field col l8 s12'>
              <input
                id='name'
                ref='name'
                v-model='name'
                type='text'
                class='validate'
                autofocus
                required
                @focus='$event.target.select()'
              >
              <label for='name' class='active'>Название цели</label>
            </div>
          </div>
          <div class='row'>
            <div class='input-field col l8 s12'>
              <input
                id='amount'
                ref='amount'
                v-model='amount'
                type='text'
                class='validate'
                pattern='[0-9,+-/*]+'
                required
                @click='$refs.amount.focus()'
                @focus='$event.target.select()'
              >
              <label for='name' class='active'>Накопить</label>
            </div>
          </div>

          <div class='row'>
            <div class='col'>
              <Button
                text='Создать цель'
                :is-disabled='isSubmitting'
                :is-loading='isSubmitting'
                @click='submit'
              />
            </div>
            <div class='col'>
              <router-link to='/goals' class='btn-flat btn-large'>
                Отмена
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
  name: 'NewGoal',
  components: {
    Button,
    Menu,
    PageHeader
  },
  props: {},
  data: () => ({
    name: 'Автомобиль',
    amount: '600000'
  }),
  computed: {
    token: get('user/token'),
    isSubmitting: get('goals/isSubmitting')
  },
  async mounted() {
    this.$refs.name.focus();
  },
  methods: {
    create: call('goals/create'),
    async submit() {
      if (this.isSubmitting) { return; }

      const { name, amount, token } = this;
      const goal = { name, amount };
      const isSuccess = await this.create({ token, goal });
      if (isSuccess != null) {
        this.$router.push({ name: 'goals' });
      } else {
        alert('Error');
      }
    }
  }
};
</script>

<style scoped lang='sass'>
</style>
