<template>
  <div :style='coverStyle'>
    <Menu />
    <div class='container container-wide'>
      <PageHeader
        v-if='!isLoading'
        :name='name'
        :cover-style='coverStyle'
        cover='account'
      />

      <Loader v-if='isLoading' />
    </div>
  </div>
</template>

<script>
import Loader from '@/components/loader';
import Menu from '@/components/menu';
import PageHeader from '@/components/page_header';
import api from '@/api';
import { get } from 'vuex-pathify';

import MobileDetect from 'mobile-detect';
const md = new MobileDetect(window.navigator.userAgent);

export default {
  name: 'ShowAccount',
  components: {
    Loader,
    Menu,
    PageHeader
  },
  props: {
    // initName: { type: String, required: false, default: '' },
    // initColor: { type: String, required: false, default: '' }
  },
  data: () => ({
    name: '',
    color: '',
    kind: '',
    currency: '',
    balance: 0,

    isLoading: true,
    // isSubmitting: false,
    isPhone: md.phone() != null
  }),
  computed: {
    token: get('user/token'),
    kinds: get('accounts/kinds'),
    id() { return this.$route.params.id; },
    coverStyle() {
      if (!this.isLoading) { return {}; }
      return {
        backgroundColor: this.color
      };
    }
  },
  async mounted() {
    const account = await api.account(this.token, { id: this.id });
    this.name = account.name;
    this.color = account.color;
    this.kind = account.kind;
    this.currency = account.currency.name;
    this.balance = account.balance;

    this.isLoading = false;
  },
  methods: {
    // fetchCurrencies: call('currencies/fetch'),
    // fetchColors: call('colors/fetch'),
    // async submit() {
    //   if (this.isSubmitting) { return; }
    //   const { id, name, color, kind, currency } = this;
    //   const isSuccess = await api.updateAccount(
    //     this.token,
    //     { id, name, color, kind, currency }
    //   );
    //   if (isSuccess != null) {
    //     this.$router.push({ name: 'accounts' }).catch(_e => {});
    //   } else {
    //     alert('Error');
    //   }
    // }
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

  @media only screen and (max-width: 601px)
    &:before
      margin-top: 0
      width: 12px
      height: 3rem

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

form
  @media only screen and (max-width: 601px)
    padding-bottom: 3rem !important

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
