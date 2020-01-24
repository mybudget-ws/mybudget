<template>
  <div>
    <Menu />
    <div class='container'>
      <h1>Мой Бюджет</h1>
      <h5>Домашняя бухгалтерия онлайн</h5>

      <div class='getstarted'>
        <a class='btn btn-large yellow waves-effect grey-text text-darken-4 z-depth-0' href='#'>
          Начать сейчас
        </a>
      </div>

      <!--div>
        <button @click='greet'>Greet</button>
        <button @click='ping'>Ping</button>
        <button @click='pingMutation'>Ping Mutation</button>
      </div-->
    </div>
  </div>
</template>

<script>
import Menu from '@/components/menu';
import { get, sync, call } from 'vuex-pathify';

export default {
  name: 'Home',
  components: {
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
</style>
