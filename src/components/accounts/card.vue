<template>
  <div
    class='card z-depth-0 lighten-4'
    :class='color'
  >
    <div class='card-content'>
      <div class='name blue-grey-text text-darken-3'>{{ name }}</div>
      <Amount :value='balance' :currency='currency.name' class='card-title' />
    </div>
  </div>
</template>

<script>
import Amount from '@/components/amount';
// import { get, call } from 'vuex-pathify';

export default {
  name: 'Transactions',
  components: {
    Amount
  },
  props: {
    name: { type: String, required: true },
    balance: { type: Number, required: true },
    currency: { type: Object, required: true },
    color: { type: String, required: true }
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
</style>
