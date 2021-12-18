<template>
  <div class='valign-wrapper' v-bind='$attrs'>
    <span class='color' :class='color' />
    <span>{{ name }}</span>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    name: { type: String, required: true },
    color: { type: String, required: true }
  }
};
</script>

<style scoped lang='sass'>
.color
  border-radius: 3px
  display: inline-block
  height: 20px
  margin-right: 10px
  min-width: 20px
  width: 20px
</style>
