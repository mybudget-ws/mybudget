<template>
  <div>
    <Menu />
    <div class='container container-wide'>
      <PageHeader name='Проекты' action='/projects/new' />
      <div class='row'>
        <div class='col s12'>
          <Loader v-if='isLoading' />
          <div v-else-if='isAlert' class='card blue-grey'>
            <div class='card-content white-text'>
              <span class='card-title'>На данный момент у вас нет Проектов</span>
              <p>
                Проекты это способ группировать доходы и расходы,
                которые относятся к одной финансовой активности,
                а одними категориями уже не обойтись.
                Например: "Ремонт Квартиры", "Поездка во Вьетнам 2020" и т.п.
                Это полезно, когда доходы и расходы приходятся на различные
                счета и хочется узнать итоговый баланс, чтобы определить
                насколько та, или иная деятельность была прибыльной
                или затратной.
              </p>
            </div>
          </div>
          <table v-else-if='!isPhone'>
            <thead>
              <tr>
                <th class='name'>Название</th>
                <th class='amount'>Баланс</th>
                <th />
              </tr>
            </thead>
            <tbody>
              <tr v-for='item in visibleItems' :key='item.id'>
                <td>
                  <div class='valign-wrapper'>
                    <span class='color' :class='item.color' />
                    <span>{{ item.name }}</span>
                  </div>
                </td>
                <td class='amount'>
                  <div v-for='(balance, index) in item.balances' :key='index'>
                    <Amount :value='balance.amount' :currency='balance.currency.name' />
                  </div>
                  <div v-if='item.balances.length > 1' class='total'>
                    <Amount
                      class='total-amount'
                      :value='item.balances.map(v => v.amountBase).reduce((a, b) => a + b)'
                      :currency='item.balances[0].currencyBase.name'
                    />
                  </div>
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
          <div v-for='item in visibleItems' v-else :key='item.id'>
            <Card
              v-bind='item'
              @edit='onEdit(item)'
              @hide='onHide(item)'
              @destroy='onDestroy(item)'
            />
          </div>

          <table v-if='hiddenItems.length' class='hidden-table'>
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
                    @click='onHide(item)'
                  >
                    <i class='material-icons grey-text'>visibility</i>
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Amount from '@/components/amount';
import Card from '@/components/projects/card';
import Loader from '@/components/loader';
import Menu from '@/components/menu';
import PageHeader from '@/components/page_header';
import { get, call } from 'vuex-pathify';

import MobileDetect from 'mobile-detect';
const md = new MobileDetect(window.navigator.userAgent);

export default {
  name: 'Projects',
  components: {
    Amount,
    Card,
    Loader,
    Menu,
    PageHeader
  },
  props: {},
  data: () => ({
    isPhone: md.phone() != null
  }),
  computed: {
    token: get('user/token'),
    ...get('projects/*'),
    isAlert() {
      return !this.isLoading && this.items.length === 0;
    }
  },
  created() {
    this.fetch(this.token);
  },
  methods: {
    ...call([
      'projects/fetch',
      'projects/destroy',
      'projects/toggleIsHidden'
    ]),
    onEdit(category) {
      const { id } = category;
      this.$router.push({ name: 'edit_project', params: { id } });
    },
    async onDestroy(project) {
      if (this.isDestroying) { return; }
      if (confirm('Удалить проект. Вы уверены?')) {
        const res = await this.destroy({ token: this.token, project });
        const message = res != null ?
          'Проект успешно удален' :
          'Непредвиденная ошибка';
        /* eslint-disable */
        M.toast({ html: message });
        /* eslint-enable */
      }
    },
    async onHide(project) {
      if (this.isSubmitting) { return; }
      console.log(project);

      const isHidden = await this.toggleIsHidden({ token: this.token, project });
      const message = isHidden ? 'Проект добавлен в архив' : 'Проект удален из архива';
      /* eslint-disable */ M.toast({ html: message }); /* eslint-enable */
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

.amount
  width: 200px
  text-align: right

.actions,
.actions-hidden
  padding-right: 0px
  width: 124px
  text-align: right

  .btn-flat
    padding: 0 8px !important

.actions-hidden
  width: 82px

.hidden-table
  margin-top: 60px
  opacity: 0.4

.total
  margin-top: 4px
  border-top: 1px solid #d4d4d4

  .total-amount
    margin-top: 2px

    &:before
      color: #757575
      content: 'Всего по текущему курсу:'
      font-size: 13px
      font-weight: 200
      margin-left: -164px
      margin-top: -3.6px
      padding-top: 4px
      position: absolute
</style>
