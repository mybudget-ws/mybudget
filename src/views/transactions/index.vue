<template>
  <div>
    <Menu />
    <div class='container'>
      <PageHeader name='Операции'>
        <a class='btn-floating waves-effect waves-light yellow z-depth-0'>
          <i class='material-icons grey-text text-darken-4'>add</i>
        </a>
      </PageHeader>
      <div class='row'>
        <div class='col s12'>
          <p v-if='isLoading'>Загрузка...</p>
          <div v-else>TODO</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Menu from '@/components/menu';
import PageHeader from '@/components/page_header';
import { get, call } from 'vuex-pathify';

export default {
  name: 'Transactions',
  components: {
    Menu,
    PageHeader
  },
  props: {},
  computed: {
    token: get('user/token'),
    ...get('transactions/*'),
    isAllow() {
      return !this.isLoading && this.items.length === 0;
    }
  },
  async created() {
    await this.fetch(this.token);
    if (!this.isAllow) {
      this.$router.push({ name: 'new_account', query: { first: true } });
    }
  },
  methods: {
    ...call([
      'transactions/fetch'
    ])
  }
};
</script>

<style scoped lang='sass'>
</style>
