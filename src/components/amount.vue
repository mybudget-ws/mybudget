<template>
  <div :class='classes'>
    <span class='value'>{{ formatedValue }}</span>
    <span class='currency grey-text'>{{ currency }}</span>
  </div>
</template>

<script>
import Money from '@/utils/money';

export default {
  name: 'Amount',
  props: {
    value: { type: Number, required: true },
    currency: { type: String, required: true }
  },
  computed: {
    classes() {
      return this.value > 0 ?
        'green-text text-darken-4' :
        'red-text text-darken-4';
    },
    formatedValue() {
      return Money.format(Math.abs(this.value), 2);
    }
  }
};
</script>

<style scoped lang='sass'>
.value
  font-weight: 500
  margin-right: 4px
  white-space: nowrap

.currency
  font-size: 10px
  font-weight: 300
</style>
