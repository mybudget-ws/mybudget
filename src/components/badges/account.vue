<template>
  <span
    class='new badge tag'
    :class='account.color'
    :data-badge-caption='account.name'
    @click='click'
  >
    <i class='account material-icons left'>
      account_balance
    </i>
  </span>
</template>

<script>
export default {
  name: 'BadgeAccount',
  props: {
    account: { type: Object, required: true }
  },
  methods: {
    click() {
      this.$emit('click');
    }
  }
};
</script>

<style scoped lang='sass'>
i.account
  font-size: 12px
  line-height: 22px
  margin-right: 3px
  opacity: 0.7
  padding-left: 0px

.tag
  margin-right: 6px

.badge
  cursor: pointer
  &:hover
    opacity: 0.9

  &.red,
  &.pink,
  &.purple,
  &.deep-purple,
  &.indigo,
  &.teal,
  &.deep-orange,
  &.brown,
  &.blue,
  &.blue-grey,
  &.black
    color: #fff

  &.light-blue.lighten-2,
  &.cyan,
  &.green,
  &.light-green,
  &.lime,
  &.yellow,
  &.amber,
  &.orange,
  &.grey
    color: #000
</style>
