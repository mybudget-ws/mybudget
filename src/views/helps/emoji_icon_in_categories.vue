<template>
  <div>
    <Menu />
    <div class='container container-wide'>
      <div class='row'>
        <div class='col s12'>
          <PageHeader name='Иконки в названиях категорий' />
          <div class='row'>
            <div class='col s12'>
              <p>
                Чтобы визуально быстрее находить нужную вам категрию, можно
                попровать добавить иконку или смайлик к названию категрии.
              </p>
              <p>
                Вот пример иконок, которые использую я:
              </p>
              <img
                class='materialboxed'
                src='../../assets/help/emoji-and-icons-in-categories/main.png'
              >
              <p>
                В названиях категорий, счетов, проектов и комментариях
                к операциям можно использовать emoji, а так же любые другие
                символы.
              </p>
              <p>
                Чтобы подобрать нужную иконку можно воспользоваться любым
                сайтом, с каталогом символов, которые используются в качестве
                смайликов и иконок.

                Иконки для своих категория я взял отсюда -
                <a href='https://unicode-table.com/ru/emoji/' target='_blank'>
                  unicode-table.com/ru/emoji
                </a>
              </p>

              <p>
                Выбираете иконку, копируете ее символ:
                <img
                  class='materialboxed'
                  src='../../assets/help/emoji-and-icons-in-categories/example-1.png'
                >
                <br>
                Затем вставьте скопированный символ в поле с названием категории
                и сохраните изменения.
                <img
                  class='materialboxed'
                  src='../../assets/help/emoji-and-icons-in-categories/example-2.png'
                >
              </p>
              <blockquote>
                Если вы хотите, чтобы иконка находилась перед текстом,
                то возможно вам потребуется добавить пробел после нее,
                но обычный пробел на вашей клавиатуре не подойдет.
                <br>

                Для этого нужно воспользоваться символом "неразрывного пробела".
                Вы его можете так же найти в таблице символов -
                <a href='https://unicode-table.com/ru/00A0/' target='_blank'>https://unicode-table.com/ru/00A0/</a>.
                Скопируйте и вставьте один или более, чтобы получить нужный вам
                отступ от иконки до текста.
              </blockquote>
              <br>
              <br>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Menu from '@/components/menu';
import PageHeader from '@/components/page_header';

export default {
  name: 'HelpIphoneIcon',
  components: {
    Menu,
    PageHeader
  },
  props: {},
  data: () => ({
  }),
  computed: {
  },
  methods: {
  }
};
</script>

<style scoped lang='sass'>
img
  border-radius: 12px
  border: 1px solid #ddd
  margin-top: 10px
</style>
