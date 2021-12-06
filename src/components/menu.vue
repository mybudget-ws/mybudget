<template>
  <div class='row row-menu'>
    <nav v-if='isShortMenu' class='menu z-depth-0'>
      <div class='nav-wrapper container'>
        <router-link
          to='/'
          class='brand-logo grey-text text-lighten-2 left col'
        >
          myBudget v2.1
        </router-link>
        <div class='right'>
          <router-link to='/currencies' :class='btnClasses'>
            Курсы валют
          </router-link>
          <router-link to='/sign_in' :class='btnClasses' class='sign-in'>
            Вход
          </router-link>
        </div>
      </div>
    </nav>
    <nav v-else class='blue-grey darken-4 z-depth-0'>
      <div class='nav-wrapper container container-wide'>
        <a href="#" data-target='mobile-demo' class='sidenav-trigger'>
          <i class='material-icons'>menu</i>
        </a>
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
              <i class='material-icons'>timeline</i>
            </router-link>
          </li>
          <li v-if='isGuest' class='right' title='Завершить Регистрацию'>
            <router-link to='/finish-sign-up' class='amber-text text-darken-2'>
              Завершить Регистрацию
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
      <li v-for='item in items' :key='item.path'>
        <a href='#' @click='goto(item.path)'>{{ item.name }}</a>
      </li>
      <li class='divider' />
      <li v-if='isGuest'>
        <a href='#' class='amber-text text-darken-2' @click='goto("/finish-sign-up")'>
          Завершить Регистрацию
        </a>
      </li>
      <li>
        <a href='#' @click='goto("currencies")'>Курсы валют</a>
      </li>
      <li>
        <a href='#' @click='goto("settings/profile")'>Настройки</a>
      </li>
      <li class='divider' />
      <li>
        <a @click='exit'>Выход</a>
      </li>
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
      { path: '/goals', name: 'Цели' },
      { path: '/projects', name: 'Проекты' },
      { path: '/properties', name: 'Имущество' }
    ]
  }),
  computed: {
    isSignedIn: get('user/isSignedIn'),
    isGuest: get('user/isGuest'),
    isShortMenu() {
      return this.$router.currentRoute.name === 'home' || !this.isSignedIn;
    },
    btnClasses() {
      return this.isShortMenu ?
        'waves-effect waves-light btn-flat grey-text text-lighten-5 z-depth-0' :
        'blue-grey-text text-lighten-5';
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
      if (this.isGuest) {
        const message = 'Вы не завершили регистрацию. ' +
          'Все данные данные будут удалены. Удалить данные и выйти?';
        if (!confirm(message)) { return; }
      }
      this.logout();
      // NOTE: Use location to reload the page and hide overlay
      // this.$refs.sidenav.click();
      // this.$router.replace({ name: 'home' });
      window.location.href = '/';
    },
    goto(path) {
      /* eslint-disable */
      // To hide .sidenav-overlay
      const instance = M.Sidenav.getInstance(this.$refs.sidenav);
      instance.close();
      /* eslint-disable */
      // https://github.com/vuejs/vue-router/issues/2872
      this.$router.push({ path }).catch(_e => {});
    }
  }
};
</script>

<style scoped lang='sass'>
.brand-logo
  font-size: 14px
  margin-top: 1px

.row-menu
  margin-bottom: 0

  .menu
    background: inherit

.sign-in
  border: 1px solid white
  border-radius: 6px
  line-height: 34px
  margin-right: 10px

nav
 i.material-icons
  font-size: 20px
</style>
