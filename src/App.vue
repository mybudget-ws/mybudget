<template>
  <div id='app'>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {}
};
</script>

<style lang='sass'>
@media only screen and (max-width: 601px)
  .container.container-wide
    width: 96% !important

@media only screen and (min-width: 601px)
  .container.container-wide
    width: 90% !important

@media only screen and (min-width: 993px)
  .container.container-wide
    width: 96% !important

@media only screen and (min-width: 1279px)
  .container.container-wide
    max-width: 1280px
    width: 96% !important

.container.container-wide
  max-width: 1400px
</style>
