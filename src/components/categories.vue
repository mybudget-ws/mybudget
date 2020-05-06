<template>
  <div v-if='!isEmpty'>
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
      Скрыть категории
    </a>
  </div>
</template>

<script>
import { get, call } from 'vuex-pathify';

export default {
  name: 'Categories',
  components: {},
  props: {
    ids: { type: Array, required: false, default: () => [] }
  },
  data: () => ({
    categoryIds: [],
    isShowAllCategories: false
  }),
  computed: {
    token: get('user/token'),
    categories: get('categories/visibleItems'),
    isEmpty: get('categories/isEmpty'),
    isCategoiresLoaded: get('categories/isLoaded'),
    favouriteCategories() {
      return this.categories.filter(v => v.isFavourite);
    },
    isNeedShowAll() {
      return this.favouriteCategories.length > 0;
    },
    displayedCategories() {
      if (this.isNeedShowAll > 0 && !this.isShowAllCategories) {
        return this.categories
          .filter(v => this.categoryIds.includes(v.id) || v.isFavourite);
      }
      return this.categories;
    }
  },
  async mounted() {
    if (!this.isCategoiresLoaded) {
      await this.fetchCategoires(this.token);
    }
    this.categoryIds = [...this.ids];
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
