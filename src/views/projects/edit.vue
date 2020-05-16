<template>
  <div>
    <Menu />
    <div class='container container-wide'>
      <PageHeader name='Редактирование проекта' />

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
              <label for='name' class='active'>Название счета</label>
            </div>
          </div>
          <div class='row'>
            <div class='input-field col s4'>
              <select ref='selectColors' v-model='color'>
                <option
                  v-for='color in colors'
                  :key='color.id'
                  :value='color.id'
                >
                  {{ color.name }}
                </option>
              </select>
              <label>Цвет</label>
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
              <router-link to='/projects' class='btn-flat btn-large'>
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
import { get, call } from 'vuex-pathify';

export default {
  name: 'NewProject',
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
    token: get('user/token'),
    colors: get('colors/items')
  },
  async mounted() {
    const project = await api.project(this.token, { id: this.id });
    this.isLoading = false;
    this.name = project.name;
    this.color = project.color;

    await this.fetchColors();
    /* eslint-disable */
    this.selectColors = M.FormSelect.init(this.$refs.selectColors, {});
    M.updateTextFields();
    /* eslint-enable */

    this.$refs.name.focus();
  },
  methods: {
    fetchColors: call('colors/fetch'),
    async submit() {
      if (this.isSubmitting) { return; }

      const { id, name, color } = this;
      const isSuccess = await api.updateProject(this.token, { id, name, color });
      if (isSuccess != null) {
        this.$router.push({ name: 'projects' }).catch(_e => {});
      } else {
        alert('Error');
      }
    }
  }
};
</script>

<style scoped lang='sass'>
</style>
