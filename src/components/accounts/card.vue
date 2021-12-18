<template>
  <Card :color='color'>
    <div class='name blue-grey-text text-darken-3'>
      {{ name }}
      <span v-if='kind === "credit"' class='badge'>Кредит</span>
    </div>
    <a class='btn-flat star' @click='$emit("favourite")'>
      <i v-if='isFavourite' class='material-icons yellow-text text-accent-4' style='font-size: 1.8rem'>star</i>
      <i v-else class='material-icons grey-text' style='font-size: 1.8rem'>star_border</i>
    </a>
    <Amount :value='balance' :currency='currency.name' class='card-title' />
    <div class='item-actions'>
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
    <slot name='card-action'>
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
    </slot>
  </Card>
</template>

<script>
import Amount from '@/components/amount';
import Card from '@/components/card';

export default {
  name: 'AccountCard',
  components: {
    Amount,
    Card
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
</style>
