<template>
  <div>
    <Menu />
    <div class='container'>
      <PageHeader name='Проекты' action='/accounts/new' />
      <div class='row'>
        <div class='col s12'>
          <p v-if='isLoading'>Загрузка...</p>
          <div v-else-if='isAlert' class='card blue-grey darken-1'>
            <div class='card-content white-text'>
              <span class='card-title'>На данный момент у вас нет Проектов</span>
              <p>
                TODO: Описание, чем могут быть полезны проекты...
              </p>
            </div>
            <!--div class="card-action">
              <a href="#">Создать проект</a>
            </div-->
          </div>
          <table v-else>
            <thead>
              <tr>
                <th>Название</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for='item in items' :key='item.id'>
                <td class='color-td'>
                  <div class='color' :class='item.color' />
                </td>
                <td>{{ item.name }}</td>
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
import PageHeader from '@/components/page_header';
import { get, call } from 'vuex-pathify';

export default {
  name: 'Projects',
  components: {
    Menu,
    PageHeader
  },
  props: {},
  computed: {
    token: get('user/token'),
    ...get('projects/*'),
    isAlert() {
      return !this.isLoading && this.items.length === 0;
    }
  },
  async created() {
    this.fetch(this.token);
  },
  methods: {
    ...call([
      'projects/fetch'
    ])
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
</style>
