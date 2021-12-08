<template>
  <table>
    <thead>
      <tr>
        <th class='name'>Название</th>
        <th v-if='!isPhone'>Тип</th>
        <th class='amount'>Стоимость</th>
        <th />
      </tr>
    </thead>
    <tbody>
      <tr v-for='item in visibleItems' :key='item.id'>
        <td>
          <div class='valign-wrapper'>
            <span v-if='!isPhone' class='color' :class='item.color' />
            <span>{{ item.name }}</span>
          </div>
          <div v-if='isPhone' class='grey-text'>
            {{ kindName(item) }}
          </div>
        </td>
        <td v-if='!isPhone'>{{ kindName(item) }}</td>
        <td class='amount'>
          <Amount
            :value='item.price'
            :currency='item.currency.name'
          />
        </td>
        <td class='actions'>
          <a
            class='waves-effect waves-teal btn-flat'
            @click='onEdit(item)'
          >
            <i class='material-icons grey-text'>edit</i>
          </a>
          <a
            class='waves-effect waves-teal btn-flat'
            @click='onHide(item)'
          >
            <i class='material-icons grey-text'>visibility_off</i>
          </a>
          <a
            class='waves-effect waves-teal btn-flat'
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
import Amount from '@/components/amount';
import MobileDetect from 'mobile-detect';
import { get } from 'vuex-pathify';

const md = new MobileDetect(window.navigator.userAgent);

export default {
  name: 'PropertyCollection',
  components: {
    Amount
  },
  props: {},
  data: () => ({
    isPhone: md.phone() != null
  }),
  computed: {
    token: get('user/token'),
    ...get('properties/*')
  },
  methods: {
    kindName({ kind }) {
      if (kind == 'realty') { return 'Недвижимость'; }
      if (kind == 'transport') { return 'Транспорт'; }

      return 'Другое';
    },
    onEdit({ id }) {
      this.$router.push({ name: 'edit_property', params: { id } });
    },
    onDestroy(property) {
      if (this.isDestroying) { return; }
      this.$emit('destroy', property);
    },
    onHide(property) {
      if (this.isSubmitting) { return; }
      this.$emit('hide', property);
    }
  }
};
</script>

<style scoped lang='sass'>
.color
  min-width: 20px
  width: 20px
  height: 20px
  border-radius: 3px
  display: inline-block
  margin-right: 10px

.amount
  text-align: right
  text-overflow: ellipsis
  white-space: nowrap

.actions
  padding-right: 0px
  text-align: right
  text-overflow: ellipsis
  white-space: nowrap

  .btn-flat
    padding: 0 8px !important
</style>
