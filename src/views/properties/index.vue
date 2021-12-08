<template>
  <div>
    <Menu />
    <div class='container container-wide'>
      <PageHeader name='Имущество' action='/properties/new' />
      <div class='row'>
        <div class='col'>
          <div class='grey-text'>
            На данный момент раздел находится в разработке
            <ol>
              <li><strike>Список</strike></li>
              <li><strike>Создание / Редактирование / Удаление</strike></li>
              <li><strike>Архив</strike></li>
              <li>Привязка операций</li>
              <li>Просмотр со списком цен и операций</li>
              <li>График истории цены</li>
            </ol>
          </div>
        </div>
      </div>
      <div class='row'>
        <div class='col s12'>
          <Loader v-if='isLoading' />
          <div v-else-if='isAlert' class='card blue-grey'>
            <div class='card-content white-text'>
              <span class='card-title'>На данный момент имущество не добавлено</span>
              <p>
                При желании добавьте движимое и/или недвижимое имущество
                для учета изменения стоимости, а так же для отражения
                затрат на него.
              </p>
            </div>
          </div>
          <Collection
            v-if='items.length > 0'
            @destroy='onDestroy'
            @hide='onHide'
          />

          <CollectionArchive
            @hide='onHide'
            @destroy='onDestroy'
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Collection from '@/components/properties/collection';
import CollectionArchive from '@/components/properties/collection_archive';
import Loader from '@/components/loader';
import Menu from '@/components/menu';
import PageHeader from '@/components/page_header';
import { get, call } from 'vuex-pathify';

import MobileDetect from 'mobile-detect';
const md = new MobileDetect(window.navigator.userAgent);

export default {
  name: 'Properties',
  components: {
    Collection,
    CollectionArchive,
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
    ...get('properties/*'),
    isAlert() {
      return !this.isLoading && this.items.length === 0;
    }
  },
  created() {
    this.fetch(this.token);
  },
  methods: {
    ...call([
      'properties/fetch',
      'properties/destroy',
      'properties/toggleIsHidden'
    ]),
    async onDestroy(property) {
      if (this.isDestroying) { return; }
      if (confirm('Удалить имущество. Вы уверены?')) {
        const res = await this.destroy({ token: this.token, property });
        const message = res != null ?
          'Успешно удалено' :
          'Непредвиденная ошибка';
        /* eslint-disable */
        M.toast({ html: message });
        /* eslint-enable */
      }
    },
    async onHide(property) {
      if (this.isSubmitting) { return; }

      const isHidden = await this.toggleIsHidden({ token: this.token, property });
      const message = isHidden ? 'Отправлено в архив' : 'Извлечено из архива';
      /* eslint-disable */ M.toast({ html: message }); /* eslint-enable */
    }
  }
};
</script>

<style scoped lang='sass'>
</style>
