<template>
  <div>
    <Menu />
    <div class='container container-wide'>
      <Loader v-if='isLoading' />

      <PageHeader v-if='!isLoading' :name='name'>
        <template v-slot:subtitle>
          <div class='col grey-text text-darken-1'>
            {{ kindText }}
          </div>
          <div class='col s12'>
            <Amount :value='amount' :currency='currency' class='balance' />
          </div>
        </template>
      </PageHeader>

      <div class='row'>
        <div class='col'>
          График изменений цены (скоро)
        </div>
      </div>

      <div class='row'>
        <div class='col'>
          Список цен (скоро)
        </div>
      </div>

      <div class='row'>
        <div class='col'>
          Список расходов/расходов (скоро)
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Amount from '@/components/amount';
import Loader from '@/components/loader';
import Menu from '@/components/menu';
import PageHeader from '@/components/page_header';
import { get, call } from 'vuex-pathify';

export default {
  components: {
    Amount,
    Loader,
    Menu,
    PageHeader
  },
  data: () => ({}),
  computed: {
    token: get('user/token'),
    ...get('property/*'),
    id() { return this.$route.params.id; }
  },
  created() {
    this.fetch({ token: this.token, id: this.id });
  },
  methods: {
    ...call('property/*')
  }
};
</script>

<style scoped lang='sass'>
</style>
