<template>
  <div
    class='card z-depth-0 lighten-4'
    :class='color'
  >
    <div class='card-content'>
      <div class='name blue-grey-text text-darken-3'>
        {{ name }}
        <span v-if='kind === "credit"' class='badge'>Кредит</span>
      </div>
      <a class='btn-flat star' @click='$emit("favourite")'>
        <i v-if='isFavourite' class='material-icons yellow-text text-accent-4' style='font-size: 1.8rem'>star</i>
        <i v-else class='material-icons grey-text' style='font-size: 1.8rem'>star_border</i>
      </a>
      <Amount :value='balance' :currency='currency.name' class='card-title' />
      <div class='transaction-actions'>
        <router-link
          :to="`/transactions/new?account=${id}`"
          class='btn-small waves-effect waves-light red lighten-2 z-depth-0'
        >
          <i class='material-icons white-text' style='font-size: 1.4rem'>arrow_downward</i>
        </router-link>
        <router-link
          :to="`/transactions/new?account=${id}&isIncome=true`"
          class='btn-small waves-effect waves-light green lighten-2 z-depth-0'
        >
          <i class='material-icons white-text' style='font-size: 1.4rem'>arrow_upward</i>
        </router-link>
        <router-link
          :to="`/transactions/transfers/new?accountIdSrc=${id}`"
          class='btn-small waves-effect waves-light indigo lighten-3 z-depth-0'
        >
          <i class='material-icons white-text' style='font-size: 1.4rem'>repeat</i>
        </router-link>
        <router-link
          :to="`/accounts/${id}`"
          class='btn-small waves-effect waves-light grey lighten-1 z-depth-0'
        >
          <i class='material-icons white-text' style='font-size: 1.4rem'>list</i>
        </router-link>
      </div>
      <div class='card-action'>
        <a
          class='grey-text text-darken-2'
          @click='$emit("edit")'
        >
          Изменить
        </a>
        <a
          v-if='isDeleteAllow'
          class='grey-text text-darken-2'
          @click='$emit("hide")'
        >
          Скрыть
        </a>
        <a
          v-if='isDeleteAllow'
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
    balance: { type: Number, required: true },
    currency: { type: Object, required: true },
    isFavourite: { type: Boolean, required: true },
    isDeleteAllow: { type: Boolean, required: true },
    color: { type: String, required: true },
    kind: { type: String, required: true }
  },
  data: () => ({
  }),
  computed: {
  },
  methods: {
  }
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

    .badge
      border-radius: 4px
      border: 1px solid #90a4ae
      box-sizing: border-box
      color: #546e7a
      display: inline-block
      float: none
      font-size: 12px
      line-height: 20px
      margin-left: 4px
      margin-top: 2px
      min-width: 1.8rem
      vertical-align: top

    .star
      position: absolute
      right: 0
      top: 6px

    .transaction-actions
      margin-top: 4px
      margin-bottom: 14px

      .btn-small
        margin-right: 16px
        border-radius: 4px

  .card-action
    padding: 12px 0

    a.last
      margin-right: 0 !important
</style>
