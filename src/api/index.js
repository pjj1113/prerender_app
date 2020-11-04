import axios from 'axios'
import qs from 'qs'
import { Toast } from 'vant'
import jsBridge from '../utils/app-bridge'
import { getClientInfo } from '../utils/footprint'
import { encodeSign, encodeReq } from '@/utils/encrypt';

// axios 配置
axios.defaults.timeout = 10000 //10s
axios.defaults.baseURL = '/api'
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.headers['et'] = 'a';
// 需要用户登录后才能使用的api
const userApi = [
  '/garden/v1/classBrand/content/find'
];

//统一添加access_token
axios.interceptors.request.use(
  (config) => {
    // if(userApi.some(item => item === config.url)) {
    //   config.headers['Authorization'] =
    //   'Bearer ' + config.headers.Authorization
    // } else if (localStorage.getItem('jsBridgeInfo')) {
    //   config.headers['Authorization'] =
    //     'Bearer ' + JSON.parse(localStorage.getItem('jsBridgeInfo')).token
    // } else {
    //   config.headers['Authorization'] = 'Bearer ' + jsBridge.getAppData().token
    // }
    if (!localStorage.getItem('clientInfo')) {
      localStorage.setItem('clientInfo', JSON.stringify(getClientInfo()))
    }
    const clientInfo = JSON.parse(localStorage.getItem('clientInfo'))
    config.headers['app-version'] = clientInfo['app-version']
    config.headers['client-type'] = clientInfo['client-type']
    config.headers['client-brand'] = clientInfo['client-brand']
    config.headers['client-version'] = clientInfo['client-version']
    config.headers['client-id'] = clientInfo['client-id']

    config.headers['lang'] = localStorage.getItem('language') || 'zh-cn'
    if (
      config.headers['Content-Type'] === 'application/x-www-form-urlencoded'
    ) {    
      // config.transformRequest = [function (data) {
      //   // 在请求之前对data传参进行格式转换
      //   return qs.stringify(data)
      // }]
      if(typeof config.data != "string") {
        config.data = qs.stringify(config.data)
      }      
    }
    config.headers['sign'] = encodeSign(config);
		const { reqSign, reqId, reqTt } = encodeReq(config);
		config.headers['reqSign'] = reqSign;
		config.headers['reqId'] = reqId;
		config.headers['reqTt'] = reqTt;
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

//返回状态判断
axios.interceptors.response.use(
  (res) => {
    if (res.data.code == 'common-0001') {
      return res
    } else {
      return Promise.reject(res.data)
    }
  },
  (err) => {
    if (err && err.response) {
      switch (err.response.status) {
        case 401:
          err.message = '未授权，请登录'
          break
        case 403:
          console.log(err.response)
          if(err.response.data.code == 'permission-0006') {
            err.message = err.response.data.message;
            break;
          }
          err.message = '拒绝访问'
          break
        case 404:
          err.message = `请求地址出错: ${err.response.config.url}`
          break
        default:
          if (err.response.data) {
            err.message = ''
            if (err.response.data.message) {
              //JAVA异常抛出辑错误信息
              err.message += err.response.data.message
            }
            if (err.response.data.errorText) {
              //业务逻辑错误信息
              err.message += err.response.data.errorText
            }
          } else {
            err.message = '服务器异常'
          }
      }
    } else if (
      err.code == 'ECONNABORTED' &&
      err.message.indexOf('timeout') != -1
    ) {
      err.message = '请求超时，请重试'
    }
    return Promise.reject(err)
  }
)
const headers = {
  headers: {
    Authorization:'Bearer ' + JSON.parse(jsBridge.getAppData()).token
  }
}
export function fetchPost(url, params, config= {...headers}, fail = false) {
  if(config && !config.headers.Authorization) {
    config.headers['Authorization'] = 'Bearer ' + JSON.parse(jsBridge.getAppData()).token
  } 
  if(config.headers['Authorization'].length<=20){
    // Toast("Token不存在")
    return new Promise(()=>{});
  }
  return new Promise((resolve, reject) => {
    axios
      .post(url, params, config)
      .then(
        (response) => {
          axios.defaults.baseURL = '/api'
          resolve(response.data)
        },
        (err) => {
          if (fail) {
            reject(err.response.data)
          } else {
            Toast(err.message)
            reject(err)
          }
        }
      )
      .catch((error) => {
        reject(error)
      })
  })
}

export function fetchGet(url, param, fail = false) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: param,
      })
      .then(
        (response) => {
          resolve(response.data)
        },
        (err) => {
          if (fail) {
            reject(err.response.data)
          } else {
            Toast(err.message)
            reject(err)
          }
        }
      )
      .catch((error) => {
        reject(error)
      })
  })
}
export default {
  /** 班级视图 */
  // 天气信息
  getWeatherInfo(params) {
    return fetchPost('/kid-arch/v1/teacher/weather/getByDay', params)
  },
  //获取班级老师列表
  clazzAndTeacherInfo(params) {
    return fetchPost('/kid-arch/v1/classBrand/clazzAndTeacherInfo', params)
  },
  //教师端获取幼儿信息
  teacherGetStudentInfo(params) {
    return fetchPost('/kid-arch/v1/teacher/student/get-detail', params)
  },

  //按班级维度统计 请假、打卡人数
  signAndLeaveInfo(params) {
    return fetchPost(
      '/attendance/v1/clazzBrandStatics/signAndLeaveInfo',
      params,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  },
  //按班级维度统计异常晨检信息 
  healthInspectExceptionInfo(params) {
    return fetchPost(
      '/attendance/v1/clazzBrandStatics/healthInspectExceptionInfo',
      params,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  },
  //按班级维度统计晨检信息
  healthInspectInfo(params) {
    return fetchPost(
      '/attendance/v1/clazzBrandStatics/healthInspectInfo',
      params,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  },
  // 获取学生详情
  getStudentdetail(data){
    return fetchPost('/attendance/v1/clazzBrandStatics/healthInspectByStudentId', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  },
  // 更新学生状态 
  updateAttendanceStatus(data) {
    return fetchPost('/attendance/v1/clazzBrandStatics/updateAttendanceStatus',data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  },
  /** 宣传视图  */
  // 内容包查询
  findClassBrand(data) {
    return fetchPost('/garden/v1/classBrand/content/find', data, {
      headers: {
        'Authorization': 'Bearer ' + JSON.parse(JSON.parse(jsBridge.getAppData()).userLoginInfo).token
      }
    })
  },
  // 获取学生列表 
  healthInspectStudentList(data) {
    return fetchPost('/attendance/v1/clazzBrandStatics/healthInspectStudentList', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  },
  // 获取特需餐学生列表 
  specialStudentList(data) {
    return fetchPost('/garden/v1/teacher/ck/brand/clazz/special/student/clazz/daily/list', data)
  },
  //获取课程列表
  getCourseInfo(data){
    return fetchPost('/garden/v1/course/weekCourseInfo', data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
  },
  //获取课程详细信息
  getCourseDetailInfo(data){
    return fetchPost('/garden/v1/course/selectDetailById',data,{
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    })
  },
  //获取上课学生列表
  getStudentList(data){
    return fetchPost('/garden/v1/course/listClassStudent',data,{
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
  },
  //获取活动室详情
  getHabitRoomDetail(data){
    return fetchPost('/garden/v1/placeRoom/selectById',data,{
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
  },

  // 获取今日计划 
  getTeacherPlantDay(data) {
    return fetchPost('/garden/v1/teacher/teachPlan/plan/getCurrentDay', data)
  },

  //开始上课
  startCourse(data){
    return fetchPost('/garden/v1/course/start',data, {
      headers: {
        'Authorization': 'Bearer ' + JSON.parse(JSON.parse(jsBridge.getAppData()).userLoginInfo).token
      }
    })
  },
  
   // 获取餐次列表
   getCookIndexByDate(data) {
    return fetchPost('/garden/v1/teacher/ck/brand/clazz/daily/get-by-date', data)
  },
   // 获取餐次内容
  getCookByIndex(data) {
    return fetchPost('/garden/v1/teacher/ck/brand/clazz/special/student/school/daily/statistical', data)
  },
  // 获取确认配餐信息
  mealStatsForClass(data) {
    return fetchPost('/garden/v1/teacher/ck/brand/clazz/meal/statistical', data)
  },
   // 确认配餐信息
   confirmMeal(data) {
    return fetchPost('/garden/v1/teacher/ck/cookbook/meal/confirm', data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + JSON.parse(JSON.parse(jsBridge.getAppData()).userLoginInfo).token
      },
    })
  },
  // 获取特需餐每日统计学生列表 
  getStudentStatistical(data) {
    return fetchPost('/garden/v1/teacher/ck/brand/clazz/special/student/clazz/daily/statistical', data,{
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }, true)
  },
  // 获取服务器时间戳（毫秒级）
	getServerTimestamp(data) {
		return fetchPost('/iam/v1/common/time', data);
	}
}
