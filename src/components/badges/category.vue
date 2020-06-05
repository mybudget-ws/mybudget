<template>
  <span
    class='new badge tag'
    :class='color'
    :data-badge-caption='name'
    @click='click'
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
    click() {
      this.$emit('click');
    }
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
