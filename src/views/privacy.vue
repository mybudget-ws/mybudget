<template>
  <div>
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
