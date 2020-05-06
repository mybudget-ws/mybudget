<template>
  <div v-if='!isEmpty'>
    <h6 class='subtitle'>Категории</h6>
    <p v-for='category in displayedCategories' :key='category.id'>
      <label>
        <Checkbox
          :id='category.id'
          :value='isChecked(category.id)'
          @change='onChange(category)'
        />
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
import Checkbox from '@/components/checkbox';

// TODO: Try to remove duplication with the categories.vue component.
export default {
  name: 'Categories',
  components: {
    Checkbox
  },
  props: {},
  data: () => ({
    isShowAllCategories: false
  }),
  computed: {
    token: get('user/token'),
    categories: get('categories/visibleItems'),
    selectedCategories: get('filters/categories'),
    isEmpty: get('categories/isEmpty'),
    isCategoiresLoaded: get('categories/isLoaded'),
    favouriteCategories() {
      return this.categories.filter(v => v.isFavourite);
    },
    isNeedShowAll() {
      return this.favouriteCategories.length > 0 &&
        this.selectedCategories.length < this.categories.length;
    },
    displayedCategories() {
      if (this.isNeedShowAll > 0 && !this.isShowAllCategories) {
        return this.categories
          .filter(v => this.selectedCategories.map(v => v.id).includes(v.id) || v.isFavourite);
      }
      return this.categories;
    }
  },
  async mounted() {
    if (!this.isCategoiresLoaded) {
      await this.fetchCategoires(this.token);
    }
  },
  methods: {
    fetchCategoires: call('categories/fetch'),
    toggleCategory: call('filters/toggleCategory'),
    showAll() { this.isShowAllCategories = true; },
    hideAll() { this.isShowAllCategories = false; },
    isChecked(id) {
      return this.selectedCategories.find(v => v.id === id) != null;
    },
    onChange(category) {
      this.toggleCategory({ category });
      this.$emit('onChange');
    }
  }
};
</script>

<style scoped lang='sass'>
</style>
