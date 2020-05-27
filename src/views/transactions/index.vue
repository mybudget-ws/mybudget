<template>
  <div>
    <Menu />
    <div class='container container-wide'>
      <PageHeader name='Операции' action='/transactions/new'>
        <router-link
          v-if='isTransferVisible'
          to='/transactions/transfers/new'
          class='btn-floating waves-effect waves-light blue-grey lighten-5 z-depth-0 new-transfer'
        >
          <i class='material-icons grey-text text-darken-1'>repeat</i>
        </router-link>
      </PageHeader>

      <div class='row'>
        <FilterTags class='col s12' @onChange='onChangeFilter' />

        <div class='col s12'>
          <Loader v-if='isLoading' />
          <div v-else-if='isAlert' class='card blue-grey darken-1 col s12'>
            <div class='card-content white-text'>
              <span class='card-title'>У вас пока нет операций</span>
              <p>Нажмите на "плюс", чтобы добавить ваш первых доход или расход</p>
            </div>
          </div>
          <div v-if='isEmpty && !isAlert' class='card teal col l10 m9 s12'>
            <div class='card-content white-text'>
              <span class='card-title'>Таких операций нет</span>
              <p>Попробуйте изменить настройки фильтров</p>
            </div>
          </div>
          <div v-if='isTableVisible' class='col l10 m9 s12'>
            <table class='row'>
              <thead>
                <tr>
                  <th class='date'>Дата</th>
                  <th class='amount'>Величина</th>
                  <th />
                  <th />
                </tr>
              </thead>

              <tbody>
                <tr v-for='item in items' :key='item.id'>
                  <td :title='dateTitleFormat(item)'>{{ dateFormat(item) }}</td>
                  <td class='amount'>
                    <Amount :value='item.amount' :currency='item.account.currency.name' />
                  </td>
                  <td>
                    <TagAccount
                      :account='item.account'
                      @click='onAccount(item.account)'
                    />
                    <span
                      v-if='item.isTransfer'
                      class='transfer new badge black-text tag teal lighten-4'
                      data-badge-caption=''
                    >
                      <i class='material-icons'>repeat</i>
                    </span>
                    <span
                      v-if='item.project != null'
                      class='new badge black-text tag'
                      :class='item.project.color'
                      :data-badge-caption='item.project.name'
                      @click='onProject(item.project)'
                    >
                      <i class='project material-icons left'>
                        work
                      </i>
                    </span>
                    <span
                      v-for='category in item.categories'
                      :key='category.id'
                      class='new badge black-text tag'
                      :class='category.color'
                      :data-badge-caption='category.name'
                      @click='onCategory(category)'
                    />

                    <i class='description grey-text text-darken-1'>
                      {{ item.description }}
                    </i>
                  </td>
                  <td class='actions'>
                    <router-link
                      :to="`/transactions/${item.id}/edit`"
                      class='waves-effect waves-teal btn-flat'
                    >
                      <i class='material-icons grey-text'>edit</i>
                    </router-link>
                    <a
                      class='waves-effect waves-teal btn-flat'
                      @click='onDestroy(item)'
                    >
                      <i class='material-icons grey-text'>delete</i>
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
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

          <Filters
            v-if='!isLoading'
            class='col l2 m3 s12'
            @onChange='onChangeFilter'
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Amount from '@/components/amount';
import FilterTags from '@/components/filter_tags';
import Filters from '@/components/filters';
import Loader from '@/components/loader';
import Menu from '@/components/menu';
import PageHeader from '@/components/page_header';
import TagAccount from '@/components/tag_account';
import { get, call } from 'vuex-pathify';

const moment = require('moment');
moment.locale('ru');

export default {
  name: 'Transactions',
  components: {
    Amount,
    FilterTags,
    Filters,
    Loader,
    Menu,
    PageHeader,
    TagAccount
  },
  props: {},
  computed: {
    token: get('user/token'),
    filters: get('filters/params'),
    accounts: get('accounts/visibleItemsFilter'),
    isVisible: get('filters/isVisible'),
    ...get('transactions/*'),
    isAlert() { return this.isEmpty && !this.isVisible; },
    isEmpty() { return !this.isLoading && this.items.length === 0; },
    isTableVisible() { return !this.isLoading && !this.isEmpty; },
    isTransferVisible() { return this.accounts.length > 1; }
  },
  async created() {
    await this.fetch({ token: this.token, filters: this.filters });
  },
  methods: {
    more() {
      this.fetchNext({ token: this.token, filters: this.filters });
    },
    // fetchAccounts: call('accounts/fetch'),
    ...call([
      'transactions/fetch',
      'transactions/fetchNext',
      'transactions/destroy',
      'filters/toggleAccount',
      'filters/toggleCategory',
      'filters/toggleProject'
    ]),
    onChangeFilter() {
      this.fetch({ token: this.token, filters: this.filters });
    },
    async onDestroy(transaction) {
      if (this.isDestroying) { return; }
      if (confirm('Удалить операцию. Вы уверены?')) {
        const { token, filters } = this;
        const res = await this.destroy({ token, transaction, filters });
        const message = res != null ?
          'Операция успешно удалена' :
          'Непредвиденная ошибка';
        /* eslint-disable */
        M.toast({ html: message });
        /* eslint-enable */
      }
    },
    dateFormat(transaction) {
      const date = moment(transaction.dateAt);
      const current = moment();
      if (moment(date).isSame(current, 'day')) {
        return 'Сегодня';
      }
      if (current.subtract(1, 'days').isSame(date, 'day')) {
        return 'Вчера';
      }
      if (current.year() === date.year()) {
        return date.format('DD MMMM');
      }

      return date.format('DD.MM.YYYY');
    },
    dateTitleFormat(transaction) {
      return moment(transaction.dateAt).format('DD.MM.YYYY');
    },
    onAccount(account) {
      this.toggleAccount({ account });
      this.onChangeFilter();
    },
    onCategory(category) {
      this.toggleCategory({ category });
      this.onChangeFilter();
    },
    onProject(project) {
      this.toggleProject({ project });
      this.onChangeFilter();
    }
  }
};
</script>

<style scoped lang='sass'>
td
  padding: 10px 5px

.date
  width: 90px

.amount
  width: 140px
  text-align: right

// TODO: Remove duplications
.actions
  width: 86px
  text-align: right

  .btn-flat
    padding: 0 8px !important
//

.tag
  margin-right: 6px

i.project
  font-size: 12px
  line-height: 22px
  margin-right: 3px
  opacity: 0.7
  padding-left: 0px

.transfer.badge
  min-width: 18px
  i
    font-size: 16px
    line-height: 22px
    opacity: 0.7
    vertical-align: bottom

.badge
  cursor: pointer
  &:hover
    opacity: 0.9

.description
  font-size: 14px
  font-weight: 200

.new-transfer
  margin-left: 14px
</style>
