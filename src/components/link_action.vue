<template>
  <router-link
    :to='to'
    :title='title'
    class='action-link btn-small waves-effect waves-light z-depth-0'
    :class='color'
  >
    <i class='material-icons grey-text text-darken-1'>{{ icon }}</i>
  </router-link>
</template>

<script>
export default {
  props: {
    to: { type: String, required: true },
    color: { type: String, required: true },
    icon: { type: String, required: true },
    title: { type: String, required: false, default: null }
  }
};
</script>

<style scoped lang='sass'>
.action-link
  border-radius: 4px
  padding: 0 14px
</style>
