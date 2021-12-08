<template>
  <table v-if='hiddenItems.length && !isLoading' class='hidden-table'>
    <thead>
      <tr>
        <th>Архив</th>
        <th />
        <th />
      </tr>
    </thead>
    <tbody>
      <tr v-for='item in hiddenItems' :key='item.id'>
        <td>
          <div class='valign-wrapper'>
            <span class='color' :class='item.color' />
            <span>{{ item.name }}</span>
          </div>
        </td>
        <td>
          <i class='description grey-text text-darken-1'>В архиве</i>
        </td>
        <td class='actions-hidden'>
          <a
            class='waves-effect waves-teal btn-flat'
            title='Сделать активным'
            @click='onHide(item)'
          >
            <i class='material-icons grey-text'>visibility</i>
          </a>
          <a
            class='waves-effect waves-teal btn-flat'
            title='Удалить'
            @click='onDestroy(item)'
          >
            <i class='material-icons grey-text'>delete</i>
          </a>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { get } from 'vuex-pathify';

export default {
  name: 'AccountCollectionArchive',
  components: {},
  props: {},
  data: () => ({}),
  computed: {
    ...get('accounts/*')
  },
  methods: {
    async onHide(account) {
      if (this.isSubmitting) { return; }
      this.$emit('hide', account);
    },
    async onDestroy(account) {
      if (this.isDestroying) { return; }
      this.$emit('destroy', account);
    }
  }
};
</script>

<style scoped lang='sass'>
.color
  width: 20px
  height: 20px
  border-radius: 3px
  display: inline-block
  margin-right: 10px

.actions-hidden
  padding-right: 0px
  text-align: right
  text-overflow: ellipsis
  white-space: nowrap

  .btn-flat
    padding: 0 8px !important

.transacton-actions
  width: 78px
  text-align: right

  .btn-small + .btn-small
    margin-left: 8px

  .btn-small
    padding: 0 14px
    border-radius: 4px

.hidden-table
  margin-top: 60px
  opacity: 0.4
</style>
