<template>
  <div>
    <table v-if='!isPhone'>
      <thead>
        <tr>
          <th class='name'>Название</th>
          <th>Тип</th>
          <th class='amount'>Стоимость</th>
          <th />
        </tr>
      </thead>
      <tbody>
        <tr v-for='item in visibleItems' :key='item.id'>
          <td>
            <RecordName v-bind='item' />
          </td>
          <td>{{ kindName(item) }}</td>
          <td class='amount'>
            <Amount
              :value='item.price'
              :currency='item.currency.name'
            />
          </td>
          <td class='actions'>
            <LinkAction
              :to="`/properties/${item.id}`"
              color='grey lighten-2'
              icon='list'
              title='Подробнее'
              class='action-link'
            />
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
    <Card
      v-for='item in visibleItems'
      v-else
      :key='item.id'
      :color='item.color'
    >
      <div class='name blue-grey-text text-darken-3'>
        {{ item.name }}
        <span class='badge'>{{ kindName(item) }}</span>
      </div>
      <Amount
        :value='item.price'
        :currency='item.currency.name'
        class='card-title'
      />
      <div class='item-actions'>
        <router-link
          :to="`/properties/${item.id}`"
          class='btn-small waves-effect waves-light grey lighten-1 z-depth-0'
        >
          <i class='material-icons white-text' style='font-size: 1.4rem'>list</i>
        </router-link>
      </div>
      <slot name='card-action'>
        <div class='card-action'>
          <a
            class='grey-text text-darken-2'
            @click='onEdit(item)'
          >
            Изменить
          </a>
          <a
            class='grey-text text-darken-2'
            @click='onHide(item)'
          >
            Скрыть
          </a>
          <a
            class='grey-text text-darken-2 last'
            @click='onDestroy(item)'
          >
            Удалить
          </a>
        </div>
      </slot>
    </Card>
  </div>
</template>

<script>
import Amount from '@/components/amount';
import Card from '@/components/card';
import LinkAction from '@/components/link_action';
import MobileDetect from 'mobile-detect';
import RecordName from '@/components/record_name';
import { get } from 'vuex-pathify';

const md = new MobileDetect(window.navigator.userAgent);

export default {
  name: 'PropertyCollection',
  components: {
    Amount,
    Card,
    LinkAction,
    RecordName
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
.amount
  text-align: right
  text-overflow: ellipsis
  white-space: nowrap

.actions
  padding-right: 0px
  text-align: right
  text-overflow: ellipsis
  white-space: nowrap
  width: 190px

  .btn-flat
    padding: 0 8px !important

  .action-link
    margin-right: 10px
</style>
