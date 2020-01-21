<template>
  <div class='container'>
    <div class='top-header'>
      <div class='version'><span class='grey-text'>v2.0</span></div>
      <a class='right waves-effect waves-yellow btn-flat grey-text text-darken-4 z-depth-0' href='#'>
        Вход
      </a>
    </div>

    <h1>Мой Бюджет</h1>
    <h5>Домашняя бухгалтерия онлайн</h5>

    <div class='getstarted'>
      <a class='btn btn-large yellow waves-effect grey-text text-darken-4 z-depth-0' href='#'>
        Начать сейчас
      </a>
    </div>

    <div>
      <button @click='ping'>Ping</button>
      <button @click='pingMutation'>Ping Mutation</button>
    </div>
  </div>
</template>

<script>
import Api from '../api';

export default {
  name: 'Home',
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
  position: relative

.version
  position: absolute
  left: 0
  top: 28px
  font-size: 12px
</style>
