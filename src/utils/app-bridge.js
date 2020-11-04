import { Toast } from 'vant'
export default {
  /*
			token 令牌
			appType app类型  parent - 家长端 teacher - 教师端
			pagePermission 页面权限 0-查看 1-编辑
			deviceType 设备类型  Android - 安卓 
			appVersion app版本 '2.1.0'
			lang 语言 Chinese - 中文 English - 英文
			其他业务参数  orgId-园所id  refId-班级id  refName-班级名称  schoolId-学校id  userLoginInfo-登录状态教师信息
	 */
  getAppData() {
    let info
    if (window.android) {
      info = window.android.getJsonDate('info');
    } else {// fgmmkmemjelhgmikkj.4837deb737cc4fd3a80657630a0d2a15.4
      // info = JSON.stringify({"appType":"{\"authMethod\":\"2\",\"id\":\"276208700119982081\",\"isDeleted\":false,\"refId\":\"241349049662909445\",\"refName\":\"11\",\"viewType\":1}","appVersion":"1031","deviceType":"Android","isCurrentUser":0,"lang":"CN","navHidden":1,"orgId":"235537787061797894","orgName":"xhh幼儿园","refId":"241349049662909445","refName":"11","schoolId":"235537811590854657","token":"fkjeeiemfdllmmhlfh.e6f7ff8640dc40f89253cf828966f084.4","userLoginInfo":"{\"accountId\":\"235537786046776327\",\"avatarUrl\":\"\",\"expire\":\"1598439258359\",\"jobs\":[],\"realName\":\"xhh\",\"schoolId\":\"235537811590854657\",\"teacherId\":\"235537811699906564\",\"token\":\"fgiigkkljdhjkkjgfk.a2d7f9ec9f59420c9278df8d52a14090.1\"}"})
      // info = JSON.stringify({"appType":"{\"authMethod\":\"3\",\"id\":\"261792998831183881\",\"isDeleted\":false,\"refId\":\"262559923383198729\",\"refName\":\"硬件活动室四\",\"viewType\":2}","appVersion":"1011","deviceType":"Android","isCurrentUser":0,"lang":"CN","navHidden":1,"orgId":"255101216353700866","orgName":"硬件设备幼儿园","refId":"262559923383198729","refName":"硬件活动室四","schoolId":"255101240118838272","token":"fhilfhggjfljmmihji.78f449e741764904b0157135e0dfc1f9.4","userLoginInfo":"{\"avatarUrl\":\"\",\"expire\":\"1597124513070\",\"jobs\":[\"园长\"],\"realName\":\"米西\",\"token\":\"fijiigfkijikikmifk.28cd31dd39254888923a79ee080a1282.1\"}"})
      // info = JSON.stringify({"appType":"{\"authMethod\":\"3\",\"id\":\"261792998831183881\",\"isDeleted\":false,\"refId\":\"260182566215571463\",\"refName\":\"小班\",\"viewType\":1}","appVersion":"1012","avatarUrl":"http://resource-fat.7kid.com/7kid/garden/img/202008/84f4b560032447e58dba803bc6b4f350.png?x-oss-process\u003dimage/quality,Q_50","deviceType":"Android","isCurrentUser":0,"lang":"CN","navHidden":1,"orgId":"255101216353700866","orgName":"硬件设备幼儿园","refId":"260182566215571463","refName":"小班","schoolId":"255101240118838272","token":"fjkjffhfkemklefkgm.924485ce02814bfb8327d9f4dc4c0562.4","userLoginInfo":"{\"accountId\":\"256553275657579527\",\"avatarUrl\":\"\",\"expire\":\"1597442389638\",\"jobs\":[\"园长\"],\"realName\":\"米西\",\"schoolId\":\"255101240118838272\",\"teacherId\":\"256553277293717509\",\"token\":\"fijiigfkijikikmifk.382a6fe88ae54f24bcccbc9ec5a976ed.1\"}"})
      info = JSON.stringify({"appType":"{\"authMethod\":\"3\",\"id\":\"265422987086574596\",\"isDeleted\":false,\"refId\":\"266796101829692419\",\"refName\":\"hsq\",\"viewType\":2}","appVersion":"1012","avatarUrl":"http://resource-fat.7kid.com/7kid/garden/img/202008/84f4b560032447e58dba803bc6b4f350.png?x-oss-process\u003dimage/quality,Q_50","deviceType":"Android","isCurrentUser":0,"lang":"CN","navHidden":1,"orgId":"255101216353700866","orgName":"硬件设备幼儿园","refId":"266796101829692419","refName":"hsq","schoolId":"255101240118838272","token":"fjkjffhfkemklefkgm.feb3c33d8cae4712a52b0ecf13890019.4","userLoginInfo":"{\"accountId\":\"256553275657579527\",\"avatarUrl\":\"\",\"expire\":\"1597454617115\",\"jobs\":[\"园长\"],\"realName\":\"米西\",\"schoolId\":\"255101240118838272\",\"teacherId\":\"256553277293717509\",\"token\":\"fijiigfkijikikmifk.19ae14504b7a4b0e9c2cc155a76b6dfb.1\"}"});
    }

    info ? localStorage.setItem('jsBridgeInfo',info) : '';
    return info 
  },
  // 打开设置页
  jumpToSetting(key) {
    try {
      window.android.jumpToSetting(key)
    } catch (err) {}
  },
  // 打开wifi
  jumpToWifi() {
    try {
      window.android.jumpToWifi()
    } catch (err) {}
  },
  // 设置声音
  setVolume(data) {
    try {
      window.android.setVolume(data)
    } catch(err) {}
  },
  // 获取声音
  getVolume() {
    let getVolume = 0
    try {
      getVolume = window.android.getVolume()
    } catch(err) {}
    return getVolume;
  },
  // 更新视频信息
  syncData(data) {
    try {
      window.android.syncData(data)
    } catch(err) {}
  },

  // 下载资源
  download(data) {
    try {
      window.android.download(data)
    } catch(err) {}
  },
  // 删除本地文件
  delete(data) {
    let delFlag
    try {
      delFlag = window.android.delete(data)
    } catch(err) {}
    return delFlag
  },
  // 删除成功
  deleteSuccess() {
    try {
      window.android.deleteSuccess();
    } catch(err) {}
  },
  // 获取本地下载资源
  getLocalMedia() {
    let data
    try {
      data = window.android.getLocalMedia();
    } catch(err) {}
    return data;
  },
  // 退出登录
  exitLogin() {
    try {
      window.android.exitLogin();
    } catch(err) {}
  },
  // 登陆
  toLogin(data) {
    try {
      window.android.toLogin(data);
    } catch(err) {}
  },
  toSecondLogin() {
    try {
      window.android.toSecondLogin();
    } catch(err) {}
  },
  // 获取存储空间的字节统计
  getLocalMemory() {
    let data = '0/8589934592'
    try {
      data = window.android.getLocalMemory();
    } catch(err) {}
    return data;
  }
}
