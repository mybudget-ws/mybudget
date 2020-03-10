<template>
  <div>
    <Menu />
    <div class='container'>
      <!--PageHeader name='Цели' action='/budgets/new' /-->
      <PageHeader name='Цели' />
      <div class='row'>
        <div class='col s12'>
          <Loader v-if='isLoading' />
          <div v-else-if='isAlert' class='card blue-grey darken-1'>
            <div class='card-content white-text'>
              <span class='card-title'>Пока у вас нет созданных финансовых Целей</span>
              <p>TODO: Описание, чем могут быть полезны цели...</p>
            </div>
            <!--div class="card-action">
              <a href="#">Подробнее о целях</a>
            </div-->
          </div>
          <table v-else>
            <thead>
              <tr>
                <th class='name'>Название</th>
                <th />
              </tr>
            </thead>
            <tbody>
              <tr v-for='item in items' :key='item.id'>
                <td />
                <td class='actions' />
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
  name: 'Goals',
  components: {
    Menu,
    Loader,
    PageHeader
  },
  props: {},
  computed: {
    token: get('user/token'),
    ...get('goals/*'),
    isAlert() {
      return !this.isLoading && this.items.length === 0;
    }
  },
  created() {
    this.fetch(this.token);
  },
  methods: {
    ...call([
      'goals/fetch',
      'goals/destroy'
    ])
    // ,
    // onEdit(category) {
    //   const { id } = category;
    //   this.$router.push({ name: 'edit_project', params: { id } });
    // },
    // async onDestroy(project) {
    //   if (this.isDestroying) { return; }
    //   if (confirm('Удалить проект. Вы уверены?')) {
    //     const res = await this.destroy({ token: this.token, project });
    //     const message = res != null ?
    //       'Проект успешно удален' :
    //       'Непредвиденная ошибка';
    //     /* eslint-disable */
    //     M.toast({ html: message });
    //     /* eslint-enable */
    //   }
    // }
  }
};
</script>

<style scoped lang='sass'>
</style>
