<template>
  <div class='loader-wrapper' :class="{ 'fixed': isFixed }">
    <div class='preloader-wrapper active' :class='size'>
      <div class='spinner-layer spinner-green-only'>
        <div class='circle-clipper left'>
          <div class='circle' />
        </div>
        <div class='gap-patch'>
          <div class='circle' />
        </div>
        <div class='circle-clipper right'>
          <div class='circle' />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Loader',
  components: {},
  props: {
    size: { type: String, required: false, default: 'big' },
    isFixed: { type: Boolean, required: false, default: false }
  },
  computed: {},
  methods: {}
};
</script>

<style scoped lang='sass'>
.loader-wrapper
  text-align: center
  padding-top: 50px

  &.fixed
    position: absolute
    left: calc(50% - 40px)
    top: 140px
</style>
