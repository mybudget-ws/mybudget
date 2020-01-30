<template>
  <div>
    <Menu />
    <div class='container'>
      <PageHeader name='Проекты' action='/projects/new' />
      <div class='row'>
        <div class='col s12'>
          <Loader v-if='isLoading' />
          <div v-else-if='isAlert' class='card blue-grey darken-1'>
            <div class='card-content white-text'>
              <span class='card-title'>На данный момент у вас нет Проектов</span>
              <p>
                TODO: Описание, чем могут быть полезны проекты...
              </p>
            </div>
            <!--div class="card-action">
              <a href="#">Подробнее о проектах</a>
            </div-->
          </div>
          <table v-else>
            <thead>
              <tr>
                <th>Название</th>
                <th class='actions' />
              </tr>
            </thead>

            <tbody>
              <tr v-for='item in items' :key='item.id'>
                <td>
                  <div class='valign-wrapper'>
                    <span class='color' :class='item.color' />
                    <span>{{ item.name }}</span>
                  </div>
                </td>
                <td>
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
import Menu from '@/components/menu';
import Loader from '@/components/loader';
import PageHeader from '@/components/page_header';
import { get, call } from 'vuex-pathify';

export default {
  name: 'Projects',
  components: {
    Menu,
    Loader,
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
  created() {
    this.fetch(this.token);
  },
  methods: {
    ...call([
      'projects/fetch',
      'projects/destroy'
    ]),
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

.actions
  width: 50px
  text-align: right
</style>
