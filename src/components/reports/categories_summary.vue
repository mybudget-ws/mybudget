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
        <td>
          <a
            v-if='findCategory(row[0])'
            href='javascript:void(0);'
            @click='onFilterByCategory(row[0])'
          >
            {{ row[0] }}
          </a>
          <span v-else>
            {{ row[0] }}
          </span>
        </td>
        <td class='amount'>
          <Amount :value='normalizedValue(row[1])' :currency='currency' />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import Amount from '@/components/amount';
import { get, call } from 'vuex-pathify';

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
    categories: get('categories/items'),
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
    ...call([
      'filters/reset',
      'filters/setCategories'
    ]),
    normalizedValue(value) {
      if (this.isIncome) { return value; }
      return -parseFloat(value);
    },
    findCategory(categoryName) {
      if (this.categories == null) { return null; }
      return this.categories.find(v => v.name === categoryName);
    },
    onFilterByCategory(categoryName) {
      const category = this.findCategory(categoryName);
      if (category != null) {
        this.reset();
        this.setCategories({ categories: [category] });
      }
      this.$router.push({ name: 'transactions' });
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
