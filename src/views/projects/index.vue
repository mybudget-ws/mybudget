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
              <p>TODO: Описание, чем могут быть полезны проекты...</p>
            </div>
            <!--div class="card-action">
              <a href="#">Подробнее о проектах</a>
            </div-->
          </div>
          <table v-else>
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
                  <Amount :value='item.balance' currency='???' />
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Amount from '@/components/amount';
import Menu from '@/components/menu';
import Loader from '@/components/loader';
import PageHeader from '@/components/page_header';
import { get, call } from 'vuex-pathify';

export default {
  name: 'Projects',
  components: {
    Amount,
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
  width: 140px
  text-align: right

.actions
  width: 130px
  text-align: right

  .btn-flat
    padding: 0 8px !important
</style>
