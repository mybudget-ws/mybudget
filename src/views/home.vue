<template>
  <div class='main-background'>
    <Menu />
    <div class='container main'>
      <div class='row'>
        <div class='col'>
          <h1 class='white-text'>Мой Бюджет</h1>
          <h2 class='grey-text text-lighten-3'>
            Домашняя бухгалтерия онлайн
          </h2>

          <div class='getstarted'>
            <Button
              v-if='isSignedIn'
              is-mobile-disable
              text='Войти'
              to='/transactions'
            />
            <Button
              v-else
              is-mobile-disable
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
        <h3 class='col'>Советы по использованию</h3>
      </div>

      <div class='row'>
        <div class='col s12 m6'>
          <div class='card horizontal z-depth-0'>
            <div class='card-image'>
              <img src='../assets/help/iphone-icon/main-screen-preview.png' alt='Создание иконки на домашнем экране iPhone'>
            </div>
            <div class='card-stacked blue-grey lighten-5'>
              <div class='card-content'>
                <p>
                  Создание иконки на домашнем экране iPhone
                  <span v-if='!isPhone'>для быстрого доступа на сайт</span>
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
              <img class='bordered' src='../assets/help/emoji-and-icons-in-categories/preview.png' alt='Как добавить иконки в названия категорий?'>
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
    </div>

    <Footer />
  </div>
</template>

<script>
import Button from '@/components/button';
import Footer from '@/components/footer';
import Menu from '@/components/menu';
import { get, sync, call } from 'vuex-pathify';

import MobileDetect from 'mobile-detect';
const md = new MobileDetect(window.navigator.userAgent);

export default {
  name: 'Home',
  components: {
    Button,
    Footer,
    Menu
  },
  props: {},
  data: () => ({
    isPhone: md.phone() != null
  }),
  computed: {
    isSignedIn: get('user/isSignedIn'),
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

h2
  line-height: 110%
  font-size: 1.64rem
  margin: 1.1rem 0 0.656rem 0

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

.main-background
  &:before
    background-image: url('../assets/home-background.svg')
    background-repeat: no-repeat
    position: absolute
    width: 100%
    // min-height: 100%
    height: 840px
    content: ''
    background-size: cover
    z-index: -1

.blog
  padding-top: 90px

  @media only screen and (max-width: 601px)
    padding-top: 0

.card
  max-height: 340px

  .card-image
    box-sizing: border-box

    img
      border-radius: 10px 0 0 10px
      max-height: 340px

      &.bordered
        border: 1px solid rgba(160, 160, 160, 0.2)

  .card-stacked
    border-radius: 0 10px 10px 0

  .card-action
    border-radius: 0 0 10px 0
</style>
