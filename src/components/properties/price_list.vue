<template>
  <table v-bind='$attrs'>
    <thead>
      <tr>
        <th>Дата</th>
        <th class='amount'>Величина</th>
        <th />
      </tr>
    </thead>
    <tbody>
      <tr v-for='item in items' :key='item.id'>
        <td :title='dateTitleFormat(item)'>
          <span class='date'>
            {{ dateFormat(item) }}
          </span>
          <i class='description grey-text text-darken-1'>
            {{ item.description }}
          </i>
        </td>
        <td class='amount'>
          <Amount :value='item.amount' :currency='item.currency.name' />
        </td>
        <td class='actions'>
          <router-link
            title='Редактировать цену'
            :to='editUrl(item)'
            class='waves-effect waves-teal btn-flat'
          >
            <i class='material-icons grey-text'>edit</i>
          </router-link>
          <a
            title='Удалить цену'
            class='waves-effect waves-teal btn-flat'
            @click='onDestroy(item)'
          >
            <i class='material-icons grey-text'>delete</i>
          </a>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import Amount from '@/components/amount';
import DateFormat from '@/utils/date_format';

export default {
  name: 'PriceList',
  components: {
    Amount
  },
  props: {
    items: { type: Array, required: true }
  },
  computed: {
    propertyId() { return this.$route.params.id; },
    backPath() { return `/properties/${this.propertyId}`; }
  },
  methods: {
    dateFormat({ date }) {
      return DateFormat.adaptive(date);
    },
    dateTitleFormat({ date }) {
      return DateFormat.fixed(date);
    },
    editUrl({ id, amount, date, description }) {
      return `${this.backPath}/prices/${id}/edit?amount=${amount}` +
        `&date=${DateFormat.toParam(date)}&description=${encodeURI(description)}` +
        `&backTo=${this.backPath}`;
    },
    onDestroy({ id }) {
      if (this.items.length <= 1) {
        return alert('Нельзя удалить единственную цену');
      }
      this.$emit('onDestroy', id);
    }
  }
};
</script>

<style scoped lang='sass'>
.date
  white-space: nowrap
  margin-right: 10px

.description
  font-weight: 200

.amount
  text-align: right

.actions
  width: 100px
  text-align: right
  padding-right: 0

  .btn-flat
    padding: 0 8px !important
</style>
