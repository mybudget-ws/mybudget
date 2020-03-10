<template>
  <div>
    <Menu />
    <div class='container'>
      <PageHeader name='Новая цель' />

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
          <!--div class='row'>
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
          </div-->

          <div class='row'>
            <div class='col'>
              <Button
                text='Создать цель'
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
    name: 'Автомобиль'
  }),
  computed: {
    token: get('user/token'),
    isSubmitting: get('goals/isSubmitting')
  },
  async mounted() {
    this.$refs.name.focus();
  },
  methods: {
    create: call('projects/create'),
    async submit() {
      if (this.isSubmitting) { return; }

      const { name, token } = this;
      const project = { name };
      const isSuccess = await this.create({ token, project });
      if (isSuccess != null) {
        this.$router.push({ name: 'projects' });
      } else {
        alert('Error');
      }
    }
  }
};
</script>

<style scoped lang='sass'>
</style>
