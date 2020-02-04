<template>
  <div v-if='isEmpty'>
    <h6 class='subtitle'>Категории</h6>
    <p v-for='category in displayedCategories' :key='category.id'>
      <label>
        <input
          :id='category.id'
          v-model='categoryIds'
          type='checkbox'
          :value='category.id'
          @change='onChange'
        >
        <span>{{ category.name }}</span>
      </label>
    </p>
    <a
      v-if='isNeedShowAll && !isShowAllCategories'
      class='btn-flat btn-small waves-effect waves-teal'
      @click='showAll'
    >
      Показать все
    </a>
    <a
      v-if='isNeedShowAll && isShowAllCategories'
      class='btn-flat btn-small waves-effect waves-teal'
      @click='hideAll'
    >
      Только избранные
    </a>
  </div>
</template>

<script>
import { get, call } from 'vuex-pathify';

export default {
  name: 'Categories',
  components: {},
  props: {},
  data: () => ({
    categoryIds: [],
    isShowAllCategories: false
  }),
  computed: {
    token: get('user/token'),
    categories: get('categories/items'),
    isCategoiresLoaded: get('categories/isLoaded'),
    favouriteCategories() {
      return this.categories.filter(v => v.isFavourite);
    },
    isNeedShowAll() {
      return this.favouriteCategories.length > 0;
    },
    displayedCategories() {
      if (this.isNeedShowAll > 0 && !this.isShowAllCategories) {
        return this.favouriteCategories;
      }
      return this.categories;
    },
    isEmpty() {
      return this.categories.length === 0;
    }
  },
  async mounted() {
    if (!this.isCategoiresLoaded) {
      await this.fetchCategoires(this.token);
    }
  },
  methods: {
    fetchCategoires: call('categories/fetch'),
    showAll() { this.isShowAllCategories = true; },
    hideAll() { this.isShowAllCategories = false; },
    onChange() {
      this.$emit('change', this.categoryIds);
    }
  }
};
</script>

<style scoped lang='sass'>
</style>
