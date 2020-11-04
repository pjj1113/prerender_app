<template>
  <div class="ditals">
    <div class="ditals-left">
      <div class="teacher">
        <h3  @click="jumpToSetting">{{ teacherList && teacherList.clazzName }}</h3>
        <ul>
          <li v-for="(item, index) in teacherList.optionTeacherDTOList" :key="index">
            <img :src="item.fileResourceDTO ? item.fileResourceDTO.url: avatarImg"/>
            <div>
              <strong>{{ item.name }}</strong>
              <span>{{ item.jobName }}</span>
            </div>
          </li>
        </ul>
      </div>
      <div class="weather">
        <div class="weather-top">
          <img src="../../assets/img/weather_bg.png"/>
          <div class="weather-top-left"><strong>{{ weatherInfo && weatherInfo.temperature }}</strong><span>℃</span></div>
          <div class="weather-top-right">{{ weatherInfo && weatherInfo.weather }}</div>
        </div>
        <div class="weather-bottom">
          <div>
            <i>
              <strong>{{ weatherInfo && weatherInfo.coldIndex }}</strong>
              <span>感冒指数</span>
            </i>
            <i>
              <strong>{{ weatherInfo && weatherInfo.ultravioletIndex }}</strong>
              <span>紫外线</span>
            </i>
          </div>
          <div>
             <i>
              <strong>{{ weatherInfo && weatherInfo.airQuality }}</strong>
              <span>空气质量</span>
            </i>
            <i>
              <strong>{{ weatherInfo && weatherInfo.dressIndex }}</strong>
              <span>适合穿着</span>
            </i>
          </div>
        </div>
      </div>
    </div>
    <div v-if="planFlag" class="ditals-conter">
      <div class="ditals-conter-info">
        <h2>今日安排</h2>
        <div class="conter-box">
          <div v-show="scrollFlag" class="scroll">
            <span ref="scrollComp"></span>
          </div>
          <div  ref="list" @scroll.passive="getScroll($event)" class="conter-box-detail">
            <div class="conter-info" :class="{ 'conter-info-onLine': index != (planDetail.length-1) }" v-for="(item, index) in planDetail" :key="index">
            <!-- <div class="conter-info" :class="{ info_am: index === 0, info_pm: index===1||index===2 }" v-for="(item, index) in list" :key="index"> -->
              <div class="info-title">{{ item.noon }}</div>
              <ul class="info-list">
                <li  v-for="(val, j) in item.keyList" :key="j">
                  <span><i>{{ val.contentKey  }}：</i><b v-html="filterHtml(val.contentValue)"> </b></span>
                  <strong v-if=" val.address">{{ val.address }}</strong>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="ditals-conter-off">
      <div class="plan-no">
        <img src="../../assets/img/jxjh_off_icon.png"/>
        <h3>今日无教学计划信息</h3>
        <p>若需展示教学计划信息，请在<span>【园所后台-教务管理-教学计划】</span>中增加表格类型的教学计划</p>
      </div>
    </div>
    <div class="ditals-right">
      <div class="punch-card">
        <div class="punch-card-pie">
          <van-circle
          ref="circle"
            v-model="currentRate"
            :rate="rate"
            layer-color="#619bd9"
            color="#3ED3B4"
             size="1.52rem"
            >
            <slot slot="default">
              <div class="punch-card-pie-content">
                <div class="punch-card-pie-content-top"> 
                  <strong>{{ leaveInfo && leaveInfo.signCardTotal || 0 }}</strong>
                  <span>/{{ leaveInfo && leaveInfo.clazzStudentTotal || 0 }}</span>
                </div>
                <div class="punch-card-pie-content-bottom">打卡人数</div>
              </div>
            </slot>
            </van-circle>
        </div>
        <div class="punch-card-detail">
          <div>
            <span>
              <b>今日病假人数</b>
              <strong>{{ leaveInfo.sickLeaveTotal && leaveInfo.sickLeaveTotal || 0 }}<em>人</em></strong>
            </span>
            <i><b :style="sickLeaveWidth" ref="sickLeave"></b></i>
          </div>
          <div class="casual-leave">
            <span>
              <b>今日事假人数</b>
              <strong>{{ leaveInfo.casualLeaveTotal && leaveInfo.casualLeaveTotal || 0 }}<em>人</em></strong>
            </span>
            <i><b :style="casualLeaveWidth" ref="casualLeave"></b></i>
          </div>
        </div>
      </div>
      <div class="check">
        <div class="check-num">
          <p>
            <strong>{{ healthInspectInfoData && healthInspectInfoData.healthInspectTotal || 0 }}</strong>
            <span>晨检人数</span>
          </p>
        </div>
        <div class="check-man">
          <div>
            <span>{{  healthInspectInfoData && healthInspectInfoData.observeTotal || 0 }}</span>
            <strong>重点观察人数</strong>
          </div>
          <div>
            <span>{{ healthInspectInfoData && healthInspectInfoData.sickTotal || 0 }}</span>
            <strong>因病离园人数</strong>
          </div>
        </div>
        <div class="check-statistics">
          <span>高温<strong>{{ healthInspect && healthInspect.fever || 0 }}</strong></span>
          <span>咳嗽<strong>{{ healthInspect && healthInspect.cough || 0 }}</strong></span>
          <span>口腔异常<strong>{{ healthInspect && healthInspect.oral || 0 }}</strong></span>
          <span>情绪不佳<strong>{{ healthInspect && healthInspect.spirit || 0 }}</strong></span>
          <span>眼部异常<strong>{{ healthInspect && healthInspect.eye || 0 }}</strong></span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from '../../api';
