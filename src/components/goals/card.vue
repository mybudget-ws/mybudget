<template>
  <Card color='light-blue lighten-5'>
    <div class='name blue-grey-text text-darken-3'>{{ name }}</div>
    <span class='date'>до {{ dateFormat }}</span>
    <Amount :value='amount' :currency='currency' class='card-title' />
    <div class='card-content blue-grey-text text-darken-3'>
      <div>
        <span class='info-left'>Прогресс:</span>
        <Amount :value='balance' :currency='currency' class='inline-amount' />
      </div>
      <div>
        <span class='info-left'>В месяц по:</span>
        <Amount :value='amountPerMonth' :currency='currency' class='inline-amount' />
      </div>
      <div>
        <span class='info-left'>Осталось:</span>
        <Amount :value='rest' :currency='currency' class='inline-amount' />
      </div>
      <div class='due-months grey-text text-darken-2'>
        <i>месяцев в запасе ~ {{ dueMonths }}</i>
      </div>
    </div>
    <div v-for='account in accounts' :key='account.id' class='card-content tags'>
      <BadgeAccount :account='account' />
    </div>
    <span
      class='new badge tag blue percentage'
      :data-badge-caption='percentage'
    />
    <slot class='card-footer'>
      <div class='card-action'>
        <router-link
          :to="`/goals/${id}/edit`"
          class='grey-text text-darken-2'
        >
          Изменить
        </router-link>
        <a
          class='grey-text text-darken-2 last'
          @click='$emit("destroy")'
        >
          Удалить
        </a>
      </div>
    </slot>
  </Card>
</template>

<script>
import Amount from '@/components/amount';
import BadgeAccount from '@/components/badges/account';
import Card from '@/components/card';

const moment = require('moment');
moment.locale('ru');

export default {
  name: 'AccountCard',
  components: {
    Amount,
    BadgeAccount,
    Card
  },
  props: {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    amountPerMonth: { type: Number, required: true },
    balance: { type: Number, required: true },
    currency: { type: String, required: true },
    percentage: { type: String, required: true },
    dueDateOn: { type: String, required: true },
    dueMonths: { type: Number, required: true },
    accounts: { type: Array, required: true }
  },
  data: () => ({
  }),
  computed: {
    dateFormat() {
      const date = moment(this.dueDateOn);
      const current = moment();
      if (moment(date).isSame(current, 'day')) {
        return 'Сегодня';
      }
      if (current.subtract(1, 'days').isSame(date, 'day')) {
        return 'Вчера';
      }
      if (current.year() === date.year()) {
        return date.format('DD MMMM');
      }

      return date.format('DD.MM.YYYY');
    },
    rest() {
      if (this.balance >= this.amount) { return 0.0; }
      return this.amount - this.balance;
    }
  },
  methods: {
  }
};
</script>

<style scoped lang='sass'>
.card-content
  margin-bottom: 10px
  padding: 0

  &.tags
    min-height: 24px

  span.badge
    float: left
    margin-left: 0
    margin-bottom: 4px

.date
  color: #424242
  font-weight: 200
  position: absolute
  right: 14px
  text-align: right
  top: 10px

.percentage
  display: inline-block
  font-size: 12px
  font-weight: 600
  min-width: 50px
  position: absolute
  right: 14px
  top: 39px

.due-months
  font-weight: 200

.inline-amount
  display: inline-block
  float: right

.info-left
  min-width: 80px
  display: inline-block
</style>
