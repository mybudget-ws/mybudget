<template>
  <div v-if='isTableVisible' class='col l10 m9 s12'>
    <List
      :items='items'
      @onAccount='onAccount'
      @onCategory='onCategory'
      @onProject='onProject'
      @onProperty='onProperty'
      @onDestroy='onDestroy'
    />

    <div class='row'>
      <Loader v-if='isLoadingPage' size='small' />
      <br>
      <a
        v-if='!isLoadingPage && !isEmpty && isMore'
        class='btn btn-flat'
        @click='more'
      >
        Загрузить ещё...
      </a>
    </div>
  </div>
</template>

<script>
import List from '@/components/transactions/list';
import Loader from '@/components/loader';
import { get, call } from 'vuex-pathify';

export default {
  name: 'Collection',
  components: {
    Loader,
    List
  },
  props: {
    accountId: { type: Number, required: false, default: undefined },
    backPath: { type: String, required: false, default: '/transactions' },
    isFiltersDisabled: { type: Boolean, required: false, default: false }
  },
  data: () => ({}),
  computed: {
    token: get('user/token'),
    filters: get('filters/params'),
    isVisible: get('filters/isVisible'),
    ...get('transactions/*'),
    isEmpty() { return !this.isLoading && this.items.length === 0; },
    isTableVisible() { return !this.isLoading && !this.isEmpty; },
    collectionFilters() {
      if (this.accountId) {
        return { accountIds: [this.accountId] };
      }
      return this.filters;
    }
  },
  async created() {
    await this.fetch({ token: this.token, filters: this.collectionFilters });
    this.$nextTick(() => {
      this.$emit('loaded');
    });
  },
  methods: {
    more() {
      this.fetchNext({ token: this.token, filters: this.collectionFilters });
    },
    ...call([
      'transactions/fetch',
      'transactions/fetchNext',
      'transactions/destroy',
      'filters/toggleAccount',
      'filters/toggleCategory',
      'filters/toggleProject',
      'filters/toggleProperty'
    ]),
    onAccount(account) {
      if (this.isFiltersDisabled) { return; }
      this.toggleAccount({ account });
      this.onChangeFilter();
    },
    onCategory(category) {
      if (this.isFiltersDisabled) { return; }
      this.toggleCategory({ category });
      this.onChangeFilter();
    },
    async onDestroy(transaction) {
      if (this.isDestroying) { return; }
      if (confirm('Удалить операцию. Вы уверены?')) {
        const res = await this.destroy({
          token: this.token,
          transaction,
          filters: this.collectionFilters
        });
        const message = res != null ?
          'Операция успешно удалена' :
          'Непредвиденная ошибка';
        /* eslint-disable */
        M.toast({ html: message });
        /* eslint-enable */
        this.$emit('destroy');
      }
    },
    onProject(project) {
      if (this.isFiltersDisabled) { return; }
      this.toggleProject({ project });
      this.onChangeFilter();
    },
    onProperty(property) {
      if (this.isFiltersDisabled) { return; }
      this.toggleProperty({ property });
      this.onChangeFilter();
    },
    onChangeFilter() {
      this.fetch({ token: this.token, filters: this.filters });
    }
  }
};
</script>

<style scoped lang='sass'>
</style>
