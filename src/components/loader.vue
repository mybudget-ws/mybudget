<template>
  <div class='loader-wrapper'>
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
    size: { type: String, required: false, default: 'big' }
  },
  computed: {},
  methods: {}
};
</script>

<style scoped lang='sass'>
.loader-wrapper
  text-align: center
  padding-top: 50px
</style>
