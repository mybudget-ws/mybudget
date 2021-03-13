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

    <div class='col s12 m6'>
      <div class='card horizontal z-depth-0'>
        <div class='card-image'>
          <img class='bordered' src='../../assets/help/emoji-and-icons-in-categories/preview.png'>
        </div>
        <div class='card-stacked blue-grey lighten-5'>
          <div class='card-content'>
            <p>
              Как добавить иконки в названия категорий?
            </p>
          </div>
          <div class='card-action'>
            <router-link
              class='teal-text'
              :to='{ name: "helps_emoji_icon_in_categories" }'
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
.card
  .card-image
    box-sizing: border-box

    img
      border-radius: 10px 0 0 10px
      max-height: 304px

      &.bordered
        border: 1px solid rgba(160, 160, 160, 0.2)

  .card-stacked
    border-radius: 0 10px 10px 0

  .card-action
    border-radius: 0 0 10px 0
</style>
