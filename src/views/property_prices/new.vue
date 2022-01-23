<template>
  <div>
    <Menu />
    <div class='container container-wide'>
      <PageHeader name='Новая цена' />

      <div class='row'>
        <form class='col l12 s12' @submit.prevent='submit'>
          <div class='row'>
            <div class='input-field col l4 s12'>
              <input
                id='amount'
                ref='amount'
                v-model='newAmount'
                :type='isPhone ? "number" : "text"'
                :class='{ "validate": !isPhone }'
                autofocus
                required
                @click='$refs.amount.focus()'
                @input='onChangeAmount'
              >
              <label for='amount' class='active'>{{ amountLable }}</label>
            </div>
            <div class='input-field col l4 s12'>
              <input
                id='date'
                ref='datepicker'
                type='text'
                class='datepicker'
              >
              <label for='date' class='active'>Дата</label>
            </div>
          </div>

          <div class='row'>
            <div class='input-field col l4 s12'>
              <input
                id='description'
                v-model='description'
                type='text'
              >
              <label for='description'>Комментарий</label>
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
              :to='backPath'
              class='btn-floating btn-large waves-effect waves-light grey lighten-2 z-depth-0'
            >
              <i class='material-icons grey-text text-darken-1' style='font-size: 2rem'>close</i>
            </router-link>
          </div>
          <div v-else class='row'>
            <div class='col'>
              <Button
                text='Создать цену'
                :is-disabled='isSubmitting'
                :is-loading='isSubmitting'
                @click='submit'
              />
            </div>
            <div class='col'>
              <router-link :to='backPath' class='btn-flat btn-large'>
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
import DateFormat from '@/utils/date_format';
import delay from 'delay';
import { get, call } from 'vuex-pathify';

import MobileDetect from 'mobile-detect';
const md = new MobileDetect(window.navigator.userAgent);

const moment = require('moment');
moment.locale('ru');

export default {
  name: 'NewPropertyPrice',
  components: {
    Button,
    Menu,
    PageHeader
  },
  props: {},
  data: () => ({
    newAmount: '',
    description: '',
    date: new Date(),

    datepicker: null,
    isPhone: md.phone() != null,
    isSubmitting: false
  }),
  computed: {
    token: get('user/token'),
    ...get('property/*'),
    propertyId() { return this.$route.params.id; },
    amountLable() {
      if (this.currency == null) { return 'Величина'; }
      return `Величина, ${this.currency}`;
    },
    backPath() {
      if (this.$route.query.backTo) { return this.$route.query.backTo; }
      return `/properties/${this.propertyId}`;
    }
  },
  async created() {
    this.newAmount = this.amount.toString();
  },
  async mounted() {
    /* eslint-disable */
    M.Datepicker.init(
      this.$refs.datepicker,
      DateFormat.datePickerInitData()
    );
    M.Datepicker.getInstance(this.$refs.datepicker).setDate(this.date);
    /* eslint-enable */
    this.$refs.amount.select();
    this.$refs.amount.focus();
  },
  methods: {
    create: call('property/createPrice'),
    onChangeAmount(_e) {
      this.newAmount = this.newAmount.replace(/[^0-9,.+-/*\s]/g, '');
    },
    async submit() {
      if (this.isSubmitting) { return; }

      this.isSubmitting = true;
      /* eslint-disable */
      const date = M.Datepicker.getInstance(this.$refs.datepicker).date;
      /* eslint-enable */
      const { token, newAmount, propertyId, description } = this;

      let evalAmount = undefined;
      try {
        evalAmount = eval(
          newAmount.replace(/,/g, '.').replace(/\s/g, '').replace(/([.])\1+/g, '$1')
        );
      } catch (e) {
        console.error(e);
        /* eslint-disable */ M.toast({ html: 'Ошибка в выражении' }); /* eslint-enable */
        await delay(100); // Избегаем двойного отображения ошибки.
        this.isSubmitting = false;
      }
      if (evalAmount == undefined) { return; }

      const price = {
        amount: (evalAmount === Infinity ? 0 : evalAmount).toString(),
        date: moment(date).format(),
        propertyId,
        description
      };
      const result = await this.create({ token, price });
      this.isSubmitting = false;
      if (result != null) {
        this.$router.push({ path: this.backPath }).catch(_e => {});
      } else {
        /* eslint-disable */ M.toast({ html: 'Непредвиденная ошибка' }); /* eslint-enable */
      }
    }
  }
};
</script>

<style scoped lang='sass'>
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
