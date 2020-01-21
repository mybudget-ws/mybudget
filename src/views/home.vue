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
        <button @click='ping'>Ping</button>
        <button @click='pingMutation'>Ping Mutation</button>
      </div-->
    </div>
  </div>
</template>

<script>
import Api from '../api';
import Menu from '@/components/menu';

export default {
  name: 'Home',
  components: {
    Menu
  },
  props: {},
  methods: {
    async ping() {
      await Api.ping();
    },
    async pingMutation() {
      await Api.pingMutation();
    }
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

.brand-logo
  font-size: 11px
</style>
