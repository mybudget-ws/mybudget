<template>
  <div
    class='card z-depth-0 lighten-4'
    :class='color'
  >
    <div class='card-content'>
      <slot />
      <slot name='card-footer' />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: {
    color: { type: String, required: true }
  }
};
</script>

<style scoped lang='sass'>
.card
  position: relative
  padding: 14px 0 10px 0
  margin: 0 0 18px
  padding: 8px 12px 0px
  border-radius: 8px

  .card-title
    margin-bottom: 2px

  .card-content
    padding: 0
    margin-bottom: 10px

    .name
      font-size: 18px
      font-weight: 400

    .badge.badge-light
      border-radius: 4px
      border: 1px solid #90a4ae
      box-sizing: border-box
      color: #546e7a
      display: inline-block
      float: none
      font-size: 12px
      line-height: 20px
      margin-left: 4px
      margin-top: 2px
      min-width: 1.8rem
      vertical-align: top

    .star
      position: absolute
      right: 0
      top: 6px

    .item-actions
      margin-top: 4px
      margin-bottom: 14px

      .btn-small
        margin-right: 16px
        border-radius: 4px

  .card-action
    padding: 0
    display: flex
    justify-content: space-between

    a
      display: inline-block
      padding: 10px 0
      margin-right: 0 !important
      font-size: 0.8rem
</style>
