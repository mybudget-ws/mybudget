<template>
  <router-link
    v-if='to && (!isMobile || !isPhone)'
    :to='to'
    class='btn btn-large yellow waves-effect grey-text text-darken-4 z-depth-0'
    :class="{ 'disabled': isDisabled }"
  >
    {{ buttonText }}
  </router-link>
  <button
    v-else-if='!to && (!isMobile || !isPhone)'
    class='btn btn-large yellow waves-effect grey-text text-darken-4 z-depth-0'
    :class="{ 'disabled': isDisabled }"
    @click='click'
  >
    {{ buttonText }}
  </button>
  <button
    v-else
    class='btn-floating btn-large waves-effect waves-light z-depth-0 yellow'
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
    isMobile: { type: Boolean, required: false, default: true }
  },
  data: () => ({
    isPhone: md.phone() != null
  }),
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
