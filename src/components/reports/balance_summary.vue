<template>
  <div class='balance-summary'>
    <div v-if='isPhone'>
      <div v-for='(row, index) in summary' :key='index' class='card blue-grey lighten-5 z-depth-0'>
        <div class='card-content'>
          <div class='card-title'>{{ row.name }}</div>
          <div>
            Начало периода
            <Amount :value='row.startBalance' :currency='row.currency' class='amount' />
          </div>
          <div>
            Изменение
            <Amount :value='row.endBalance - row.startBalance' :currency='row.currency' class='amount' />
          </div>
          <hr>
          <div>
            <b>Итого</b>
            <Amount :value='row.endBalance' :currency='row.currency' class='amount' />
          </div>
        </div>
      </div>
    </div>

    <table v-else>
      <thead>
        <tr>
          <th class='min' />
          <th>Начало периода</th>
          <th>Изменение</th>
          <th>Итого</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for='(row, index) in summary' :key='index' :class='row.class'>
          <td class='min'>
            <strong>{{ row.name }}</strong>
          </td>
          <td>
            <Amount :value='row.startBalance' :currency='row.currency' />
          </td>
          <td>
            <Amount :value='row.endBalance - row.startBalance' :currency='row.currency' />
          </td>
          <td>
            <Amount :value='row.endBalance' :currency='row.currency' />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Amount from '@/components/amount';

import MobileDetect from 'mobile-detect';
const md = new MobileDetect(window.navigator.userAgent);

export default {
  name: 'BalanceSummary',
  components: {
    Amount
  },
  props: {
    summary: { type: Array, required: true }
  },
  data: () => ({
    isPhone: md.phone() != null
  }),
  computed: {},
  methods: {}
};
</script>

<style scoped lang='sass'>
.card
  .amount
    float: right

th, td
  text-align: right
  width: 30%

  &.min
    width: 16%
    text-align: left

tbody
  tr.total
    background-color: #fafafa

    td
      &:first-child
        &:after
          color: #757575
          content: '(по текущему курсу)'
          font-size: 13px
          display: block
          font-weight: 200
</style>
