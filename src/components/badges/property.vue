<template>
  <span
    class='new badge tag'
    :class='color'
    :data-badge-caption='name'
    @click='click'
  >
    <i class='property material-icons left'>
      vpn_key
    </i>
  </span>
</template>

<script>
export default {
  name: 'BadgeProperty',
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
i.property
  font-size: 12px
  line-height: 22px
  margin-right: 3px
  opacity: 0.7
  padding-left: 0px

.badge
  cursor: pointer
  min-width: auto

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
  &.light-blue.lighten-2,
  &.cyan,
  &.green,
  &.light-green,
  &.lime,
  &.yellow,
  &.amber,
  &.orange,
  &.grey,
  &.grey.lighten-2,
  &.white
    color: #000
</style>
