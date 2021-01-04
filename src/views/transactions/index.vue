<template>
  <div>
    <Menu />
    <div class='container container-wide'>
      <PageHeader name='Операции'>
        <TransactionOperations />
      </PageHeader>

      <div class='row'>
        <FilterTags class='col s12' @onChange='onChangeFilter' />

        <div class='col s12'>
          <Loader v-if='isLoading' />
          <div v-else-if='isAlert' class='card blue-grey col s12'>
            <div class='card-content white-text'>
              <span class='card-title'>У вас пока нет операций</span>
              <p>
                Нажмите на
                <i class='material-icons' style='font-size: 1.2rem'>arrow_upward</i> или
                <i class='material-icons' style='font-size: 1.2rem'>arrow_downward</i>,
                чтобы добавить ваш первых доход, или расход
              </p>
            </div>
          </div>
          <div v-if='isEmpty && !isAlert' class='card teal col l10 m9 s12'>
            <div class='card-content white-text'>
              <span class='card-title'>Таких операций нет</span>
              <p>Попробуйте изменить настройки фильтров</p>
            </div>
          </div>
          <Collection class='col l10 m9 s12' />

          <Filters
            v-if='!isLoading && !isAlert'
            class='col l2 m3 s12'
            @onChange='onChangeFilter'
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Collection from '@/components/transactions/collection';
import FilterTags from '@/components/filter_tags';
import Filters from '@/components/filters';
import Loader from '@/components/loader';
import Menu from '@/components/menu';
import PageHeader from '@/components/page_header';
import TransactionOperations from '@/components/transactions/operations';
import { get, call } from 'vuex-pathify';

const moment = require('moment');
moment.locale('ru');

export default {
  name: 'Transactions',
  components: {
    Collection,
    FilterTags,
    Filters,
    Loader,
    Menu,
    PageHeader,
    TransactionOperations
  },
  props: {},
  data: () => ({}),
  computed: {
    token: get('user/token'),
    filters: get('filters/params'),
    isVisible: get('filters/isVisible'),
    ...get([
      'transactions/items',
      'transactions/isLoading'
    ]),
    isAlert() { return this.isEmpty && !this.isVisible; },
    isEmpty() { return !this.isLoading && this.items.length === 0; }
  },
  methods: {
    ...call([
      'transactions/fetch'
    ]),
    onChangeFilter() {
      this.fetch({ token: this.token, filters: this.filters });
    }
  }
};
</script>

<style scoped lang='sass'>
</style>
