<template>
  <div v-if='isVisible'>
    <div
      v-for='category in categories'
      :key="'c-' + category.id"
      class='chip'
    >
      {{ category.name }}
      <i class='close material-icons' @click='removeCategory({ category })'>
        close
      </i>
    </div>
  </div>
</template>

<script>
import { get, call } from 'vuex-pathify';

export default {
  name: 'FilterTags',
  components: {},
  props: {},
  computed: {
    token: get('user/token'),
    // accounts: get('accounts/items'),
    // isAccountsLoaded: get('accounts/isLoaded'),
    // isAccounts() { return this.accounts.length > 0; },
    categories: get('filters/categories'),
    isVisible: get('filters/isVisible')
  },
  created() {
    // if (!this.isAccountsLoaded) { this.fetchAccounts(this.token); }
  },
  methods: {
    removeCategory: call('filters/removeCategory')
    // fetchCategoires: call('categories/fetch'),
    // onSelectCategory(ids) {
    //   this.categoryIds = ids;
    // }
  }
};
</script>

<style scoped lang='sass'>
</style>
