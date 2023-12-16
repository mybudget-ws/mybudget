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
  adaptive(date = new Date()) {
    const dateTime = moment(date).utcOffset(SERVER_UTC_OFFSET, true);
    const current = moment().utcOffset(SERVER_UTC_OFFSET, true);

    if (moment(dateTime).isSame(current, 'day')) { return 'Сегодня'; }
    if (current.subtract(1, 'days').isSame(dateTime, 'day')) { return 'Вчера'; }
    if (current.year() === dateTime.year()) { return dateTime.format('D MMMM'); }
    return dateTime.format('DD.MM.YYYY');
  },
  reportAdaptive(date = new Date()) {
    const dateTime = moment(date).utcOffset(SERVER_UTC_OFFSET, true);
    const current = moment().utcOffset(SERVER_UTC_OFFSET, true);

    if (current.year() === dateTime.year()) { return dateTime.format('D MMMM'); }
    return dateTime.format('DD.MM.YYYY');
  },
  reportAdaptiveMonthAgo(months) {
    const current = moment().utcOffset(SERVER_UTC_OFFSET, true);
    const dateTime = moment().utcOffset(SERVER_UTC_OFFSET, true).subtract(months, 'months');

    if (current.year() === dateTime.year()) { return dateTime.format('D MMMM'); }
    return dateTime.format('D MMMM YYYY');
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
  datePickerInitData(date = new Date(), onSelect = null) {
    return {
      format: 'dd mmm, yyyy',
      firstDay: 1,
      autoClose: true,
      setDefaultDate: true,
      defaultDate: date,
      i18n: I18N_DATE_PICKER,
      onSelect
    };
  },
  month(date) {
    const dateTime = moment(date).utcOffset(SERVER_UTC_OFFSET, true);
    return dateTime.format('MMMM');
  },
  monthAdaptive(date) {
    const dateTime = moment(date).utcOffset(SERVER_UTC_OFFSET, true);
    const current = moment().utcOffset(SERVER_UTC_OFFSET, true);

    if (moment(dateTime).isSame(current, 'year')) {
      return dateTime.format('MMMM');
    }
    return dateTime.format('MMMM YYYY');
  }
};
