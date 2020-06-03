<template>
  <div class='main-background'>
    <Menu />
    <div class='container main'>
      <div class='row'>
        <div class='col'>
          <h1>Мой Бюджет</h1>
          <h5>Домашняя бухгалтерия онлайн</h5>

          <div class='getstarted'>
            <!--Button
              text='Начать сейчас'
              to='/sign_up'
            /-->
            <Button
              text='Начать сейчас'
              to='/sign_in'
            />
          </div>
        </div>
      </div>
    </div>

    <div class='container feature'>
      <div class='row'>
        <div class='col l6 m6 s12'>
          <h5>Мой Бюджет</h5>
          <p>
            Это online сервис для ведения семейного бюджета и домашней бухгалтерии.
            Инструмент для учета повседневных доходов и расходов.
          </p>
        </div>
        <div class='col l6 m6 s12'>
          <h5>Разные счета</h5>
          <p>
            Создание отдельного счета для ваших наличных денег, банковского счета,
            кредитных карт, инвестиций, активов и кредитов, чтобы изящно сбалансировать свой учет.
          </p>
        </div>
      </div>
      <div class='row'>
        <div class='col l6 m6 s12'>
          <h5>Анализ данных</h5>
          <p>
            Просматривайте собранные и отсортированные данные, отображаемые
            в удобном виде графиков и таблиц, анализируйте результат вашей работы,
            чтобы определить места для улучшения.
          </p>
        </div>
        <div class='col l6 m6 s12'>
          <h5>Несколько валют</h5>
          <p>
            Для каждого из ваших счетов можно указать свою валюту.
            В отчетах есть возможность анализа расходов как в разрезе счетов, так и валют.
          </p>
        </div>
      </div>
    </div>
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

.top-header
  height: 40px
  padding: 20px

.main-background
  // background: linear-gradient(153.23deg, #c5cae9 0%, rgba(255, 255, 255, 0) 100%), #ffffff;
  // background: linear-gradient(153.23deg, #919ce2 5.73%, rgba(255, 255, 255, 0) 100%), #ffffff;

.container.main
  padding-bottom: 60px

.container.feature
  // background: #fff
</style>
