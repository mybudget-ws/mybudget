<template>
  <router-link
    v-if='to && !isFloat'
    :to='to'
    class='btn btn-large yellow waves-effect grey-text text-darken-4 z-depth-0'
    :class="{ 'disabled': isDisabled }"
  >
    {{ buttonText }}
  </router-link>
  <button
    v-else-if='!to && !isFloat'
    class='btn btn-large yellow waves-effect grey-text text-darken-4 z-depth-0'
    :class="{ 'disabled': isDisabled }"
    @click='click'
  >
    {{ buttonText }}
  </button>
  <button
    v-else
    class='btn-floating btn-large yellow waves-effect waves-light z-depth-0'
    :class="{ 'disabled': isDisabled }"
    @click='click'
  >
    <slot />
  </button>
</template>

<script>
import MobileDetect from 'mobile-detect';
const md = new MobileDetect(window.navigator.userAgent);

export default {
  name: 'Button',
  components: {},
  props: {
    to: { type: [String, Object], required: false, default: null },
    text: { type: String, required: false, default: null },
    isDisabled: { type: Boolean, required: false, default: false },
    isLoading: { type: Boolean, required: false, default: false },
    isMobile: { type: Boolean, required: false, default: false },
    isMobileDisable: { type: Boolean, required: false, default: false }
  },
  data: () => ({
    isPhone: md.phone() != null
  }),
  computed: {
    buttonText() {
      return this.isLoading ?
        `${this.text}...` :
        this.text;
    },
    isFloat() {
      if (this.isMobileDisable) { return false; }
      return this.isMobile || this.isPhone;
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
