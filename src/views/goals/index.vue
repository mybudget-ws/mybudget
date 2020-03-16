<template>
  <div>
    <Menu />
    <div class='container'>
      <PageHeader name='Цели' action='/goals/new' />
      <div class='row'>
        <div class='col s12'>
          <Loader v-if='isLoading' />
          <div v-else-if='isAlert' class='card blue-grey darken-1'>
            <div class='card-content white-text'>
              <span class='card-title'>Пока у вас нет созданных финансовых Целей</span>
              <p>TODO: Описание, чем могут быть полезны цели...</p>
            </div>
            <!--div class="card-action">
              <a href="#">Подробнее о целях</a>
            </div-->
          </div>
          <table v-else class='responsive-table'>
            <thead>
              <tr>
                <th class='name'>Название</th>
                <th class='date'>Крайняя дата</th>
                <th class='amount'>Величина</th>
                <th class='percentage'>Прогресс</th>
                <th />
              </tr>
            </thead>
            <tbody>
              <tr v-for='item in items' :key='item.id'>
                <td>{{ item.name }}</td>
                <td :title='dateTitleFormat(item)'>{{ dateFormat(item) }}</td>
                <td class='amount'>
                  <Amount :value='item.amount' currency='' />
                </td>
                <td class='percentage'>{{ item.percentage }}%</td>
                <td class='actions'>
                  <a
                    :href="`/goals/${item.id}/edit`"
                    class='waves-effect waves-teal btn-flat'
                  >
                    <i class='material-icons grey-text'>edit</i>
                  </a>
                  <a
                    class='waves-effect waves-teal btn-flat'
                    @click='onDestroy(item)'
                  >
                    <i class='material-icons grey-text'>delete</i>
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Amount from '@/components/amount';
import Menu from '@/components/menu';
import Loader from '@/components/loader';
import PageHeader from '@/components/page_header';
import { get, call } from 'vuex-pathify';

const moment = require('moment');
moment.locale('ru');

export default {
  name: 'Goals',
  components: {
    Amount,
    Menu,
    Loader,
    PageHeader
  },
  props: {},
  computed: {
    token: get('user/token'),
    ...get('goals/*'),
    isAlert() {
      return !this.isLoading && this.items.length === 0;
    }
  },
  created() {
    this.fetch(this.token);
  },
  methods: {
    ...call([
      'goals/fetch',
      'goals/destroy'
    ]),
    async onDestroy(goal) {
      if (this.isDestroying) { return; }

      if (confirm('Удалить цель. Вы уверены?')) {
        const res = await this.destroy({ token: this.token, goal });
        const message = res != null ?
          'Цель успешно удалена' :
          'Непредвиденная ошибка';
        /* eslint-disable */
        M.toast({ html: message });
        /* eslint-enable */
      }
    },
    dateFormat(goal) {
      const date = moment(goal.dueDateOn);
      return date.format('DD MMMM YYYY');
    },
    dateTitleFormat(goal) {
      return moment(goal.dueDateOn).format('DD.MM.YYYY');
    }
  }
};
</script>

<style scoped lang='sass'>
.amount
  width: 140px
  @media only screen and (min-width: 992px)
    text-align: right

.percentage
  width: 120px
  @media only screen and (min-width: 992px)
    text-align: right

// TODO: Remove duplications
.actions
  width: 82px
  text-align: right

  .btn-flat
    padding: 0 8px !important
//
</style>
