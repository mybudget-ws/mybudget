<template>
  <nav v-if='isShortMenu' class='white z-depth-0 '>
    <div class='nav-wrapper container'>
      <router-link
        to='/'
        class='brand-logo grey-text left'
      >
        myBudget v2.0
      </router-link>
      <ul id='nav-mobile' class='right'>
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
  <nav v-else class='blue-grey darken-4 z-depth-0 '>
    <div class='nav-wrapper container'>
      <ul id='nav-mobile'>
        <li>
          <router-link to='/transactions' :class='btnClasses'>
            Операции
          </router-link>
        </li>
        <li>
          <router-link to='/accounts' :class='btnClasses'>
            Счета
          </router-link>
        </li>
        <li>
          <router-link to='/reports' :class='btnClasses'>
            Отчеты
          </router-link>
        </li>
        <li>
          <router-link to='/categories' :class='btnClasses'>
            Категории
          </router-link>
        </li>
        <li>
          <router-link to='/budgets' :class='btnClasses'>
            Бюджеты
          </router-link>
        </li>
        <li>
          <router-link to='/projects' :class='btnClasses'>
            Проекты
          </router-link>
        </li>
        <li class='right' title='Выход'>
          <a :class='btnClasses' @click='exit'>
            <i class='material-icons'>exit_to_app</i>
          </a>
        </li>
        <li class='right' title='Настройки'>
          <router-link to='/settings' :class='btnClasses'>
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
</template>

<script>
import { get, call } from 'vuex-pathify';

export default {
  name: 'Menu',
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
  methods: {
    logout: call('user/logout'),
    exit() {
      this.logout();
      this.$router.replace({ name: 'home' });
    }
  }
};
</script>

<style scoped lang='sass'>
.brand-logo
  font-size: 14px
</style>
