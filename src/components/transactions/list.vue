<template>
  <div>
    <table v-if='!isPhone'>
      <thead>
        <tr>
          <th class='date'>Дата</th>
          <th class='amount'>Величина</th>
          <th />
          <th />
        </tr>
      </thead>

      <tbody>
        <tr
          v-for='item in items'
          :key='item.id'
          :data-month='monthDelimiter(item)'
        >
          <td class='date' :class="{ 'with-month': isMonthShow(item) }" :title='dateTitleFormat(item)'>
            {{ dateFormat(item) }}
          </td>
          <td class='amount' :class="{ 'with-month': isMonthShow(item) }" :title='dateTitleFormat(item)'>
            <Amount :value='item.amount' :currency='item.account.currency.name' />
          </td>
          <td :class="{ 'with-month': isMonthShow(item) }" :title='dateTitleFormat(item)'>
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
            <BadgeProperty
              v-if='item.property != null'
              :color='item.property.color'
              :name='item.property.name'
              @click='onProperty(item.property)'
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
          <td class='actions' :class="{ 'with-month': isMonthShow(item) }" :title='dateTitleFormat(item)'>
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
              :to="`/transactions/${item.id}/edit?backTo=${backPath}`"
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
    <div v-if='isPhone'>
      <div
        v-for='item in items'
        :key='item.id'
        class='card z-depth-0 mobile-transaction'
        :class="{
          'green lighten-5': item.amount > 0,
          'red lighten-5': item.amount <= 0,
          'with-month': isMonthShow(item)
        }"
        :data-month='monthDelimiter(item)'
      >
        <div class='card-content'>
          <Amount
            :value='item.amount'
            :currency='item.account.currency.name'
            class='card-title'
          />
          <span :title='dateTitleFormat(item)' class='date'>{{ dateFormat(item) }}</span>
          <div class='tag-list'>
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
            <BadgeProperty
              v-if='item.property != null'
              :color='item.property.color'
              :name='item.property.name'
              @click='onProperty(item.property)'
            />
            <BadgeCategory
              v-for='category in item.categories'
              :key='category.id'
              v-bind='category'
              @click='onCategory(category)'
            />
          </div>
          <p v-if='item.description != null && item.description != ""'>
            <i class='description blue-grey-text text-darken-4'>
              {{ item.description }}
            </i>
          </p>
        </div>
        <div class='card-action'>
          <router-link
            :to="`/transactions/${item.id}/edit?backTo=${backPath}`"
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
            class='grey-text text-darken-2'
            @click='onDestroy(item)'
          >
            Удалить
          </a>
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
import BadgeProperty from '@/components/badges/property';

import DateFormat from '@/utils/date_format';
import MobileDetect from 'mobile-detect';
const md = new MobileDetect(window.navigator.userAgent);

export default {
  name: 'TransactionList',
  components: {
    Amount,
    BadgeAccount,
    BadgeCategory,
    BadgeProject,
    BadgeProperty
  },
  props: {
    items: { type: Array, required: true },
    backPath: { type: String, required: false, default: '/transactions' }
  },
  data: () => ({
    months: {},
    isPhone: md.phone() != null
  }),
  computed: {},
  methods: {
    dateFormat({ dateAt }) {
      return DateFormat.adaptive(dateAt);
    },
    dateTitleFormat({ dateAt }) {
      return DateFormat.fixed(dateAt);
    },
    copyUrl(item) {
      const accountId = item.account.id;
      const projectId = item.project?.id || '';
      const propertyId = item.property?.id || '';
      const categoryIds = item.categories.map(v => v.id);
      return `/transactions/new?account=${accountId}` +
        `&project=${projectId}&property=${propertyId}&category=${categoryIds}` +
        `&description=${item.description == null ? '' : encodeURIComponent(item.description)}` +
        `&amount=${Math.abs(item.amount)}&isIncome=${item.amount > 0}` +
        `&backTo=${this.backPath}`;
    },
    onAccount(account) {
      this.$emit('onAccount', account);
    },
    onCategory(category) {
      this.$emit('onCategory', category);
    },
    onProject(project) {
      this.$emit('onProject', project);
    },
    onProperty(property) {
      this.$emit('onProperty', property);
    },
    onDestroy(transaction) {
      this.$emit('onDestroy', transaction);
    },
    isMonthShow({ id, dateAt }) {
      const month = DateFormat.monthAdaptive(dateAt);
      if (Object.entries(this.months).length == 0) {
        this.months[month] = '';
        return false;
      }
      if (this.months[month] == null) {
        this.months[month] = id;
        return true;
      }
      return this.months[month] == id;
    },
    monthDelimiter(item) {
      if (!this.isMonthShow(item)) { return null; }

      return DateFormat.monthAdaptive(item.dateAt);
    }
  }
};
</script>

<style scoped lang='sass'>
tr
  position: relative

[data-month]:after
  content: attr(data-month)
  position: absolute
  font-size: 18px
  left: 0
  top: 20px
  width: 100%
  border-bottom: 1px solid rgba(0, 0, 0, 0.12)
  color: #9e9e9e
  padding-left: 5px
  padding-bottom: 4px
  text-transform: capitalize

  @media only screen and (max-width: 601px)
    border-bottom: none
    padding-left: 0
    top: -34px
    color: #455a64

td
  padding: 10px 5px

  &.with-month
    padding-top: 60px

.date
  width: 96px
  white-space: nowrap

.amount
  width: 140px
  text-align: right

.actions
  width: 118px
  text-align: right
  padding-right: 0

  .btn-flat
    padding: 0 8px !important

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
  font-weight: 200

.card.mobile-transaction
  position: relative
  padding: 14px 0 10px 0
  margin: 0 0 18px
  padding: 8px 12px 0px
  border-radius: 8px

  &.with-month
    margin-top: 50px

  .date
    position: absolute
    top: 10px
    right: 14px
    text-align: right
    font-weight: 400
    color: #37474f

  .card-title
    margin-bottom: 2px

  .card-content
    padding: 0
    margin-bottom: 10px

  .tag-list
    min-height: 24px
    display: flex
    flex-direction: row
    overflow-x: scroll

    span.badge
      margin-left: 0
      margin-bottom: 4px
      display: flex

  .card-action
    padding: 0
    display: flex
    justify-content: space-between

    a
      display: inline-block
      padding: 10px 0
      margin-right: 0 !important
      font-size: 0.8rem
</style>
