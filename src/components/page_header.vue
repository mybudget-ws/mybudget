<template>
  <h3>
    <!--button @click='$router.go(-1)'>Назад</button-->
    {{ name }}
  </h3>
</template>

<script>
export default {
  name: 'PageHeader',
  components: {},
  props: {
    name: { type: String, required: true }
  },
  computed: {},
  methods: {}
};
</script>

<style scoped lang='sass'>
</style>
