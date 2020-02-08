<template>
  <div class='filters'>
    <!--div class='collection'>
      <a href='#!' class='collection-item'>Доходы</a>
      <a href='#!' class='collection-item'>Расходы</a>
      <a href='#!' class='collection-item'>Переводы</a>
    </div-->
    <div v-if='isAccounts' class='accounts'>
      <h6>Счета</h6>
      <p v-for='account in displayedAcccounts' :key='account.id'>
        <label>
          <Checkbox
            :id='account.id'
            :value='isChecked(account.id)'
            @change='onChange(account)'
          />
          <span>{{ account.name }}</span>
        </label>
      </p>
      <a
        v-if='isNeedShowAll && !isShowAllAccounts'
        class='btn-flat btn-small waves-effect waves-teal'
        @click='showAll'
      >
        Показать все
      </a>
      <a
        v-if='isNeedShowAll && isShowAllAccounts'
        class='btn-flat btn-small waves-effect waves-teal'
        @click='hideAll'
      >
        Скрыть счета
      </a>
    </div>
    <Categories @onChange="$emit('onChange')" />
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
  data: () => ({
    isShowAllAccounts: false
  }),
  computed: {
    token: get('user/token'),
    accounts: get('accounts/items'),
    categories: get('categories/items'),
    selectedAccounts: get('filters/accounts'),
    isAccountsLoaded: get('accounts/isLoaded'),
    isAccounts() { return this.accounts.length > 0; },
    favouriteAccounts() {
      return this.accounts.filter(v => v.isFavourite);
    },
    isNeedShowAll() {
      return this.favouriteAccounts.length > 0;
    },
    displayedAcccounts() {
      if (this.isNeedShowAll > 0 && !this.isShowAllAccounts) {
        return this.favouriteAccounts;
      }
      return this.accounts;
    }
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
    showAll() { this.isShowAllAccounts = true; },
    hideAll() { this.isShowAllAccounts = false; },
    isChecked(id) {
      return this.selectedAccounts.find(v => v.id === id) != null;
    },
    onChange(account) {
      this.toggleAccount({ account });
      this.$emit('onChange');
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
