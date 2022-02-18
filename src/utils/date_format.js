const moment = require('moment');
moment.locale('ru');
const SERVER_UTC_OFFSET = 3;
const I18N_DATE_PICKER = {
  cancel: 'Закрыть',
  months: [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль',
    'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
  monthsShort: [
    'янв.', 'февр.', 'мар.', 'апр.', 'мая', 'июня', 'июля',
    'авг.', 'сент.', 'окт.', 'нояб.', 'дек.'
  ],
  weekdaysShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
  weekdaysAbbrev: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
};

export default {
  adaptive(date) {
    const dateTime = moment(date).utcOffset(SERVER_UTC_OFFSET, true);
    const current = moment().utcOffset(SERVER_UTC_OFFSET, true);

    if (moment(dateTime).isSame(current, 'day')) { return 'Сегодня'; }
    if (current.subtract(1, 'days').isSame(dateTime, 'day')) { return 'Вчера'; }
    if (current.year() === dateTime.year()) { return dateTime.format('DD MMMM'); }
    return dateTime.format('DD.MM.YYYY');
  },
  fixed(date) {
    return moment(date).utcOffset(SERVER_UTC_OFFSET, true).format('DD.MM.YYYY');
  },
  toParam(date) {
    return moment(date).utcOffset(SERVER_UTC_OFFSET, true).format('YYYY-MM-DD');
  },
  i18nDatePicker() {
    return I18N_DATE_PICKER;
  },
  datePickerInitData(date = new Date()) {
    return {
      format: 'dd mmm, yyyy',
      firstDay: 1,
      autoClose: true,
      setDefaultDate: true,
      defaultDate: date,
      i18n: I18N_DATE_PICKER
    };
  },
  month(date) {
    const dateTime = moment(date).utcOffset(SERVER_UTC_OFFSET, true);
    return dateTime.format('MMMM');
  }
};
