export default {
  format(number, digits = 2) {
    return digits > 0 ?
      number.toFixed(digits).replace(/\d(?=(\d{3})+\.)/g, '$& ') :
      number.toFixed(0).replace(/\d(?=(\d{3})+$)/g, '$& ');
  }
};
