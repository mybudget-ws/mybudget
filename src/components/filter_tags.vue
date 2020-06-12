<template>
  <div v-if='isVisible' class='tags-filters'>
    <div
      v-for='account in accounts'
      :key="'a-' + account.id"
      class='chip'
      @click='onRemoveAccount(account)'
    >
      <i class='account material-icons left'>
        account_balance
      </i>
      {{ account.name }}
      <i class='close material-icons'>close</i>
    </div>
    <div
      v-for='project in projects'
      :key="'p-' + project.id"
      class='chip'
      @click='onRemoveProject(project)'
    >
      <i class='project material-icons left'>work</i>
      {{ project.name }}
      <i class='close material-icons'>close</i>
    </div>
    <div
      v-for='category in categories'
      :key="'c-' + category.id"
      class='chip'
      @click='onRemoveCategory(category)'
    >
      {{ category.name }}
      <i class='close material-icons'>close</i>
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
    categories: get('filters/categories'),
    projects: get('filters/projects')
  },
  methods: {
    removeAccount: call('filters/removeAccount'),
    removeCategory: call('filters/removeCategory'),
    removeProject: call('filters/removeProject'),
    onRemoveAccount(account) {
      this.removeAccount({ account });
      this.$emit('onChange');
    },
    onRemoveCategory(category) {
      this.removeCategory({ category });
      this.$emit('onChange');
    },
    onRemoveProject(project) {
      this.removeProject({ project });
      this.$emit('onChange');
    }
  }
};
</script>

<style scoped lang='sass'>
i.account,
i.project
  margin-right: 4px
  padding-left: 4px
  font-size: 16px
  line-height: 32px
  opacity: 0.8

.chip
  &:hover
    opacity: 0.9
    cursor: pointer

.tags-filters
  @media only screen and (max-width: 601px)
    margin-bottom: 10px
</style>
