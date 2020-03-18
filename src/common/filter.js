import Vue from 'vue'
import utils from '@/common/util'

Vue.filter("formatTime", function (value, is_hfs) {
  let time = ~~value;
  return utils.toDate(time, is_hfs);
});

Vue.filter("formatMoney", function (value, pos=2) {
  let f = parseFloat(value);
  if (isNaN(f)) {
    return '0.00';
  }
  f = Math.round(value * Math.pow(10, pos)) / Math.pow(10, pos);
  let s = f.toString();
  let rs = s.indexOf('.');
  if (rs < 0) {
    rs = s.length;
    s += '.';
  }
  while (s.length <= rs + 2) {
    s += '0';
  }
  return s;
});