<template>
  <div class='row'>
    <div class='col s12'>
      <h3>
        <!--button @click='$router.go(-1)'>Назад</button-->
        {{ name }}
        <router-link
          v-if='action != null'
          :to='action'
          class='btn-floating waves-effect waves-light yellow z-depth-0'
        >
          <i class='material-icons grey-text text-darken-4'>add</i>
        </router-link>
      </h3>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageHeader',
  components: {},
  props: {
    name: { type: String, required: true },
    action: { type: String, required: false, default: null }
  },
  computed: {},
  methods: {}
};
</script>

<style scoped lang='sass'>
</style>
