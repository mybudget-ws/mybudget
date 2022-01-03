<template>
  <div>
    <div v-if='isPhone' class='card-list'>
      <div v-for='(title, index) in rowTitles' :key='index' class='card blue-grey lighten-5 z-depth-0'>
        <div class='card-content'>
          <div class='card-title'>{{ title }}</div>
          <div>
            Минимум
            <Amount :value='min(index)' :currency='currency(index)' class='amount' />
          </div>
          <div>
            Максимум
            <Amount :value='max(index)' :currency='currency(index)' class='amount' />
          </div>
          <div>
            Среднее
            <Amount :value='avg(index)' :currency='currency(index)' class='amount' />
          </div>
        </div>
      </div>
    </div>

    <table v-else>
      <thead>
        <tr>
          <th />
          <th>Минимум</th>
          <th>Максимум</th>
          <th>Среднее</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for='(title, index) in rowTitles' :key='index'>
          <td class='title'>{{ title }}</td>
          <td>
            <Amount :value='min(index)' :currency='currency(index)' />
          </td>
          <td>
            <Amount :value='max(index)' :currency='currency(index)' />
          </td>
          <td>
            <Amount :value='avg(index)' :currency='currency(index)' />
          </td>
        </tr>
        <tr v-if='isEmpty'>
          <td colspan='4' class='empty grey-text'>Недостаточно данных</td>
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
  name: 'ColumnsSummary',
  components: {
    Amount
  },
  props: {
    /**
    [
      [ "x", "авг. 21", ..., "янв. 22" ],
      [ "Доходы, RUB", 0, ..., "51613.0" ],
      [ "Расходы, RUB", 0, ..., "1212.0" ],
      [ "Доходы, USD", 0, ..., "100.0" ]
    ]
    **/
    data: { type: Array, required: true }
  },
  data: () => ({
    isPhone: md.phone() != null
  }),
  computed: {
    rows() { return this.data.slice(1); },
    rowTitles() {
      return this.rows.map(v => v[0]);
    },
    rowValues() {
      return this.rows.map(v => v.slice(1));
    },
    isEmpty() { return this.rows == null || this.rows.length === 0; }
  },
  methods: {
    currency(index) {
      return this.rowTitles[index].split(', ')[1];
    },
    isIncome(index) {
      return !!this.rowTitles[index].match(/Доход/);
    },
    values(index) {
      const values = this.rowValues[index];
      if (values == null || values.length === 0) { return null; }
      return values.map(v => parseFloat(v));
    },
    min(index) {
      const values = this.values(index);
      if (values == null) { return 0.0; }
      const min = Math.min(...values);
      return this.isIncome(index) ? min : -min;
    },
    max(index) {
      const values = this.values(index);
      if (values == null) { return 0.0; }
      const max = Math.max(...values);
      return this.isIncome(index) ? max : -max;
    },
    avg(index) {
      const values = this.values(index);
      if (values == null) { return 0.0; }
      const total = values.reduce((sum, x) => sum + x, 0);
      const avg = Math.round(total / values.length, 2);
      return this.isIncome(index) ? avg : -avg;
    }
  }
};
</script>

<style scoped lang='sass'>
.card-list
  margin-top: 20px

.card
  .amount
    float: right

table
  margin-bottom: 40px

th, td
  text-align: right
  width: 25%

  &.title
    text-align: left

  &.empty
    text-align: center
</style>
