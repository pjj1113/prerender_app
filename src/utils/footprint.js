var BrowserMatch = {
  init: function () {
    this.browser = this.getBrand() + '-' + this.getBrowser() // 获取浏览器名
    this.OS = this.getOS() ; // 系统及版本号
    this.uuid = this.getUuid()
    return {
      'app-version': '7kid_classboard_1.0.0',
      'client-type': 'Web',
      'client-brand': this.browser,
      'client-version': this.OS,
      'client-id': this.uuid
    }
  },
  getOS: function () {
    let os = "unknown";
    let ua = navigator.userAgent;
    if (ua.indexOf('Android') > -1 || ua.indexOf('Linux') > -1) {
      os = 'Android'
    } else if (ua.indexOf('iPhone') > -1) {
      os = 'iPhone'
    } else if (ua.indexOf('Windows Phone') > -1) {
      os = 'WP'
    } else if (ua.indexOf('iPad') > -1) {
      os = 'iPad'
    } else {
      os = 'unknown'
    }
    try {
      if (ua.indexOf('Android') > -1) {
        os = ua.split(';').find(i=>i.indexOf('Android')>-1 || ua.indexOf('Linux') > -1)
      }else if (navigator.userAgent.indexOf('iPhone') > -1) {
        os = ua.split(';')[1].match(/(\d+)_(\d+)_?(\d+)?/)[0]
      }
    }catch(err){
      
    }
    return os
  },
  getBrand: function () {
    let ua = navigator.userAgent.toLowerCase()
    var isIpad = ua.match(/ipad/i) == 'ipad'
    var isIphone = ua.match(/iphone/i) == 'iphone'
    var isHuawei = ua.match(/huawei/i) == 'huawei'
    var isHonor = ua.match(/honor/i) == 'honor'
    var isOppo = ua.match(/oppo/i) == 'oppo'
    var isOppoR15 = ua.match(/pacm00/i) == 'pacm00'
    var isVivo = ua.match(/vivo/i) == 'vivo'
    var isXiaomi = ua.match(/mi\s/i) == 'mi '
    var isXiaomi2s = ua.match(/mix\s/i) == 'mix '
    var isRedmi = ua.match(/redmi/i) == 'redmi'
    var isSamsung = ua.match(/sm-/i) == 'sm-'
    var isBlackberry = ua.match(/blackberry/i) == 'blackberry'
    var isMeizu = ua.match(/meizu/i) == 'meizu'
    var isOD = ua.match(/od/i) == 'od'
    if (isIpad) {
      return 'IPad'
    } else if (isIphone) {
      return 'IPhone'
    } else if (isHuawei || isHonor) {
      return 'Huawei'
    } else if (isOppo || isOppoR15) {
      return 'Oppo'
    } else if (isVivo) {
      return 'Vivo'
    } else if (isXiaomi || isRedmi || isXiaomi2s) {
      return 'Xiaomi'
    } else if (isSamsung) {
      return 'Samsung'
    } else if (isBlackberry) {
      return 'BlackBerry'
    } else if (isMeizu) {
      return 'Meizu'
    } else if (isOD) {
      return 'OD'
    } else {
      return 'unknown'
    }
  },
  getBrowser: function () {
    let ua = navigator.userAgent.toLowerCase()
    let browser = ''
    switch (true) {
      case ua.indexOf('7kid') > -1:
        browser = '7kid'
        break
      case ua.indexOf('micromessenger') > -1:
        browser = 'MicroMessenger'
        break
      case ua.indexOf('qqtheme') > -1:
        browser = 'QQ'
        break
      case ua.indexOf('alipayclient') > -1:
        browser = 'Alipay'
        break
      case ua.indexOf('weibo') > -1:
        browser = 'Weibo'
        break
      case ua.indexOf('ucbrowser') > -1:
        browser = 'UCBrowser'
        break
      case ua.indexOf('qqbrowser') > -1:
        browser = 'QQBrowser'
        break
      case ua.indexOf('baidu') > -1:
        browser = 'Baidu'
        break
      case ua.indexOf('sogou') > -1:
        browser = 'Sogou'
        break
      case ua.indexOf('360browser') > -1:
        browser = '360browser'
        break
      case ua.indexOf('maxthon') > -1:
        browser = 'Maxthon'
        break
      case ua.indexOf('quark') > -1:
        browser = 'Quark'
        break
      case ua.indexOf('firefox') > -1:
        browser = 'Firefox'
        break
      case ua.indexOf('chrome') > -1:
        browser = 'Chrome'
        break
      case ua.indexOf('opera') > -1:
        browser = 'Opera'
        break
      case ua.indexOf('safari') > -1:
        browser = 'Safari'
        break
      default:
        browser = this.getOS()
    }
    return browser
  },
  getUuid: function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0
      var v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }
}

export function getClientInfo () {
  return BrowserMatch.init()
}
