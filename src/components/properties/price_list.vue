<template>
  <table v-bind='$attrs'>
    <thead>
      <tr>
        <th class='date'>Дата</th>
        <th class='amount'>Величина</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for='item in items' :key='item.id'>
        <td :title='dateTitleFormat(item)'>
          {{ dateFormat(item) }}
        </td>
        <td class='amount'>
          <Amount :value='item.amount' :currency='item.currency.name' />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import Amount from '@/components/amount';
import DateFormat from '@/utils/date_format';

export default {
  name: 'PriceList',
  components: {
    Amount
  },
  props: {
    items: { type: Array, required: true }
  },
  methods: {
    dateFormat({ date }) {
      return DateFormat.adaptive(date);
    },
    dateTitleFormat({ date }) {
      return DateFormat.fixed(date);
    }
  }
};
</script>

<style scoped lang='sass'>
.date
  white-space: nowrap

.amount
  text-align: right
</style>
