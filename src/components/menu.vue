<template>
  <nav class='white z-depth-0 '>
    <div class='nav-wrapper container'>
      <router-link
        to='/'
        class='brand-logo grey-text left'
      >
        myBudget v2.0
      </router-link>
      <ul id='nav-mobile' class='right'>
        <li>
          <router-link
            to='/currencies'
            class='waves-effect waves-yellow btn-flat grey-text text-darken-4 z-depth-0'
          >
            Курсы валют
          </router-link>
        </li>
        <li>
          <router-link
            to='/'
            class='waves-effect waves-yellow btn-flat grey-text text-darken-4 z-depth-0'
          >
            Вход
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Menu'
};
</script>

<style scoped lang='sass'>
.brand-logo
  font-size: 14px
</style>
