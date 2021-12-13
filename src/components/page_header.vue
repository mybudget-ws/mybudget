<template>
  <div class='row page-header'>
    <div class='col s12'>
      <div
        v-if='cover'
        class='cover'
        :class='cover'
      />
      <h3>
        <span v-if='name' class='name'>{{ name }}</span>
        <router-link
          v-if='action != null'
          :to='action'
          class='btn-floating waves-effect waves-light yellow z-depth-0'
        >
          <i class='material-icons grey-text text-darken-4'>add</i>
        </router-link>
        <slot />
      </h3>
    </div>
    <slot name='subtitle' />
  </div>
</template>

<script>
export default {
  name: 'PageHeader',
  components: {},
  props: {
    name: { type: String, required: false, default: null },
    action: { type: String, required: false, default: null },
    cover: { type: String, required: false, default: null },
    coverStyle: { type: Object, required: false, default: null }
  },
  computed: {},
  methods: {}
};
</script>

<style scoped lang='sass'>
h3
  margin-top: 1.36rem
  margin-bottom: 0
  display: flex
  align-items: center

  .name
    margin-right: 18px

.cover + h3
  margin-bottom: 1.3rem

.cover
  position: absolute
  height: 11rem
  top: 0
  right: 0
  left: 0
  z-index: -1

  &:after
    // width: calc(100% - 24px)
    // margin-left: 12px
    // margin-top: 2rem
    // height: calc(100% - 10rem)
    content: ''
    border-radius: 18px
    background-color: #fff
    position: absolute
    width: 100%
    height: 36px
    bottom: -18px

  &.expence
    background-color: #ffcdd2

  &.income
    background-color: #c8e6c9

  &.transfer
    background-color: #c5cae9

@media only screen and (max-width: 601px)
  .cover
    &:after
      margin-top: 9.6rem !important
</style>
