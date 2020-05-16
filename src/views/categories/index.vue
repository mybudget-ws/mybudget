<template>
  <div>
    <Menu />
    <div class='container container-wide'>
      <PageHeader name='Категории' action='/categories/new' />
      <div class='row'>
        <div class='col s12'>
          <Loader v-if='isLoading' />
          <div v-else-if='isAlert' class='card blue-grey darken-1'>
            <div class='card-content white-text'>
              <span class='card-title'>На данный момент у вас нет Категорий</span>
              <p>Нажмите на "плюс", чтобы добавить вашую первую категорию</p>
            </div>
          </div>
          <table v-else>
            <thead>
              <tr>
                <th>Название</th>
                <th />
              </tr>
            </thead>

            <tbody>
              <tr v-for='item in orderedVisibleCategories' :key='item.id'>
                <td>
                  <div class='valign-wrapper'>
                    <span class='color' :class='item.color' />
                    <span>{{ item.name }}</span>
                    <a class='btn-flat' :title='titleFavourite(item)' @click='onFavourite(item)'>
                      <i v-if='item.isFavourite' class='material-icons yellow-text text-accent-4'>star</i>
                      <i v-else class='material-icons grey-text'>star_border</i>
                    </a>
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

          <table v-if='hiddenItems.length' class='hidden-table'>
            <thead>
              <tr>
                <th>Архив</th>
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
import Menu from '@/components/menu';
import Loader from '@/components/loader';
import PageHeader from '@/components/page_header';
import { get, call } from 'vuex-pathify';

export default {
  name: 'Categories',
  components: {
    Menu,
    Loader,
    PageHeader
  },
  props: {},
  computed: {
    token: get('user/token'),
    ...get('categories/*'),
    isAlert() {
      return !this.isLoading && this.items.length === 0;
    },
    orderedVisibleCategories() {
      return [
        ...this.visibleItems.filter(v => v.isFavourite),
        ...this.visibleItems.filter(v => !v.isFavourite)
      ];
    }
  },
  created() {
    this.fetch(this.token);
  },
  methods: {
    ...call('categories/*'),
    titleFavourite(category) {
      return category.isFavourite ? 'Удалить из избранного' : 'Добавить в избранное';
    },
    onEdit(category) {
      const { id } = category;
      this.$router.push({ name: 'edit_category', params: { id } });
    },
    async onHide(category) {
      if (this.isSubmitting) { return; }

      const isHidden = await this.toggleIsHidden({ token: this.token, category });
      const message = isHidden ? 'Категория добавлена в архив' : 'Категория удалена из архива';
      /* eslint-disable */ M.toast({ html: message }); /* eslint-enable */
    },
    async onDestroy(category) {
      if (this.isDestroying) { return; }

      if (confirm('Удалить категория. Вы уверены?')) {
        const res = await this.destroy({ token: this.token, category });
        const message = res != null ? 'Категория успешно удалена' : 'Непредвиденная ошибка';
        /* eslint-disable */ M.toast({ html: message }); /* eslint-enable */
      }
    },
    async onFavourite(category) {
      if (this.isSubmitting) { return; }

      const isFavourite = await this.toggleIsFavourite({ token: this.token, category });
      const message = isFavourite ?
        'Категория добавлена в избранное' :
        'Категория удалена из избранного';
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

.actions,
.actions-hidden
  text-align: right

  .btn-flat
    padding: 0 8px !important

.hidden-table
  margin-top: 60px
  opacity: 0.4
</style>
