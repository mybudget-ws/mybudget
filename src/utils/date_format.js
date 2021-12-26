const moment = require('moment');
moment.locale('ru');
const SERVER_UTC_OFFSET = 3;

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
  }
};
