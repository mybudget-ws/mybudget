<template>
  <div v-if='isVisible'>
    <div class='chip'>
      Tag
      <i class='close material-icons'>close</i>
    </div>
  </div>
</template>

<script>
import { get } from 'vuex-pathify';

export default {
  name: 'FilterTags',
  components: {},
  props: {},
  computed: {
    token: get('user/token'),
    // accounts: get('accounts/items'),
    // isAccountsLoaded: get('accounts/isLoaded'),
    // isAccounts() { return this.accounts.length > 0; },
    // categories: get('categories/items')
    isVisible() { return true; }
  },
  created() {
    // if (!this.isAccountsLoaded) { this.fetchAccounts(this.token); }
  },
  methods: {
    // fetchAccounts: call('accounts/fetch'),
    // fetchCategoires: call('categories/fetch'),
    // onSelectCategory(ids) {
    //   this.categoryIds = ids;
    // }
  }
};
</script>

<style scoped lang='sass'>
</style>
