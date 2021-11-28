<template>
  <table class='categories-summary'>
    <thead>
      <tr>
        <th>{{ title }}</th>
        <th class='amount'>
          <Amount :value='total' :currency='currency' />
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for='(row, index) in data' :key='index'>
        <td>{{ row[0] }}</td>
        <td class='amount'>
          <Amount :value='normalizedValue(row[1])' :currency='currency' />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import Amount from '@/components/amount';

export default {
  name: 'CategoriesSummary',
  components: {
    Amount
  },
  props: {
    title: { type: String, required: true },
    data: { type: Array, required: true }
  },
  computed: {
    currency() {
      const parts = this.title.split(' ');
      return parts[parts.length - 1];
    },
    isIncome() {
      return !this.title.match(/Расход/);
    },
    total() {
      const totalValue = this.data.map(v => parseFloat(v[1])).reduce((a, b) => a + b, 0);
      if (this.isIncome) { return totalValue; }
      return -totalValue;
    }
  },
  methods: {
    normalizedValue(value) {
      if (this.isIncome) { return value; }
      return -parseFloat(value);
    }
  }
};
</script>

<style scoped lang='sass'>
.categories-summary
  margin-bottom: 20px

.amount
  float: right
  white-space: nowrap;
</style>
