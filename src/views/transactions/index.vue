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
          <div v-if='isTableVisible' class='col l10 m9 s12'>
            <table v-if='!isPhone' class='row'>
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
                    <BadgeAccount
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
                    <BadgeProject
                      v-if='item.project != null'
                      :color='item.project.color'
                      :name='item.project.name'
                      @click='onProject(item.project)'
                    />
                    <BadgeCategory
                      v-for='category in item.categories'
                      :key='category.id'
                      v-bind='category'
                      @click='onCategory(category)'
                    />

                    <i class='description grey-text text-darken-1'>
                      {{ item.description }}
                    </i>
                  </td>
                  <td class='actions'>
                    <router-link
                      v-if='!item.isTransfer'
                      title='Скопировать операцию'
                      :to='copyUrl(item)'
                      class='waves-effect waves-teal btn-flat'
                    >
                      <i class='material-icons grey-text'>content_copy</i>
                    </router-link>
                    <router-link
                      title='Редактировать операцию'
                      :to="`/transactions/${item.id}/edit`"
                      class='waves-effect waves-teal btn-flat'
                    >
                      <i class='material-icons grey-text'>edit</i>
                    </router-link>
                    <a
                      title='Удалить операцию'
                      class='waves-effect waves-teal btn-flat'
                      @click='onDestroy(item)'
                    >
                      <i class='material-icons grey-text'>delete</i>
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-if='isPhone' class='row'>
              <div
                v-for='item in items'
                :key='item.id'
                class='card z-depth-0 mobile-transaction'
                :class='item.amount > 0 ? "green lighten-5" : "red lighten-5"'
              >
                <div class='card-content'>
                  <Amount
                    :value='item.amount'
                    :currency='item.account.currency.name'
                    class='card-title'
                  />
                  <span :title='dateTitleFormat(item)' class='date'>{{ dateFormat(item) }}</span>
                  <div class='card-content tags'>
                    <BadgeAccount
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
                    <BadgeProject
                      v-if='item.project != null'
                      :color='item.project.color'
                      :name='item.project.name'
                      @click='onProject(item.project)'
                    />
                    <BadgeCategory
                      v-for='category in item.categories'
                      :key='category.id'
                      v-bind='category'
                      @click='onCategory(category)'
                    />
                    <i
                      v-if='item.description != null && item.description != ""'
                      class='description grey-text text-darken-2'
                    >
                      {{ item.description }}
                    </i>
                  </div>
                </div>
                <div class='card-action'>
                  <router-link
                    :to="`/transactions/${item.id}/edit`"
                    class='grey-text text-darken-2'
                  >
                    Изменить
                  </router-link>
                  <router-link
                    v-if='!item.isTransfer'
                    :to='copyUrl(item)'
                    class='grey-text text-darken-2'
                  >
                    Повторить
                  </router-link>
                  <a
                    class='grey-text text-darken-2 last'
                    @click='onDestroy(item)'
                  >
                    Удалить
                  </a>
                </div>
              </div>
            </div>

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
import Amount from '@/components/amount';
import BadgeAccount from '@/components/badges/account';
import BadgeCategory from '@/components/badges/category';
import BadgeProject from '@/components/badges/project';
import FilterTags from '@/components/filter_tags';
import Filters from '@/components/filters';
import Loader from '@/components/loader';
import Menu from '@/components/menu';
import PageHeader from '@/components/page_header';
import TransactionOperations from '@/components/transactions/operations';
import { get, call } from 'vuex-pathify';

const moment = require('moment');
moment.locale('ru');

import MobileDetect from 'mobile-detect';
const md = new MobileDetect(window.navigator.userAgent);

export default {
  name: 'Transactions',
  components: {
    Amount,
    BadgeAccount,
    BadgeCategory,
    BadgeProject,
    FilterTags,
    Filters,
    Loader,
    Menu,
    PageHeader,
    TransactionOperations
  },
  props: {},
  data: () => ({
    isPhone: md.phone() != null
  }),
  computed: {
    token: get('user/token'),
    filters: get('filters/params'),
    isVisible: get('filters/isVisible'),
    ...get('transactions/*'),
    isAlert() { return this.isEmpty && !this.isVisible; },
    isEmpty() { return !this.isLoading && this.items.length === 0; },
    isTableVisible() { return !this.isLoading && !this.isEmpty; }
  },
  async created() {
    await this.fetch({ token: this.token, filters: this.filters });
  },
  methods: {
    more() {
      this.fetchNext({ token: this.token, filters: this.filters });
    },
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
    copyUrl(item) {
      const accountId = item.account.id;
      const projectId = item.project?.id || '';
      const categoryIds = item.categories.map(v => v.id);
      return `/transactions/new?account=${accountId}` +
        `&project=${projectId}&category=${categoryIds}` +
        `&description=${item.description == null ? '' : encodeURIComponent(item.description)}` +
        `&amount=${Math.abs(item.amount)}&isIncome=${item.amount > 0}`;
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
  width: 118px
  text-align: right
  padding-right: 0

  .btn-flat
    padding: 0 8px !important
//

.tag
  margin-right: 6px

.transfer.badge
  min-width: 18px
  i
    font-size: 16px
    line-height: 22px
    opacity: 0.7
    vertical-align: bottom

.description
  font-size: 14px
  font-weight: 200

.card.mobile-transaction
  position: relative
  padding: 14px 0 10px 0
  margin: 0 0 18px
  padding: 8px 12px 0px
  border-radius: 8px

  .date
    position: absolute
    top: 10px
    right: 14px
    text-align: right
    font-weight: 200
    color: #424242

  .card-title
    margin-bottom: 2px

  .card-content
    padding: 0
    margin-bottom: 10px

    &.tags
      min-height: 24px

    span.badge
      float: left
      margin-left: 0
      margin-bottom: 4px

  .card-action
    padding: 12px 0

    a.last
      margin-right: 0 !important
</style>
