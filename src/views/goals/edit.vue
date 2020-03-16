<template>
  <div>
    <Menu />
    <div class='container'>
      <PageHeader name='Редактирование цели' />

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
                required
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
                autofocus
                required
                @click='$refs.amount.focus()'
              >
              <label for='name' class='active'>Накопить</label>
            </div>
          </div>

          <div class='row'>
            <div class='col'>
              <Button
                text='Изменить'
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
import api from '@/api';
import { get, call } from 'vuex-pathify';

const moment = require('moment');
moment.locale('ru');

export default {
  name: 'EditGoal',
  components: {
    Button,
    Menu,
    PageHeader
  },
  props: {},
  data: () => ({
    name: '',
    date: null,
    amount: '0',
    isLoading: true,
    isSubmitting: false
  }),
  computed: {
    id() { return this.$route.params.id; },
    token: get('user/token'),
    accounts: get('accounts/items'),
    isAccountsLoaded: get('accounts/isLoaded')
  },
  created() {
    if (!this.isAccountsLoaded) { this.fetchAccounts(this.token); }
  },
  async mounted() {
    const item = await api.goal(this.token, { id: this.id });
    this.isLoading = false;

    this.name = item.name;
    this.amount = item.amount;
    this.date = new Date(Date.parse(item.dueDateOn));

    /* eslint-disable */
    M.Datepicker.init(
      this.$refs.datepicker,
      {
        format: 'dd mmm, yyyy',
        firstDay: 1,
        setDefaultDate: true,
        defaultDate: this.date,
        i18n: {
          cancel: 'Закрыть',
          months: [
            'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль',
            'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
          ],
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

    this.$refs.name.focus();
  },
  methods: {
    fetchAccounts: call('accounts/fetch'),
    async submit() {
      if (this.isSubmitting) { return; }

      this.isSubmitting = true;
      /* eslint-disable */
      const date = M.Datepicker.getInstance(this.$refs.datepicker).date;
      /* eslint-enable */
      const { id, name, amount } = this;
      const isSuccess = await api.updateGoal(
        this.token,
        {
          id,
          name,
          amount: amount.toString(),
          dueDateOn: moment(date).format()
        }
      );
      if (isSuccess != null) {
        this.$router.push({ name: 'goals' }).catch(_e => {});
      } else {
        alert('Error');
      }
    }
  }
};
</script>

<style scoped lang='sass'>
</style>
