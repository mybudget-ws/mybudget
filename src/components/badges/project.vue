<template>
  <span
    class='new badge tag'
    :class='color'
    :data-badge-caption='name'
    @click='click'
  >
    <i class='project material-icons left'>
      work
    </i>
  </span>
</template>

<script>
export default {
  name: 'BadgeProject',
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
i.project
  font-size: 12px
  line-height: 22px
  margin-right: 3px
  opacity: 0.7
  padding-left: 0px

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
