<template>
  <div>
    <Menu />
    <div class='container'>
      <PageHeader name='Новая цель' />

      <div class='row'>
        <form class='col l10 s12' @submit.prevent='submit'>
          <div class='row'>
            <div class='input-field col l6 s12'>
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
            <div class='input-field col l4 s12'>
              <input
                id='date'
                ref='datepicker'
                type='text'
                class='datepicker'
              >
              <label for='date' class='active'>Крайняя дата</label>
            </div>
          </div>
          <div class='row'>
            <div class='input-field col l6 s12'>
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

const moment = require('moment');
moment.locale('ru');

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
    date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    amount: '0',

    datepicker: null
  }),
  computed: {
    token: get('user/token'),
    isSubmitting: get('goals/isSubmitting')
  },
  async mounted() {
    this.$refs.name.focus();

    /* eslint-disable */
    M.Datepicker.init(
      this.$refs.datepicker,
      {
        format: 'dd mmm, yyyy',
        firstDay: 1,
        setDefaultDate: true,
        defaultDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        i18n: {
          cancel: 'Закрыть',
          months: [
            'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль',
            'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
          monthsShort: [
            'янв.', 'февр.', 'мар.', 'апр.', 'мая', 'июня', 'июля',
            'авг.', 'сент.', 'окт.', 'нояб.', 'дек.'
          ],
          weekdaysShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
          weekdaysAbbrev: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
        }
      }
    );
    M.Datepicker.getInstance(this.$refs.datepicker).setDate(this.date);
    /* eslint-enable */
  },
  methods: {
    create: call('goals/create'),
    async submit() {
      if (this.isSubmitting) { return; }

      /* eslint-disable */
      const date = M.Datepicker.getInstance(this.$refs.datepicker).date;
      /* eslint-enable */
      const { token, name, amount } = this;
      const goal = {
        name,
        dueDateOn: moment(date).format(),
        amount
      };
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
