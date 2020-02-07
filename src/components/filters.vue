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
          <Checkbox
            :id='acc.id'
            :value='isChecked(acc.id)'
            @change='onChange(acc)'
          />
          <span>{{ acc.name }}</span>
        </label>
      </p>
    </div>
    <Categories />
  </div>
</template>

<script>
import Categories from '@/components/filter_categories';
import Checkbox from '@/components/checkbox';
import { get, call } from 'vuex-pathify';

export default {
  name: 'Filters',
  components: {
    Categories,
    Checkbox
  },
  props: {},
  data: () => ({}),
  computed: {
    token: get('user/token'),
    accounts: get('accounts/items'),
    categories: get('categories/items'),
    isAccountsLoaded: get('accounts/isLoaded'),
    isAccounts() { return this.accounts.length > 0; },
    selectedAccounts: get('filters/accounts')
  },
  created() {
    if (!this.isAccountsLoaded) { this.fetchAccounts(this.token); }
  },
  methods: {
    fetchAccounts: call('accounts/fetch'),
    fetchCategoires: call('categories/fetch'),
    // setFilterCategories: call('filters/setCategories'),
    // setFilterAccounts: call('filters/setAccounts'),
    // onSelectCategory(ids) {
    //   this.setFilterCategories({
    //     categories: this.categories.filter(v => ids.includes(v.id))
    //   });
    // },
    toggleAccount: call('filters/toggleAccount'),
    isChecked(id) {
      return this.selectedAccounts.find(v => v.id === id) != null;
    },
    onChange(account) {
      this.toggleAccount({ account });
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
