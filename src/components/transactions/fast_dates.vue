<template>
  <div class='fast-dates-container'>
    <span class='fast-dates'>
      <span
        v-for='item in dates'
        :key='item.label'
        class='top-account helper-text'
        :class='isSelected(item) ? "selected" : ""'
        @click='onClick(item)'
      >
        {{ item.label }}
      </span>
    </span>
  </div>
</template>

<script>
import DateFormat from '@/utils/date_format';

const daysAgo = (n) => {
  const now = new Date();
  now.setDate(now.getDate() - n);
  return now;
};

const daysAgoStr = (n) =>  DateFormat.short(daysAgo(n));

export default {
  name: 'FastDates',
  components: {},
  props: {
    selectedDate: { type: Date, required: false, default: () => new Date() }
  },
  data: () => ({
    dates: [
      { label: 'Сегодня', value: new Date() },
      { label: 'Вчера', value: daysAgo(1) },
      { label: daysAgoStr(2), value: daysAgo(2) },
      { label: daysAgoStr(3), value: daysAgo(3) },
      { label: daysAgoStr(4), value: daysAgo(4) }
    ]
  }),
  computed: {},
  methods: {
    isSelected({ value }) {
      // console.log('label', label);
      // console.log('value', DateFormat.toParam(value));
      // console.log('selectedDate', DateFormat.toParam(this.selectedDate));
      return DateFormat.toParam(value) === DateFormat.toParam(this.selectedDate);
    },
    onClick({ value }) {
      this.$emit('select', value);
    }
  }
};
</script>

<style scoped lang='sass'>
.fast-dates-container
  position: relative

.fast-dates
  position: absolute
  margin-top: -4px

  @media only screen and (max-width: 996px)
    padding-bottom: 6px
    display: inline-block
    position: inherit
    // margin-top: 10px

  .top-account
    cursor: pointer
    display: inline-block
    margin-right: 6px
    border-bottom: 1px dashed #bdbdbd

    &.selected
      color: #616161
      background-color: #fffde7
      // background-color: #fff9c4

    &:hover
      color: #616161
      border-bottom: 1px dashed #757575

    @media only screen and (max-width: 601px)
      font-size: 14px
      margin-right: 10px
</style>
