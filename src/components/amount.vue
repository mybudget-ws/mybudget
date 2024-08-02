<template>
  <div :class='classes'>
    <span class='value'>
      {{ valueRound }}<span class='cent'>.{{ valueCent }}</span>
    </span>
    <span class='currency grey-text text-darken-1' :title='titleCurrency'>
      {{ formatedCurrency }}
    </span>
    <slot />
  </div>
</template>

<script>
import Money from '@/utils/money';

export default {
  name: 'Amount',
  props: {
    value: { type: [Number, String], required: true },
    currency: { type: String, required: true }
  },
  computed: {
    classes() {
      if (this.value == 0) { return 'grey-text text-darken-1'; }
      return this.value > 0 ?
        'green-text text-darken-4' :
        'red-text text-darken-4';
    },
    formatedValue() {
      return Money.format(Math.abs(this.value), 2);
    },
    valueParts() {
      return this.formatedValue.split('.');
    },
    valueRound() {
      return this.valueParts[0];
    },
    valueCent() {
      return this.valueParts[1];
    },
    isCurrency() {
      return this.currency != null && this.currency != '';
    },
    formatedCurrency() {
      return this.isCurrency ? this.currency : '???';
    },
    titleCurrency() {
      return this.isCurrency ?
        this.currency :
        'Нет выбранного счета';
    }
  }
};
</script>

<style scoped lang='sass'>
.value
  font-weight: 500
  letter-spacing: 0.2px
  text-align: right
  white-space: nowrap

.cent
  font-size: 12px
  font-weight: 200
  margin-right: 4px

  @media only screen and (max-width: 601px)
    font-size: 14px

.currency
  font-size: 12px
  font-weight: 300

  @media only screen and (max-width: 601px)
    font-size: 14px
</style>
