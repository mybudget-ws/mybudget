<template>
  <div v-if='isVisible'>
    <div
      v-for='account in accounts'
      :key="'a-' + account.id"
      class='chip'
    >
      <i class='account material-icons left'>
        account_balance
      </i>
      {{ account.name }}
      <i class='close material-icons' @click='removeAccount({ account })'>
        close
      </i>
    </div>
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
    isVisible: get('filters/isVisible'),
    accounts: get('filters/accounts'),
    categories: get('filters/categories')
  },
  methods: {
    removeAccount: call('filters/removeAccount'),
    removeCategory: call('filters/removeCategory')
  }
};
</script>

<style scoped lang='sass'>
i.account
  margin-right: 4px
  padding-left: 4px
  font-size: 16px
  line-height: 32px
  opacity: 0.8
</style>
