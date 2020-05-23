<template>
  <div>
    <Menu />
    <div class='container container-wide'>
      <div class='row'>
        <div class='col s12 l2'>
          <ul class='collection'>
            <router-link
              v-for='item in leftMenu'
              :key='item.id'
              class='collection-item grey-text text-darken-4'
              :class='submenuClass(item)'
              :to='`/settings/${item.id}`'
            >
              {{ item.name }}
            </router-link>
          </ul>
        </div>
        <div class='col s12 l9'>
          <PageHeader :name='currentHeader' />
          <Loader v-if='isLoading' />
          <SettingsProfile v-if='currentId === "profile"' />
          <SettingsPassword v-if='currentId === "password"' />
          <SettingsSubscription v-if='currentId === "subscription"' />
          <SettingsSupport v-if='currentId === "support"' />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Menu from '@/components/menu';
import Loader from '@/components/loader';
import PageHeader from '@/components/page_header';
import SettingsProfile from '@/views/settings/profile';
import SettingsPassword from '@/views/settings/password';
import SettingsSubscription from '@/views/settings/subscription';
import SettingsSupport from '@/views/settings/support';

export default {
  name: 'Settings',
  components: {
    Menu,
    Loader,
    PageHeader,
    SettingsProfile,
    SettingsPassword,
    SettingsSubscription,
    SettingsSupport
  },
  props: {},
  data: () => ({
    leftMenu: [
      { id: 'profile', name: 'Профиль', long: 'Ваш профиль' },
      { id: 'password', name: 'Пароль', long: 'Изменить пароль' },
      { id: 'subscription', name: 'Тарифный план' },
      { id: 'support', name: 'Поддержка', long: 'Написать разработчикам' }
    ],
    // NOTE: Remove isLoading
    isLoading: false
  }),
  computed: {
    currentHeader() {
      const item = this.leftMenu.find(v => v.id === this.currentId);
      if (item == null) { return 'Настройки'; }
      return item.long || item.name;
    },
    currentId() {
      return this.$route.params.tab;
    }
  },
  methods: {
    submenuClass(item) {
      return this.$route.params.tab === item.id ?
        'active teal lighten-2' :
        null;
    }
  }
};
</script>

<style scoped lang='sass'>
.collection
  margin-top: 30px
</style>
