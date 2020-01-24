<template>
  <router-link
    v-if='to'
    :to='to'
    class='btn btn-large yellow waves-effect grey-text text-darken-4 z-depth-0'
    :class="{ 'disabled': isDisabled }"
  >
    {{ buttonText }}
  </router-link>
  <button
    v-else
    class='btn btn-large yellow waves-effect grey-text text-darken-4 z-depth-0'
    :class="{ 'disabled': isDisabled }"
    @click='click'
  >
    {{ buttonText }}
  </button>
</template>

<script>
export default {
  name: 'Button',
  components: {},
  props: {
    to: { type: [String, Object], required: false, default: null },
    text: { type: String, required: false, default: null },
    isDisabled: { type: Boolean, required: false, default: false },
    isLoading: { type: Boolean, required: false, default: false }
  },
  computed: {
    buttonText() {
      return this.isLoading ?
        `${this.text}...` :
        this.text;
    }
  },
  methods: {
    click() {
      if (this.isLoading || this.isDisabled) { return; }
      this.$emit('click');
    }
  }
};
</script>

<style scoped lang='sass'>
</style>
