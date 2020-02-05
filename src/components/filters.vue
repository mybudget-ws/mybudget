<template>
  <div class='filters'>
    <!--div class='collection'>
      <a href='#!' class='collection-item'>Доходы</a>
      <a href='#!' class='collection-item'>Расходы</a>
      <a href='#!' class='collection-item'>Переводы</a>
    </div-->
    <div v-if='isAccounts' class='accounts'>
      <h6>Счета</h6>
      <p v-for='acc in accounts' :key='acc.id'>
        <label>
          <input
            :id='acc.id'
            v-model='accountIds'
            type='checkbox'
            :value='acc.id'
          >
          <span>{{ acc.name }}</span>
        </label>
      </p>
    </div>
    <Categories @change='onSelectCategory' />
  </div>
</template>

<script>
import Categories from '@/components/filter_categories';
import { get, call } from 'vuex-pathify';

export default {
  name: 'Filters',
  components: {
    Categories
  },
  props: {},
  data: () => ({
    accountIds: []
  }),
  computed: {
    token: get('user/token'),
    accounts: get('accounts/items'),
    categories: get('categories/items'),
    isAccountsLoaded: get('accounts/isLoaded'),
    isAccounts() { return this.accounts.length > 0; }
  },
  created() {
    if (!this.isAccountsLoaded) { this.fetchAccounts(this.token); }
  },
  methods: {
    fetchAccounts: call('accounts/fetch'),
    fetchCategoires: call('categories/fetch'),
    setFilterCategories: call('filters/setCategories'),
    onSelectCategory(ids) {
      this.setFilterCategories({
        categories: this.categories.filter(v => ids.includes(v.id))
      });
    }
  }
};
</script>

<style scoped lang='sass'>
.filters
  padding-left: 40px

  .accounts
    margin-bottom: 40px
</style>
