<template>
  <div>
    <Menu />
    <div class='container container-wide'>
      <!--PageHeader name='Бюджеты' action='/budgets/new' /-->
      <PageHeader name='Бюджеты' />
      <div class='row'>
        <div class='col-12'>
          <Loader v-if='isLoading' />
          <div class='card blue-grey'>
            <div class='card-content white-text'>
              <span class='card-title'>Скоро</span>
              <p>Данный фукнционал находится в разработке</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Menu from '@/components/menu';
import Loader from '@/components/loader';
import PageHeader from '@/components/page_header';

export default {
  name: 'Budgets',
  components: {
    Menu,
    Loader,
    PageHeader
  },
  props: {},
  computed: {
    isLoading() { return false; }
  }
};
</script>

<style scoped lang='sass'>
</style>
