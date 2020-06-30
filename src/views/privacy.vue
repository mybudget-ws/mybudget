<template>
  <div class='main-background'>
    <Menu />
    <div class='container'>
      <PageHeader name='Политика конфиденциальности' />
      <div class='row'>
        <p class='col s12'>
          Любая введенная вами информация, а так же полученная при регистрации,
          является вашей собственностью и не будет передана третьим лицам.
          <br>
          Мы не будем публиковать какие-либо сообщения от вашего имени
          в социальных сетях.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import Menu from '@/components/menu';
import PageHeader from '@/components/page_header';

export default {
  name: 'Privacy',
  components: {
    Menu,
    PageHeader
  },
  props: {},
  computed: {},
  methods: {}
};
</script>

<style scoped lang='sass'>
.container
  background: #fff
  padding: 10px 20px
  border-radius: 10px
  min-height: 10px
  margin-top: 20px

.main-background
  &:before
    background-image: url('../assets/home-background.svg')
    background-repeat: no-repeat
    position: absolute
    width: 100%
    min-height: 100%
    height: 840px
    content: ''
    background-size: cover
    z-index: -1
</style>
