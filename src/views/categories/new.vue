<template>
  <div>
    <Menu />
    <div class='container container-wide'>
      <PageHeader name='Новая категория' />

      <div class='row'>
        <form class='col l10 s12' @submit.prevent='submit'>
          <div class='row'>
            <div class='input-field col l8 s12'>
              <input
                id='name'
                ref='name'
                v-model='name'
                type='text'
                class='validate'
                autofocus
                required
              >
              <label for='name' class='active'>Название категории</label>
            </div>
          </div>
          <div class='row'>
            <div
              class='input-field col l4 s12'
              :class='`color c-${color}`'
            >
              <select ref='selectColors' v-model='color'>
                <option
                  v-for='color in colors'
                  :key='color.id'
                  :value='color.id'
                >
                  {{ color.name }}
                </option>
              </select>
              <label>Цвет</label>
            </div>
          </div>

          <div v-if='isPhone' class='mobile-submit'>
            <Button
              :is-disabled='isSubmitting'
              :is-loading='isSubmitting'
              @click='submit'
            >
              <i
                class='material-icons grey-text text-darken-1'
                style='font-size: 2rem'
              >
                done
              </i>
            </Button>
            <router-link
              to='/categories'
              class='btn-floating btn-large waves-effect waves-light grey lighten-2 z-depth-0'
            >
              <i class='material-icons grey-text text-darken-1' style='font-size: 2rem'>close</i>
            </router-link>
          </div>
          <div v-else class='row'>
            <div class='col'>
              <Button
                text='Создать'
                :is-disabled='isSubmitting'
                :is-loading='isSubmitting'
                @click='submit'
              />
            </div>
            <div class='col'>
              <router-link to='/categories' class='btn-flat btn-large'>
                Отмена
              </router-link>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/button';
import Menu from '@/components/menu';
import PageHeader from '@/components/page_header';
import { get, call } from 'vuex-pathify';

import MobileDetect from 'mobile-detect';
const md = new MobileDetect(window.navigator.userAgent);

export default {
  name: 'NewCategory',
  components: {
    Button,
    Menu,
    PageHeader
  },
  props: {},
  data: () => ({
    name: '',
    color: 'cyan',

    isPhone: md.phone() != null
  }),
  computed: {
    token: get('user/token'),
    colors: get('colors/items'),
    ...get('categories/*')
  },
  async mounted() {
    await this.fetchColors();
    /* eslint-disable */
    this.selectColors = M.FormSelect.init(this.$refs.selectColors, {});
    M.updateTextFields();
    /* eslint-enable */

    this.$refs.name.focus();
  },
  methods: {
    fetchColors: call('colors/fetch'),
    ...call('categories/*'),
    async submit() {
      if (this.isSubmitting) { return; }

      const { name, color, token } = this;
      const category = { name, color };
      const isSuccess = await this.create({ token, category });
      if (isSuccess != null) {
        this.$router.push({ name: 'categories' });
      } else {
        alert('Error');
      }
    }
  }
};
</script>

<style scoped lang='sass'>
.color
  &:before
    position: absolute
    width: 8px
    height: 2.65rem
    content: ''
    margin-left: -14px
    margin-top: 6px
    border-radius: 2px

  &.c-red
    &:before
      background-color: #f44336

  &.c-pink
    &:before
      background-color: #e91e63

  &.c-purple
    &:before
      background-color: #9c27b0

  &.c-deep-purple
    &:before
      background-color: #673ab7

  &.c-indigo
    &:before
      background-color: #3f51b5

  &.c-blue
    &:before
      background-color: #2196f3

  &.c-light-blue.lighten-2
    &:before
      background-color: #4fc3f7

  &.c-cyan
    &:before
      background-color: #00bcd4

  &.c-teal
    &:before
      background-color: #009688

  &.c-green
    &:before
      background-color: #4caf50

  &.c-light-green
    &:before
      background-color: #8bc34a

  &.c-lime
    &:before
      background-color: #cddc39

  &.c-yellow
    &:before
      background-color: #ffeb3b

  &.c-amber
    &:before
      background-color: #ffc107

  &.c-orange
    &:before
      background-color: #ff9800

  &.c-deep-orange
    &:before
      background-color: #ff5722

  &.c-brown
    &:before
      background-color: #795548

  &.c-grey
    &:before
      background-color: #9e9e9e

  &.c-blue-grey
    &:before
      background-color: #607d8b

.mobile-submit
  z-index: 2
  position: fixed
  bottom: 0
  right: 0
  padding: 0 20px 20px 0
  min-width: 146px
  width: 146px

  a
    margin-left: 12px
</style>
