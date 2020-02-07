<template>
  <input
    class='browser-default'
    type='checkbox'
    :checked='value'
    @change='change'
  >
</template>

<script>
export default {
  name: 'Checkbox',
  props: {
    value: { type: Boolean, default: false }
  },
  methods: {
    change(e) {
      this.$emit('change', e.target.checked);
    }
  }
};
</script>

<style scoped lang='sass'>
</style>
