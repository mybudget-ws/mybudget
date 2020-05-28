<template>
  <span
    class='new badge tag'
    :class='color'
    :data-badge-caption='name'
  />
</template>

<script>
export default {
  name: 'BadgeCategory',
  components: {},
  props: {
    name: { type: String, required: true },
    color: { type: String, required: true }
  },
  computed: {
  },
  methods: {
  }
};
</script>

<style scoped lang='sass'>
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
  &.blue-grey,
  &.black
    color: #fff

  &.blue,
  &.light-blue,
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
