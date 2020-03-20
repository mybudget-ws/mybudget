<template>
  <span
    class='new badge black-text tag'
    :class='account.color'
    :data-badge-caption='account.name'
    @click='click'
  >
    <i class='account material-icons left'>
      account_balance
    </i>
  </span>
</template>

<script>
export default {
  name: 'TagAccount',
  props: {
    account: { type: Object, required: true }
  },
  methods: {
    click() {
      this.$emit('click');
    }
  }
};
</script>

<style scoped lang='sass'>
i.account
  font-size: 12px
  line-height: 22px
  margin-right: 3px
  opacity: 0.7
  padding-left: 0px

.tag
  margin-right: 6px
</style>
