<template>
  <div class='row row-menu'>
    <nav v-if='isShortMenu' class='white z-depth-0 '>
      <div class='nav-wrapper container'>
        <router-link
          to='/'
          class='brand-logo grey-text left'
        >
          myBudget v2.0
        </router-link>
        <ul class='right'>
          <li>
            <router-link to='/currencies' :class='btnClasses'>
              Курсы валют
            </router-link>
          </li>
          <li>
            <router-link to='/login' :class='btnClasses'>
              Вход
            </router-link>
          </li>
        </ul>
      </div>
    </nav>
    <nav v-else class='blue-grey darken-4 z-depth-0'>
      <div class='nav-wrapper container'>
        <a href="#" data-target='mobile-demo' class='sidenav-trigger'><i class='material-icons'>menu</i></a>
        <ul class='hide-on-med-and-down'>
          <li v-for='item in items' :key='item.path'>
            <router-link :to='item.path' :class='btnClasses'>
              {{ item.name }}
            </router-link>
          </li>
          <li class='right' title='Выход'>
            <a :class='btnClasses' @click='exit'>
              <i class='material-icons'>exit_to_app</i>
            </a>
          </li>
          <li class='right' title='Настройки'>
            <router-link to='/settings/profile' :class='btnClasses'>
              <i class='material-icons'>settings</i>
            </router-link>
          </li>
          <li class='right' title='Курсы валют'>
            <router-link to='/currencies' :class='btnClasses'>
              <i class='material-icons'>euro_symbol</i>
            </router-link>
          </li>
        </ul>
      </div>
    </nav>
    <ul
      v-if='!isShortMenu'
      id='mobile-demo'
      ref='sidenav'
      class='sidenav'
    >
      <li><a href='/transactions'>Операции</a></li>
      <li><a href='/accounts'>Счета</a></li>
      <li><a href='/reports'>Отчеты</a></li>
      <li><a href='/categories'>Категории</a></li>
      <li><a href='/budgets'>Бюджеты</a></li>
      <li><a href='/projects'>Проекты</a></li>
      <li class='divider' />
      <li><a href='/currencies'>Курсы валют</a></li>
      <li><a href='/settings'>Настройки</a></li>
      <li class='divider' />
      <li><a @click='exit'>Выход</a></li>
    </ul>
  </div>
</template>

<script>
import { get, call } from 'vuex-pathify';

export default {
  name: 'Menu',
  data: () => ({
    items: [
      { path: '/transactions', name: 'Операции' },
      { path: '/accounts', name: 'Счета' },
      { path: '/reports', name: 'Отчеты' },
      { path: '/categories', name: 'Категории' },
      { path: '/budgets', name: 'Бюджеты' },
      { path: '/goals', name: 'Цели' },
      { path: '/projects', name: 'Проекты' }
    ]
  }),
  computed: {
    isSignedIn: get('user/isSignedIn'),
    isShortMenu() {
      return this.$router.currentRoute.name === 'home' || !this.isSignedIn;
    },
    btnClasses() {
      return this.isShortMenu ?
        'waves-effect waves-yellow btn-flat grey-text text-darken-4 z-depth-0' :
        'waves-effect blue-grey-text text-lighten-5';
    }
  },
  mounted() {
    /* eslint-disable */
    M.Sidenav.init(this.$refs.sidenav, {});
    /* eslint-enable */
  },
  methods: {
    logout: call('user/logout'),
    exit() {
      this.logout();
      // NOTE: Use location to reload the page and hide overlay
      // this.$refs.sidenav.click();
      // this.$router.replace({ name: 'home' });
      window.location.href = '/';
    }
  }
};
</script>

<style scoped lang='sass'>
.brand-logo
  font-size: 14px
.row-menu
  margin-bottom: 0
</style>
