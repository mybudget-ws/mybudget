<template>
  <div v-if='topAccounts.length > 1' class='top-accounts-container'>
    <span class='top-accounts'>
      <span
        v-for='account in topAccounts'
        :key='account.id'
        class='top-account helper-text'
        :class='account.id == accountId ? "selected" : ""'
        @click='onClick(account.id)'
      >
        {{ account.name }}
      </span>
    </span>
  </div>
</template>

<script>
export default {
  name: 'TopAccounts',
  components: {},
  props: {
    accountId: { type: Number, required: true },
    accounts: { type: Array, required: false, default: () => [] }
  },
  data: () => ({}),
  computed: {
    topAccounts() {
      // return this.accounts
      //   .filter(v => v.id !== this.accountId && v.id.toString() !== this.accountId)
      //   .slice(0, 5);
      return this.accounts.slice(0, 5);
    }
  },
  methods: {
    onClick(id) {
      this.$emit('select', id);
    }
  }
};
</script>

<style scoped lang='sass'>
.top-accounts-container
  position: relative

.top-accounts
  position: absolute
  margin-top: -4px

  @media only screen and (max-width: 996px)
    padding-bottom: 6px
    display: inline-block
    position: inherit
    // margin-top: 10px

  .top-account
    cursor: pointer
    display: inline-block
    margin-right: 6px
    border-bottom: 1px dashed #bdbdbd

    &.selected
      color: #616161
      background-color: #fffde7
      // background-color: #fff9c4

    &:hover
      color: #616161
      border-bottom: 1px dashed #757575

    @media only screen and (max-width: 601px)
      font-size: 14px
      margin-right: 10px
</style>
