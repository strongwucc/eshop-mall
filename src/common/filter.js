import Vue from 'vue'
import utils from '@/common/util'

Vue.filter("formatTime", function(value, is_hfs){
  let time = ~~value;
	return utils.toDate(time, is_hfs);
});