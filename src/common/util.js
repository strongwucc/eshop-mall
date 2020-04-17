function formatTime(time) {
  if (typeof time !== 'number' || time < 0) {
    return time
  }

  var hour = parseInt(time / 3600)
  time = time % 3600
  var minute = parseInt(time / 60)
  time = time % 60
  var second = time

  return ([hour, minute, second]).map(function (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }).join(':')
}

function formatLocation(longitude, latitude) {
  if (typeof longitude === 'string' && typeof latitude === 'string') {
    longitude = parseFloat(longitude)
    latitude = parseFloat(latitude)
  }

  longitude = longitude.toFixed(2)
  latitude = latitude.toFixed(2)

  return {
    longitude: longitude.toString().split('.'),
    latitude: latitude.toString().split('.')
  }
}

function toDate(number, is_hfs) {
  var n = number * 1000;
  if (number === '') {
    var date = new Date();
  } else {
    var date = new Date(n);
  }
  var Y = date.getFullYear();
  var M = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1);
  var D = (date.getDate() < 10 ? "0" + (date.getDate()) : date.getDate());
  var H = (date.getHours() < 10 ? "0" + (date.getHours()) : date.getHours());
  var F = (date.getMinutes() < 10 ? "0" + (date.getMinutes()) : date.getMinutes());
  var S = (date.getSeconds() < 10 ? "0" + (date.getSeconds()) : date.getSeconds());

  if (is_hfs == 1) {
    return (Y + '-' + M + '-' + D);
  } else if (is_hfs == 2) {
    return (Y + '.' + M + '.' + D);
  } else if (is_hfs == 3) {
    return (Y + '-' + M + '-' + D + ' ' + H + ':' + F);
  }

  return (Y + '-' + M + '-' + D + ' ' + H + ':' + F + ':' + S);
}

var dateUtils = {
  UNITS: {
    '年': 31557600000,
    '月': 2629800000,
    '天': 86400000,
    '小时': 3600000,
    '分钟': 60000,
    '秒': 1000
  },
  humanize: function (milliseconds) {
    var humanize = '';
    for (var key in this.UNITS) {
      if (milliseconds >= this.UNITS[key]) {
        humanize = Math.floor(milliseconds / this.UNITS[key]) + key + '前';
        break;
      }
    }
    return humanize || '刚刚';
  },
  format: function (dateStr) {
    var date = this.parse(dateStr)
    var diff = Date.now() - date.getTime();
    if (diff < this.UNITS['天']) {
      return this.humanize(diff);
    }
    var _format = function (number) {
      return (number < 10 ? ('0' + number) : number);
    };
    return date.getFullYear() + '/' + _format(date.getMonth() + 1) + '/' + _format(date.getDate()) + '-' +
      _format(date.getHours()) + ':' + _format(date.getMinutes());
  },
  parse: function (str) { //将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
    var a = str.split(/[^0-9]/);
    return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
  }
};

function base64src(base64data) {
  const fsm = wx.getFileSystemManager();
  const FILE_BASE_NAME = 'tmp_base64src';
  return new Promise((resolve, reject) => {
    const [, format, bodyData] = /data:image\/(\w+);base64,(.*)/.exec(base64data) || [];
    if (!format) {
      reject(new Error('ERROR_BASE64SRC_PARSE'));
    }
    const filePath = `${wx.env.USER_DATA_PATH}/${FILE_BASE_NAME}.${format}`;
    const buffer = wx.base64ToArrayBuffer(bodyData);
    fsm.writeFile({
      filePath,
      data: buffer,
      encoding: 'binary',
      success() {
        resolve(filePath);
      },
      fail() {
        reject(new Error('ERROR_BASE64SRC_WRITE'));
      },
    });
  });
}

module.exports = {
  formatTime: formatTime,
  formatLocation: formatLocation,
  toDate: toDate,
  dateUtils: dateUtils,
  base64src: base64src
}