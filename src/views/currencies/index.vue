<template>
  <div>
    <Menu />
    <div class='container'>
      <PageHeader name='Курсы валют'>
        <div v-if='!isLoading' class='right'>
          <select ref='selectCurrencies' v-model='currency' @change='change'>
            <option v-for='curr in items' :key='curr.id' :value='curr.name'>
              {{ curr.name }}
            </option>
          </select>
        </div>
      </PageHeader>
      <div class='row'>
        <div class='col s12'>
          <div class='chart' />
        </div>
      </div>
      <div class='row'>
        <div class='col s12'>
          <Loader v-if='isLoading' />
          <table v-else>
            <thead>
              <tr>
                <th class='name'>Название</th>
                <th class='usd right'>Курс</th>
                <th>Описание</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for='curr in displayedItems' :key='curr.id'>
                <td class='name'>{{ curr.name }}</td>
                <td class='usd right'>{{ curr.rubRate.toFixed(6) }}</td>
                <td>
                  <span class='grey-text'>{{ curr.description }}</span>
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
import Menu from '@/components/menu';
import Loader from '@/components/loader';
import PageHeader from '@/components/page_header';
import { get, call, sync } from 'vuex-pathify';
import c3 from 'c3';

export default {
  name: 'Currencies',
  components: {
    Menu,
    Loader,
    PageHeader
  },
  props: {},
  computed: {
    ...get('currencies/*'),
    currency: sync('currencies/selected'),
    chartUrl() {
      return `http://localhost:3000/charts/currencies/${this.currency}.json`;
    }
  },
  async mounted() {
    await this.fetch();
    /* eslint-disable */
    this.selectCurrencies = M.FormSelect.init(this.$refs.selectCurrencies, {});
    M.updateTextFields();
    /* eslint-enable */

    this.chart = c3.generate({
      bindto: '.chart',
      data: {
        url: this.chartUrl,
        mimeType: 'json',
        keys: { x: 'date', value: [this.currency] }
      },
      axis: {
        x: {
          type: 'category',
          padding: { left: 0, right: 0 }
        },
        y: {
          min: 0,
          padding: { top: 20 }
        }
      },
      point: { show: false },
      grid: {
        x: { show: true },
        y: { show: true }
      }
    });
  },
  methods: {
    ...call([
      'currencies/fetch'
    ]),
    change() {
      // this.chart.unload({ ids: 'USD' });
      this.chart.load({
        url: this.chartUrl,
        mimeType: 'json',
        keys: { x: 'date', value: [this.currency] }
      });
    }
  }
};
</script>

<style scoped lang='sass'>
.name
  width: 80px

.usd
  padding-right: 20px

.chart
  height: 300px
  margin-left: -20px
</style>
