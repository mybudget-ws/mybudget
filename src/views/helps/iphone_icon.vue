<template>
  <div>
    <Menu />
    <div class='container container-wide'>
      <div class='row'>
        <div class='col s12'>
          <PageHeader name='Создание иконки на домашнем экране iPhone' />
          <div class='row'>
            <div class='col s12 m6'>
              <p>
                1. Откройте в браузере страницу для быстрого доступа.
                Например, список операций или список счетов. Затем нажмите на кнопку
                <b>Поделиться</b>
              </p>
              <img
                class='materialboxed'
                width='300'
                src='../../assets/help/iphone-icon/i-1.png'
              >
            </div>
            <div class='col s12 m6'>
              <p>
                2. В появившемся меню выберите <b>На экран «Домой»</b>
              </p>
              <img
                class='materialboxed'
                width='300'
                src='../../assets/help/iphone-icon/i-2.png'
              >
            </div>
          </div>
          <div class='row'>
            <div class='col s12 m6'>
              <p>
                3. Отредактируйте название при необходимости и нажмите кнопку
                <b>Добавить</b>
              </p>
              <img
                class='materialboxed'
                width='300'
                src='../../assets/help/iphone-icon/i-3.png'
              >
            </div>
            <div class='col s12 m6'>
              <p>4. Готово</p>
              <img
                class='materialboxed'
                width='300'
                src='../../assets/help/iphone-icon/i-4.png'
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Menu from '@/components/menu';
import PageHeader from '@/components/page_header';

export default {
  name: 'HelpIphoneIcon',
  components: {
    Menu,
    PageHeader
  },
  props: {},
  data: () => ({
  }),
  computed: {
  },
  methods: {
  }
};
</script>

<style scoped lang='sass'>
</style>
