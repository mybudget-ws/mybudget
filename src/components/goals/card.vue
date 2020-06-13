<template>
  <div class='card z-depth-0 light-blue lighten-5'>
    <div class='card-content'>
      <div class='name blue-grey-text text-darken-3'>{{ name }}</div>
      <span class='date'>до {{ dateFormat }}</span>
      <Amount :value='amount' :currency='currency' class='card-title' />
      <span
        class='new badge tag blue percentage'
        :data-badge-caption='percentageText'
      />
    </div>
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
  </div>
</template>

<script>
import Amount from '@/components/amount';

const moment = require('moment');
moment.locale('ru');

export default {
  name: 'AccountCard',
  components: {
    Amount
  },
  props: {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    percentage: { type: String, required: true },
    dueDateOn: { type: String, required: true }
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
    percentageText() {
      return `${this.percentage} %`;
    }
  },
  methods: {
  }
};
</script>

<style scoped lang='sass'>
.card
  border-radius: 8px
  margin: 0 0 18px
  padding: 14px 0 10px 0
  padding: 8px 12px 0px
  position: relative

  .card-title
    margin-bottom: 2px

  .card-content
    margin-bottom: 10px
    padding: 0

    .name
      font-size: 18px
      font-weight: 400

  .card-action
    padding: 12px 0

    a.last
      margin-right: 0 !important

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
</style>
