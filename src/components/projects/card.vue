<template>
  <div
    class='card z-depth-0'
    :class='colorClasses'
  >
    <div class='card-content'>
      <div class='name blue-grey-text text-darken-3'>{{ name }}</div>
      <div v-if='balances.length === 0' class='card-title'>
        <Amount value='0' currency='RUB' />
      </div>
      <div v-if='balances.length == 1' class='card-title'>
        <Amount :value='balances[0].amount' :currency='balances[0].currency.name' />
      </div>
      <div v-if='balances.length > 1' class='card-title'>
        <Amount
          class='total-amount'
          :value='balances.map(v => v.amountBase).reduce((a, b) => a + b)'
          :currency='currencyName'
        />
        <Amount
          v-for='(balance, index) in balances'
          :key='index'
          :value='balance.amount'
          :currency='balance.currency.name'
          class='balance-amount'
        />
      </div>
      <div class='card-action'>
        <a
          class='grey-text text-darken-2'
          @click='$emit("edit")'
        >
          Изменить
        </a>
        <a
          class='grey-text text-darken-2'
          @click='$emit("hide")'
        >
          Скрыть
        </a>
        <a
          class='grey-text text-darken-2 last'
          @click='$emit("destroy")'
        >
          Удалить
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import Amount from '@/components/amount';

export default {
  name: 'AccountCard',
  components: {
    Amount
  },
  props: {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    balances: { type: Array, required: true },
    color: { type: String, required: true }
  },
  data: () => ({
  }),
  computed: {
    colorClasses() {
      return `${this.color.replace('lighten-2', '')} lighten-4`;
    },
    currencyName() {
      if (this.balances == null || this.balances.length === 0) { return ''; }
      return this.balances[0].currencyBase.name;
    }
  },
  methods: {}
};
</script>

<style scoped lang='sass'>
.card
  position: relative
  padding: 14px 0 10px 0
  margin: 0 0 18px
  padding: 8px 12px 0px
  border-radius: 8px

  .card-title
    margin-bottom: 2px

  .card-content
    padding: 0
    margin-bottom: 10px

    .name
      font-size: 18px
      font-weight: 400

  .card-action
    padding: 12px 0

    a.last
      margin-right: 0 !important

  .balance-amount
    font-size: 16px
    max-height: 24px

    &:last-child
      margin-bottom: 14px

  .total-amount
    border-bottom: 1px solid rgba(0,0,0, 0.06)

    &:after
      color: #757575
      content: '(всего)'
      font-size: 13px
      font-weight: 200
      margin-left: 6px
      padding-top: 4px
      position: absolute
</style>
