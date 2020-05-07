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
            :value='isCheckedAccount(account.id)'
            @change='onChangeAccount(account)'
          />
          <span>{{ account.name }}</span>
        </label>
      </p>
      <a
        v-if='isNeedShowAllAccounts && !isShowAllAccounts'
        class='btn-flat btn-small waves-effect waves-teal'
        @click='showAll'
      >
        Показать все
      </a>
      <a
        v-if='isNeedShowAllAccounts && isShowAllAccounts'
        class='btn-flat btn-small waves-effect waves-teal'
        @click='hideAll'
      >
        Скрыть счета
      </a>
    </div>

    <Categories class='categories' @onChange="$emit('onChange')" />

    <div v-if='isProjects' class='projects'>
      <h6>Проекты</h6>
      <p v-for='project in projects' :key='project.id'>
        <label>
          <Checkbox
            :id='project.id'
            :value='isCheckedProject(project.id)'
            @change='onChangeProject(project)'
          />
          <span>{{ project.name }}</span>
        </label>
      </p>
    </div>
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
    accounts: get('accounts/visibleItemsFilter'),
    projects: get('projects/visibleItemsFilter'),
    selectedAccounts: get('filters/accounts'),
    selectedProjects: get('filters/projects'),
    isAccountsLoaded: get('accounts/isLoadedFilter'),
    isProjectsLoaded: get('projects/isLoadedFilter'),
    isAccounts() { return this.accounts.length > 0; },
    isProjects() { return this.projects.length > 0; },
    favouriteAccounts() { return this.accounts.filter(v => v.isFavourite); },
    isNeedShowAllAccounts() {
      return this.favouriteAccounts.length > 0 &&
        this.selectedAccounts.length < this.accounts.length;
    },
    displayedAcccounts() {
      if (this.isNeedShowAllAccounts > 0 && !this.isShowAllAccounts) {
        return this.accounts
          .filter(v => this.selectedAccounts.map(v => v.id).includes(v.id) || v.isFavourite);
      }
      return this.accounts;
    }
  },
  created() {
    if (!this.isAccountsLoaded) { this.fetchAccounts(this.token); }
    if (!this.isProjectsLoaded) { this.fetchProjects(this.token); }
  },
  methods: {
    fetchAccounts: call('accounts/fetchFilter'),
    fetchProjects: call('projects/fetchFilter'),
    toggleAccount: call('filters/toggleAccount'),
    toggleProject: call('filters/toggleProject'),
    showAll() { this.isShowAllAccounts = true; },
    hideAll() { this.isShowAllAccounts = false; },
    isCheckedAccount(id) {
      return this.selectedAccounts.find(v => v.id === id) != null;
    },
    isCheckedProject(id) {
      return this.selectedProjects.find(v => v.id === id) != null;
    },
    onChangeAccount(account) {
      this.toggleAccount({ account });
      this.$emit('onChange');
    },
    onChangeProject(project) {
      this.toggleProject({ project });
      this.$emit('onChange');
    }
  }
};
</script>

<style scoped lang='sass'>
.filters
  @media only screen and (min-width: 992px)
    padding-left: 30px

  .accounts,
  .categories
    margin-bottom: 40px
</style>
