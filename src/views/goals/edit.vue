<template>
  <div>
    <Menu />
    <div class='container'>
      <PageHeader name='Редактирование цели' />

      <div class='row'>
        <form class='col l10 s12' @submit.prevent='submit'>
          <div class='row'>
            <div class='input-field col s8'>
              <input
                id='name'
                ref='name'
                v-model='name'
                type='text'
                class='validate'
                autofocus
                required
              >
              <label for='name' class='active'>Название цели</label>
            </div>
          </div>

          <div class='row'>
            <div class='col'>
              <Button
                text='Изменить'
                :is-disabled='isSubmitting'
                :is-loading='isSubmitting'
                @click='submit'
              />
            </div>
            <div class='col'>
              <router-link to='/goals' class='btn-flat btn-large'>
                Отмена
              </router-link>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/button';
import Menu from '@/components/menu';
import PageHeader from '@/components/page_header';
import api from '@/api';
import { get } from 'vuex-pathify';

export default {
  name: 'NewGoal',
  components: {
    Button,
    Menu,
    PageHeader
  },
  props: {},
  data: () => ({
    name: '',
    color: 'light-blue',
    isLoading: true,
    isSubmitting: false
  }),
  computed: {
    id() { return this.$route.params.id; },
    token: get('user/token')
    // ,
    // colors: get('colors/items')
  },
  async mounted() {
    const item = await api.goal(this.token, { id: this.id });
    this.isLoading = false;
    this.name = item.name;

    /* eslint-disable */
    this.selectColors = M.FormSelect.init(this.$refs.selectColors, {});
    M.updateTextFields();
    /* eslint-enable */

    this.$refs.name.focus();
  },
  methods: {
    // fetchColors: call('colors/fetch'),
    async submit() {
      if (this.isSubmitting) { return; }

      const { id, name } = this;
      const isSuccess = await api.updateGoal(this.token, { id, name });
      if (isSuccess != null) {
        this.$router.push({ name: 'goals' }).catch(_e => {});
      } else {
        alert('Error');
      }
    }
  }
};
</script>

<style scoped lang='sass'>
</style>
