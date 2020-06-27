<template>
  <div class='row'>
    <div class='col s12 m6'>
      <div class='card horizontal z-depth-0'>
        <div class='card-image'>
          <img src='../../assets/help/iphone-icon/main-screen-preview.png'>
        </div>
        <div class='card-stacked blue-grey lighten-5'>
          <div class='card-content'>
            <p>
              Создание иконки на домашнем экране iPhone для быстрого
              доступа на сайт
            </p>
          </div>
          <div class='card-action'>
            <router-link
              class='teal-text'
              :to='{ name: "helps_iphone_icon" }'
            >
              Подробнее
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import PageHeader from '@/components/page_header';

export default {
  name: 'SettingsHelp',
  components: {
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
