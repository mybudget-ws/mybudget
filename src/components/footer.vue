<template>
  <footer class='page-footer blue-grey lighten-4'>
    <div class='container'>
      <div class='row'>
        <div class='col'>
          <a href='https://mybudget.ws/' class='blue-grey-text text-darken-1'>
            Главная
          </a>
        </div>
        <div class='col'>
          <router-link
            to='/agreement'
            class='blue-grey-text text-darken-1'
          >
            Пользовательское соглашение
          </router-link>
        </div>
        <div class='col'>
          <router-link
            to='/privacy'
            class='blue-grey-text text-darken-1'
          >
            Политика конфиденциальности
          </router-link>
        </div>
        <div class='col right'>
          <a href='https://twitter.com/myBudget_' target='_blank' class='blue-grey-text text-darken-1'>
            Twitter
          </a>
          <a href='https://github.com/mybudget-ws/mybudget' target='_blank' class='blue-grey-text text-darken-1 github'>
            Исходный код
          </a>
        </div>
      </div>
    </div>
    <div class='footer-copyright'>
      <div class='container blue-grey-text text-darken-1'>
        <a
          href='//kalinichev.net'
          target='_blank'
          class='blue-grey-text text-darken-1'
        >
          ©2012-2022 Alexander Kalinichev
        </a>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
};
</script>

<style scoped lang='sass'>
.page-footer
  margin-top: 200px

  .footer-copyright
    .container
      padding-left: 0.75rem

  .github
    margin-left: 10px
</style>