import { getClientInfo } from '../../utils/footprint';
import jsBridge from '../../utils/app-bridge.js';
import { parseTime } from '../../utils/index';
export default {
  data() {
    return {
      userInfo: '',
      weatherInfo: '',
      teacherList: '',
      currentRate: 0,
      rate: 0,
      leaveInfo: '',
      casualLeaveWidth: { width: '0rem' },
      sickLeaveWidth: { width: '0rem' },
      healthInspect: '',
      healthInspectInfoData: '',
      planDetail: [],
      planFlag: false,
      avatarImg: require('../../assets/img/avatar.png'),
      list:[],
      scrollFlag: false
    }
  },
  async mounted() {
    this.$refs.circle.$el.children[0].children[0].style.strokeWidth = '0.20rem'
    this.userInfo = JSON.parse(jsBridge.getAppData())
    this.getWeatherInfo();
    this.clazzAndTeacherInfo();
    this.signAndLeaveInfo();
    this.healthInspectExceptionInfo();
    this.getTeacherPlantDay();
  },
  methods: {
    jumpToSetting() {
      Toast('设置')
      jsBridge.jumpToSetting();
    },
    // 获取天气
    getWeatherInfo() {
      api.getWeatherInfo({ date: parseTime(new Date(), '{y}-{m}-{d}'), schoolId: this.userInfo.schoolId }).then(res => {
        this.weatherInfo = res.data;
      })
    },
    // 获取教师列表
    clazzAndTeacherInfo() {
      api.clazzAndTeacherInfo({ orgId: this.userInfo.orgId, clazzId: this.userInfo.refId }).then(res => {
        this.teacherList = res.data;
      })
    },
    // 按班级请假
    signAndLeaveInfo() {
      api.signAndLeaveInfo({ schoolId: this.userInfo.schoolId, clazzId:  this.userInfo.refId, day: parseTime(new Date(), '{y}-{m}-{d}') }).then(res => {
        this.leaveInfo = res.data;
        this.rate = this.leaveInfo.clazzStudentTotal ? parseInt((this.leaveInfo.signCardTotal /this.leaveInfo.clazzStudentTotal)*100) : 0
        try {
          this.casualLeaveWidth.width = parseInt(this.$refs.casualLeave.parentElement.offsetWidth * (this.leaveInfo.casualLeaveTotal / (this.leaveInfo.clazzStudentTotal))) + 'px';
          this.sickLeaveWidth.width = parseInt(this.$refs.sickLeave.parentElement.offsetWidth * (this.leaveInfo.sickLeaveTotal / this.leaveInfo.clazzStudentTotal)) + 'px';
        } catch (error) {
          
        }
      })
    },
    // 班级维度统计异常信息
    healthInspectExceptionInfo() {
      api.healthInspectExceptionInfo({ schoolId: this.userInfo.schoolId, clazzId:  this.userInfo.refId, day: parseTime(new Date(), '{y}-{m}-{d}') }).then(res => {
        this.healthInspect = res.data.tagMap;
        this.healthInspectInfoData = res.data;
      })
    },
    getScroll (event) {
      if(!this.scrollFlag) return;
      let scrollAll = 7.2 - this.$refs.scrollComp.style.height.split('rem')[0];
      this.$refs.scrollComp.style.top = scrollAll / ((event.target.scrollHeight - event.target.clientHeight) / event.target.scrollTop) + 'rem';

    },
    // 获取今日计划
    getTeacherPlantDay() {
      api.getTeacherPlantDay({ clazzId:  this.userInfo.refId, day: parseTime(new Date(), '{y}-{m}-{d}') }).then(res => {
        if(res.data.teachPlanDailyDetailDTOList) {
            let dataOnse = res.data.teachPlanDailyDetailDTOList;
            let count = 0
            dataOnse.forEach((item, index) => {
              if(!this.planDetail.some(val => val.noon == item.noon)){
                this.planDetail.push({ noon: item.noon, keyList: [] })
                this.planDetail[this.planDetail.length-1].keyList.push(item)
              } else {
                this.planDetail[this.planDetail.length-1].keyList.push(item)
              }
            })
            this.planFlag = true;
          }
          if(this.planFlag) {
            this.$nextTick(()=> {
            if(this.$refs.list.scrollHeight > this.$refs.list.clientHeight) {
              this.scrollFlag = true
              this.$refs.scrollComp.style.height = 6.2*(7.9/((this.$refs.list.scrollHeight*1.4)/100)) +'rem'
            } else {
              this.scrollFlag = false
            }
          })
          }
      })
    },
    filterHtml(str) {
      var re = /<[^>]+>/gi;
      str = str.replace(re, '');
      return str;
    }
    // 重点观察 因病离园
    // healthInspectStudentList() {
    //   api.healthInspectStudentList({ schoolId: this.userInfo.schoolId, clazzId:  this.userInfo.refId, day: parseTime(new Date(), '{y}-{m}-{d}')
    // }).then(res => {
    //   this.emphasisTotal = res.data;
    // })
    // },
    // 班级维度统计异常晨检信息 
    // healthInspectInfo() {
    //   api.healthInspectInfo( { schoolId: this.userInfo.schoolId, clazzId:  this.userInfo.refId, day: parseTime(new Date(), '{y}-{m}-{d}')} ).then(res => {
    //     this.healthInspectInfoData = res.data;
    //   })
    // }
  }
}
</script>
<style lang="scss" scoped>
.ditals {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  padding: 0 0.10rem 0.40rem;
  overflow: hidden;
  .ditals-left {
    height: 100%;
    width:3.80rem;
    border-radius:0.24rem;
    .teacher {
      display: flex;
      flex-direction: column;
      align-items: center;
      width:3.80rem;
      height:5.73rem;
      border-radius: 0.24rem;
      background: url('../../assets/img/teacher_bg.png') no-repeat 0 -0.10rem;
      background-size: 100%;
      background-color: #544ad0;
      overflow: hidden;
      h3 {
        height: 0.50rem;
        font-size: 0.32rem;
        font-weight:500;
        line-height: 0.45rem;
        margin-top: 0.60rem;;
      }
      ul {
        margin-top: 0.25rem;
        overflow: auto;
        &::-webkit-scrollbar {
          display: none;
        }
        li {
          display: flex;
          align-items: center;
          width:3.30rem;
          height:1.20rem;
          padding: 0.10rem 0.15rem;
          background: #655cd4;
          margin-bottom: 0.20rem;
          border-radius: 0.15rem;
          img{
            width:0.88rem;
            height:0.88rem;
            border:0.03rem solid rgba(255,255,255,1);
            border-radius: 50%;
          }
          div{
            display: flex;
            flex-direction: column;
            margin-left: 0.20rem;
            strong {
              font-size:0.30rem;
              font-family:PingFangSC-Medium,PingFang SC;
              font-weight:500;
            }
            span {
              font-size:0.21rem;
              font-family:PingFangSC-Regular,PingFang SC;
              font-weight:400;
              line-height: 0.29rem;
            }
          }
        }
      }
    }
    .weather {
      position: relative;
      width: 100%;
      height: 2.80rem;
      border-radius:0.24rem;
      margin-top: 0.10rem;
      background: #0B91BC;
      overflow: hidden;
      .weather-top {
        display: flex;
        justify-content: space-around;
        align-items: center;;
        height: 1.14rem;
        width: 100%;
        background: #0B91BC;
        img {
          position: absolute;
          left: 0;
          top: 0;
          width: 3.80rem;
          height: 1.05rem;
        }
        .weather-top-left {
          strong {
            font-weight: 400;
            font-size:0.72rem;
          }
          span {
            font-size:.24rem;
          }
        }
        .weather-top-right {
          font-size: 0.24rem;
        }
      }
      .weather-bottom {
        display: flex;
        justify-content: space-around;
        align-items: center;
        widows: 100%;
        height: 1.72rem;
        background: #0CA8BC;
        div {
          display: flex;
          flex-direction: column;
          i {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 0.10rem;
            strong {
              font-size: 0.23rem;
              font-weight:600;
              line-height: 0.33rem;
            }
            span {
              font-size: 0.14rem;
              line-height:0.20rem;
            }
          }
        }
      }
    }
  }
  .ditals-conter-off {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    padding: 0 0.20rem 0.20rem;
    flex: 1;
    .plan-no {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      background:rgba(26,36,104,0.86);
      border-radius: 0.24rem;
      img {
        width: 1.45rem;
        height: 1.20rem;
      }
      h3 {
        font-size:0,40rem;
        font-weight:500;
        color:rgba(105,113,156,1);
        line-height:0.56rem;
        margin-top: 0.15rem;
      }
      p {
        margin-top: 0.15rem;
        font-size:0.24rem;
        font-weight:500;
        color:rgba(105,113,156,1);
        line-height:0.33rem;
        span {
          color:rgba(250,243,145,1);
        }
      }
    }
  }
  .ditals-conter {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    flex: 1;
    padding: 0 0.2rem 0.2rem;
    .ditals-conter-info{
      background: #554BD1;
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
      width: 100%;     
      border-radius: 0.24rem;
      overflow: hidden;
      padding: 0 .20rem .20rem .20rem;
      // &::after {
      // content: '';
      //   position: absolute;
      //   left: 0.2rem;
      //   top: 0;
      //   width: 1.40rem;
      //   height: ceil($number: 100% - 3);
      //   background: #473DC4;
      //   border-radius: 0.24rem 0 0 0.24rem ;
      //   z-index: 0;
      // }
    }
    h2 {
      font-size:0.40rem;
      font-weight:500;
      padding-top: 0.3rem;
      height: 1rem;
    }
    .conter-box {
      position: relative;
      display: flex;
      flex-direction: column;
      align-content: flex-start;
      width: 100%;
      max-height: 7.9rem;
      // margin-top: 0.20rem; 
      overflow: hidden;
      border-radius: 0.24rem;
      background:rgb(77, 67, 202);
      .conter-box-detail {
        display: flex;
        flex-direction: column;
        width: 100%;
        // height: 7.9rem;
        // margin-top: 0.20rem; 
        overflow: auto;
      }
      .scroll {
        position: absolute;
        top: 0.2rem;
        right: 0.12rem;
        width: 0.10rem;
        height: 7.20rem;
        background: #473DC4;
        border-radius: 0.05rem;
        span {
          position: absolute;
          top: 0;
          left: 0;
          width: 0.10rem;
          height: 1.20rem;
          background: #0bcff1;
          border-radius: 0.05rem;
        }
      }
    }
    .conter-info-onLine {
        position: relative;
        width: 100%;
        height: 100%;
        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0.2rem;
          width: 93%;
          height: 0.03rem;
          border-radius: 0.02rem;
          background: #3D33BD;
          z-index: 30;
        }
      }
    .conter-info{
      position: relative;
      display: flex;
      // margin:0 0.20rem 0.20rem;
      .info-title {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        width: 1.40rem;
        // border-radius: 0.24rem;
        // margin-right: 0.20rem;
        font-size:0.26rem;
        line-height:0.37rem;
        box-sizing: border-box;
        padding: 0 0.1rem;
        background: #473DC4;
        z-index: 10;
      }
      .info-list {
        display: flex;
        flex-direction: column;
        flex: 1;
        padding: 0.20rem 0.20rem 0.30rem ;
        border-radius: 0.24rem;
        li {
          display: block;
          padding: 0.15rem 0.3rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size:0.28rem;
          line-height:0.40rem;
          span {
            margin-left: 0.20rem;
            flex: 1;
            b {
              font-weight: 400;
            }
          }
          strong {
            display: inline-block;
            height: 0.50rem;
            font-weight: 400;
            padding: 0 0.3rem;
            background:rgba(203,201,213,0.1);
            font-size: 0.28rem;
            border-radius: 0.25rem;
            line-height: 0.5rem;
            margin-left: 0.1rem;
          }
        }
      }
    }
    .info_am {
      height:3.50rem;
    }
    .info_pm {
      height:2.02rem;
    }
  }
  .ditals-right {
    width:3.80rem;
    height: 100%;
    .punch-card {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      width:3.80rem;
      height:4.24rem;
      background:rgba(3,109,217,0.84);
      border-radius:0.24rem;
      .punch-card-pie {
        margin-top: 0.35rem;
        .punch-card-pie-content {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .punch-card-pie-content-top {
            strong {
              font-size:0.60rem;
              font-weight: 400;
            }
            span {
              font-size:0.18rem;
            }
          }
          .punch-card-pie-content-bottom {
            position: relative;
            top: -0.08rem;
            font-size:0.18rem;
          }
        }
      }
      .punch-card-detail {
        div {
          display: flex;
          flex-direction: column;
          margin-bottom: 0.30rem;
          span {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.10rem;
            width:2.61rem;
            b {
              font-size:0.18rem;
              font-weight: 400;
            }
            strong {
              font-size:0.24rem;
              font-weight: 400;
              em {
                font-size: 0.18rem;
                font-style: normal;
              }
            }
          }
          i {
            position: relative;
            display: inline-block;
            width:2.61rem;
            height:0.10rem;
            background:rgba(235,235,235,0.08);
            border-radius:0.08rem;
            font-style: normal;
            b {
              position: absolute;
              left: 0;
              top: 0;
              display: inline-block;
              width: 0.10rem;
              background: #FFA729;
              height:0.10rem;
              border-radius:0.008rem;
            }
          }
        }
        .casual-leave {
          i {
            b {
              background: #2F8CFF;
            }
          }
        }
      }
    }
    .check {
      display: flex;
      flex-direction: column;
      margin-top: 0.20rem;
      width:3.80rem;
      height:4.24rem;
      background:rgba(11,145,188,1);
      border-radius:0.24rem;
      .check-num {
        height: 1.55rem;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 0.32rem;
        p {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width:1.52rem;
          height:1.52rem;
          opacity:0.92;
          border:0.02rem solid rgba(255,255,255,0.5);
          border-radius: 50%;
          strong {
            font-size:0.55rem;
            font-weight: 400;
          }
          span {
            position: relative;
            font-size:0.18rem;
            top: -0.08rem;
          }

        }
      }
      .check-man {
        display: flex;
        justify-content: space-around;
        div {
          display: flex;
          flex-direction: column;
          align-items: center;
          span {
            font-size:0.36rem;
            font-weight:600;
            color:rgba(250,243,145,1);
          }
          strong {
            margin-top: 0.05rem;
            font-size:0.18rem;
            font-weight: 400;
          }
        }
      }
      .check-statistics {
        display: flex;
        flex-wrap: wrap;
        box-sizing: border-box;
        padding: 0.2rem 0.20rem;
        span {
          display: inline-block;
          font-size:0.14rem;
          padding:0.10rem 0.21rem;
          margin-right: 0.20rem;
          background:rgba(255,255,255,0.1);
          border-radius:0.20rem;
          margin-bottom: 0.20rem;
          strong {
            padding-left: 0.05rem;
            font-weight: 400;
            line-height:0.20rem;
          }
        }
      }
    }
  }
}
>>>.van-circle__hover {
  stroke-width: 0.20rem !important;
}
</style>