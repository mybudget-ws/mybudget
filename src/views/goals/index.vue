<template>
  <div>
    <Menu />
    <div class='container container-wide'>
      <PageHeader name='Цели' action='/goals/new' />
      <div class='row'>
        <div class='col s12'>
          <Loader v-if='isLoading' />
          <div v-else-if='isAlert' class='card blue-grey'>
            <div class='card-content white-text'>
              <span class='card-title'>Пока у вас нет созданных финансовых Целей</span>
              <p>
                Цели пригодятся в отслеживании процесса накоплений.
                Например: "Квартира", "Автомобиль", "Заслуженный отдых"
                или "На черный день". Доступен выбор нескольких счетов,
                если при накоплении используются вклады в нескольких банках.
              </p>
            </div>
          </div>
          <table v-else-if='!isPhone'>
            <thead>
              <tr>
                <th class='name'>Название</th>
                <th class='date'>Крайняя дата</th>
                <th class='amount' title='Итоговая сумма для накопления'>Величина</th>
                <th class='amount' title='Сумму, которую нужно отложить в месяц'>В месяц</th>
                <th class='amount' title='Осталось накопить'>Осталось</th>
                <th class='percentage'>Прогресс</th>
                <th />
              </tr>
            </thead>
            <tbody>
              <tr v-for='item in items' :key='item.id'>
                <td>
                  {{ item.name }}
                  <div class='accounts'>{{ accounts(item) }}</div>
                </td>
                <td :title='dateTitleFormat(item)'>
                  {{ dateFormat(item) }}
                  <div class='due-months grey-text text-darken-2'>
                    <i>месяцев в запасе ~ {{ item.dueMonths }}</i>
                  </div>
                </td>
                <td class='amount'>
                  <Amount :value='item.amount' :currency='currency(item)' />
                </td>
                <td class='amount'>
                  <Amount :value='item.amountPerMonth' :currency='currency(item)' />
                </td>
                <td class='amount'>
                  <Amount :value='rest(item)' :currency='currency(item)' />
                </td>
                <td class='percentage'>
                  <Amount :value='item.balance' :currency='currency(item)'>
                    <span
                      v-if='item.percentage >= 100'
                      class='new badge black-text tag light-green'
                      :data-badge-caption='tagPercentage(item)'
                    />
                    <span
                      v-else
                      class='new badge black-text tag grey lighten-2'
                      :data-badge-caption='tagPercentage(item)'
                    />
                  </Amount>
                </td>
                <td class='actions'>
                  <router-link
                    :to="`/goals/${item.id}/edit`"
                    class='waves-effect waves-teal btn-flat'
                  >
                    <i class='material-icons grey-text'>edit</i>
                  </router-link>
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
          <div v-for='item in items' v-else :key='item.id'>
            <Card
              v-bind='item'
              :currency='currency(item)'
              :percentage='tagPercentage(item)'
              @destroy='onDestroy(item)'
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Amount from '@/components/amount';
import Card from '@/components/goals/card';
import Menu from '@/components/menu';
import Loader from '@/components/loader';
import PageHeader from '@/components/page_header';
import { get, call } from 'vuex-pathify';

import MobileDetect from 'mobile-detect';
const md = new MobileDetect(window.navigator.userAgent);

const moment = require('moment');
moment.locale('ru');

export default {
  name: 'Goals',
  components: {
    Amount,
    Card,
    Loader,
    Menu,
    PageHeader
  },
  props: {},
  data: () => ({
    isPhone: md.phone() != null
  }),
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
    accounts({ accounts }) {
      return accounts.map(v => v.name).join(', ');
    },
    dateFormat(goal) {
      const date = moment(goal.dueDateOn);
      return date.format('DD MMMM YYYY');
    },
    dateTitleFormat(goal) {
      return moment(goal.dueDateOn).format('DD.MM.YYYY');
    },
    currency({ currency }) {
      if (currency == null) { return ''; }
      return currency.name;
    },
    rest({ amount, balance }) {
      if (balance >= amount) { return 0.0; }
      return amount - balance;
    },
    tagPercentage({ percentage }) {
      return `${percentage}%`;
    }
  }
};
</script>

<style scoped lang='sass'>
.accounts,
.due-months
  font-size: 10px
  font-weight: 200

.amount
  width: 160px
  @media only screen and (min-width: 992px)
    text-align: right

.percentage
  .badge
    margin-left: 6px
  @media only screen and (min-width: 992px)
    text-align: right

// TODO: Remove duplications
.actions
  padding-right: 0px
  width: 86px
  text-align: right

  .btn-flat
    padding: 0 8px !important
//
</style>
