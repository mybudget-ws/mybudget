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
    <div v-if='isCategories'>
      <h6>Категории</h6>
      <p v-for='category in categories' :key='category.id'>
        <label>
          <input
            :id='category.id'
            v-model='categoryIds'
            type='checkbox'
            :value='category.id'
          >
          <span>{{ category.name }}</span>
        </label>
      </p>
    </div>
  </div>
</template>

<script>
import { get, call } from 'vuex-pathify';

export default {
  name: 'Filters',
  components: {},
  props: {},
  data: () => ({
    accountIds: [],
    categoryIds: []
  }),
  computed: {
    token: get('user/token'),
    accounts: get('accounts/items'),
    categories: get('categories/items'),
    isAccountsLoaded: get('accounts/isLoaded'),
    isCategoiresLoaded: get('categories/isLoaded'),
    isAccounts() { return this.accounts.length > 0; },
    isCategories() { return this.accounts.length > 0; }
  },
  created() {
    if (!this.isAccountsLoaded) { this.fetchAccounts(this.token); }
    if (!this.isCategoiresLoaded) { this.fetchCategoires(this.token); }
  },
  methods: {
    fetchAccounts: call('accounts/fetch'),
    fetchCategoires: call('categories/fetch')
  }
};
</script>

<style scoped lang='sass'>
.filters
  padding-left: 40px

  .accounts
    margin-bottom: 40px
</style>
