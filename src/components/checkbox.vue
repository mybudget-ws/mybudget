<template>
  <input
    class='browser-default'
    type='checkbox'
    :checked='value'
    @change='change'
  >
</template>

<script>
// https://jsfiddle.net/Linusborg/h4xaf86q/
export default {
  name: 'Checkbox',
  props: {
    value: { type: Boolean, default: false }
  },
  methods: {
    change(e) {
      // console.log(e.target.checked);
      this.$emit('change', e.target.checked);
    }
  }
};
</script>

<style scoped lang='sass'>
</style>
