<template>
  <div class='main-background'>
    <Menu />
    <div class='container main'>
      <div class='row'>
        <div class='col'>
          <h1 class='white-text'>Мой Бюджет</h1>
          <h5 class='grey-text text-lighten-3'>
            Домашняя бухгалтерия онлайн
          </h5>

          <div class='getstarted'>
            <Button
              :is-mobile='false'
              text='Начать сейчас'
              to='/sign_up'
            />
          </div>
        </div>
      </div>
    </div>

    <div class='container'>
      <div class='row'>
        <div class='col l6 m12 s12'>
          <div class='feature z-depth-1'>
            <h5>Мой Бюджет</h5>
            <p>
              Это online сервис для ведения семейного бюджета и домашней бухгалтерии.
              Инструмент для учета повседневных доходов и расходов.
            </p>
          </div>
        </div>
        <div class='col l6 m12 s12'>
          <div class='feature z-depth-1'>
            <h5>Разные счета</h5>
            <p>
              Создание отдельного счета для наличных, банковского счета,
              кредитных карт, инвестиций, чтобы изящно сбалансировать учет финансов.
            </p>
          </div>
        </div>
        <div class='col l6 m12 s12'>
          <div class='feature z-depth-1'>
            <h5>Анализ данных</h5>
            <p>
              Просматривайте собранные и отсортированные данные, отображаемые
              в виде графиков и таблиц, анализируйте результат своей работы.
            </p>
          </div>
        </div>
        <div class='col l6 m12 s12'>
          <div class='feature z-depth-1'>
            <h5>Несколько валют</h5>
            <p>
              Для каждого из ваших счетов можно указать свою валюту.
              В отчетах есть возможность анализа расходов как в разрезе счетов, так и валют.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class='container blog'>
      <div class='row'>
        <h2 class='col'>Советы по использованию</h2>
      </div>
      <div class='row'>
        <div class='col s12 m6'>
          <div class='card horizontal z-depth-0'>
            <div class='card-image'>
              <img src='../assets/help/iphone-icon/main-screen-preview.png'>
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
    </div>

    <footer class='page-footer blue-grey lighten-4'>
      <div class='container'>
        <div class='row'>
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
        </div>
      </div>
      <div class='footer-copyright'>
        <div class='container blue-grey-text text-darken-1'>
          <a
            href='//kalinichev.net'
            target='_blank'
            class='blue-grey-text text-darken-1'
          >
            © 2020 Alexander Kalinichev
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import Button from '@/components/button';
import Menu from '@/components/menu';
import { get, sync, call } from 'vuex-pathify';

export default {
  name: 'Home',
  components: {
    Button,
    Menu
  },
  props: {},
  computed: {
    // NOTE: Just for test
    message: get('message'),
    ...sync('*')
    //
  },
  methods: {
    // NOTE: Just for test
    ...call([
      'greet',
      'ping',
      'pingMutation'
    ])
    //
  }
};
</script>

<style scoped lang='sass'>
h1
  margin-bottom: 0px

.getstarted
  margin-top: 40px
  margin-bottom: 20px

.top-header
  height: 40px
  padding: 20px

.container.main
  padding-bottom: 60px

.feature
  background: #fff
  padding: 10px 20px 18px
  border-radius: 10px
  min-height: 10px
  margin-bottom: 20px

.page-footer
  margin-top: 200px

  .footer-copyright
    .container
      padding-left: 0.75rem

.main-background
  &:before
    background-image: url('../assets/home-background.svg')
    background-repeat: no-repeat
    position: absolute
    width: 100%
    height: 840px
    content: ''
    background-size: cover
    z-index: -1

.blog
  padding-top: 90px

  @media only screen and (max-width: 601px)
    padding-top: 0

//.card
  border-radius: 10px
</style>
