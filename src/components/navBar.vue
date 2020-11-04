<template>
  <div class="nav-bar">
    <div class="school-info">
      <slot name="header">
        <img :src="userInfo && userInfo.avatarUrl || require('../assets/img/ic_school_logo.png') "/>
      <span>{{ userInfo && userInfo.orgName + userInfo.refName }}</span>
      </slot>
    </div>
    <div class="operation">
      <div class="user-login" v-if="teacherInfo">
        <div @click="clearLogin" class="user-logn-info">
          <img :src="teacherInfo && teacherInfo.avatarUrl || require('../assets/img/ic_user_default.png')"/>
          <span>{{ teacherInfo && teacherInfo.realName }}</span>
          <i></i>
        </div>
        <strong @click="exitTeacherLogin" v-show="isExit">退出登录</strong>
      </div>
      <img @click="jumpToSetting" src="../assets/img/set.png"/>
      <img  @click="isShowVolume = !isShowVolume" src="../assets/img/volume.png"/>
      <img @click="jumpToWifi" src="../assets/img/wifi.png"/>
      <div>
        <span>{{nowDate}}</span><br>
        <span>{{nowWeek}}</span>
      </div>
    </div>
    <img class="bar_bg" src="../assets/img/navbar_bg.png"/>
    <div v-if="isShowVolume" class="volume_control">
      <img src="../assets/img/volume_subtract_icon.png"/>
      <span ref="totalLenght">
        <van-slider v-model="volumeInt" bar-height="0.20rem" inactive-color="#4E6E96" active-color="#0BCFF1"  @change="setVolume">
           <template #button>
            <div class="custom-button">
            </div>
          </template>
        </van-slider>
      </span>
      <img src="../assets/img/volume_add_icon.png"/>
    </div>
    <div @click="isShowVolume=false" v-if="isShowVolume" class="shade-box"></div>
  </div>
</template>
<script>
import { Toast, Slider } from 'vant';
import jsBridge from '../utils/app-bridge.js';
import format from 'date-fns/format';
export default {
  data() {
    return {
      positionX: 0,
      isShowVolume:false,
      volumeInt: 0,
      nowDate:"" ,
      nowWeek:"",
      isExit: false,
      teacherInfo: '',
      userInfo: '',
      goCurrentPageFlag: false
    }
  },
  created() {
    this.$bus.on('timeOutExitLogin',this.exitTeacherLogin);
    this.$bus.on('goCurrentPage', this.goCurrentPage);// 不跳转到宣传视图登录返回当前页使用
  },
  beforeDestroy() {
  this.$bus.off('timeOutExitLogin', this.exitTeacherLogin);
  this.$bus.off('goCurrentPage', this.goCurrentPage);
},
  mounted() {
    localStorage.removeItem('jsBridgeInfo')
    this.userInfo = JSON.parse(jsBridge.getAppData());
    this.teacherInfo = JSON.parse(jsBridge.getAppData()).userLoginInfo && JSON.parse(JSON.parse(jsBridge.getAppData()).userLoginInfo);
    if(this.teacherInfo) {
      localStorage.setItem('teacherInfo', JSON.stringify(this.teacherInfo));
    }
    this.updateTime();
    this.timer = setInterval(this.updateTime, 1000);
    this.getVolume();
    window.clearLoginInfo = this.clearLoginInfo; // app调用h5退出登录
    window.loginSuccess = this.loginSuccess; // 获取登录信息
    window.secondLoginSuccess = this.secondLoginSuccess;
    window.nativeLoginSuccess = this.nativeLoginSuccess;
  },
  methods: {
    clearLogin() {
      this.isExit = !this.isExit;
    },
    exitTeacherLogin() {
      jsBridge.exitLogin();
      this.teacherInfo = '';
      this.isExit = false;
      localStorage.setItem('teacherInfo','')
      // var info = JSON.parse(localStorage.getItem('jsBridgeInfo'))
      // var appType = JSON.parse(info.appType)
      // if(appType){
      //   switch(appType.viewType){
      //     case 1:
      //       this.$router.push({ name: 'class-index', query: {  index: 0 }});
      //       break;
      //     case 2:
      //       this.$router.push({ name: 'interest-index', query: {  index: 0 }});
      //       break;
      //     case 3:
      //       this.$router.push({ name: 'cooking-food-index', query: {  index: 0 }});
      //       break;
      //   }
      // }else{
      //   this.$router.push({ name: 'class-index', query: {  index: 0 }});
      // }
      // this.$emit('exitHome')
    },
    updateTime(){
      this.getTime(); // 修改数据date
    },
    getTime(){
       let date= new Date();
       let weeks=['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
       let wk = date.getDay();
       let week = weeks[wk];
       this.nowDate = format(date,"u-MM-dd HH:mm:ss")
       this.$bus.emit('getNewDate', this.nowDate)
       this.nowWeek = week
    },
    nativeLoginSuccess(val) {
      localStorage.setItem('teacherInfo', val);
      this.teacherInfo = JSON.parse(val);
      this.$bus.emit('loginSuccess')
    },
    // 获取登录信息
    loginSuccess(val) {
      localStorage.setItem('teacherInfo', val);
      this.teacherInfo = JSON.parse(val);
      this.$bus.emit('loginSuccess');
      this.$bus.emit('goEditStudentDetail');// 查看学生详情
      if(!this.goCurrentPageFlag && !localStorage.getItem('goDetail')) {
        this.$emit('goPublicity')
      } else {
        this.goCurrentPageFlag = false;
      }
    },
    jumpToSetting() {
      jsBridge.jumpToSetting();
    },
    jumpToWifi() {
      jsBridge.jumpToWifi();
    },
    getVolume() {
      this.volumeInt = parseInt(100*(jsBridge.getVolume()/15));
    },
    setVolume(val) {
      jsBridge.setVolume(parseInt(15*(val/100)));
    },
    //  app调用h5退出登录
    clearLoginInfo() {
      this.teacherInfo = '';
      localStorage.setItem('teacherInfo', '');
      // this.$emit('exitHome');
      // this.$router.push({ name: 'class-index', query: {  index: 0 }})
    },
    secondLoginSuccess(val){
      localStorage.setItem('teacherInfo', val);
      this.teacherInfo = JSON.parse(val);
      this.$bus.emit('secondLoginSuc')
    },
    goCurrentPage() {
      console.log(this.$route.query,213)
      this.goCurrentPageFlag = true;
    }
  },
  beforeDestroy(){
    if (this.timer) {
      clearInterval(this.timer); // 在Vue实例销毁前，清除我们的定时器
    }
  }
}
</script>
<style lang="scss" scoped>
  .nav-bar {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 1.2rem;
    width: 100%;
    padding: 0 0.24rem;
    .school-info {
      display: flex;
      align-items: center;
      img {
        width:0.68rem;
        height:0.68rem;
        border-radius: 50%;
      }
      span {
        font-size:0.38rem;
        font-family:Helvetica;
        line-height:0.46rem;
        margin-left: 0.15rem;
      }
    }
    .operation {
      display: flex;
      align-items: center;
      .user-login{
        position: relative;
        height:.54rem;
        .user-logn-info {
          display: flex;
          justify-content: center;
          align-items: center;
          height:0.54rem;
          background:rgba(26,36,104,0.86);
          border-radius:.27rem;
          margin-right: .40rem;
          padding: 0 .30rem;
          img {
            width:.40rem;
            height:.40rem;
            border:.02rem solid rgba(255,255,255,1);
            border-radius: 50%;
            margin: 0;
          }
          span {
            font-size:.24rem;
            margin: 0 .08rem;
          }
          i {
            position: relative;
            top: .05rem;
            border:.08rem solid transparent;
            border-top-color: #fff;
          }
        }
        strong {
          position: absolute;
          bottom: -.70rem;
          display: flex;
          justify-content: center;
          align-items: center;
          width:2rem;
          height:.6rem;
          background:rgba(26,36,104,0.86);
          font-size:.24rem;
          font-weight: 400;
          z-index: 100;
          &::after {
            content: '';
            position: absolute;
            top: -0.16rem;
            right: 0.50rem;
            border:0.08rem solid transparent;
            border-bottom-color: rgba(26,36,104,0.86);
          }
        }
      }
      img {
        width:0.36rem;
        height:0.36rem;
        margin-right: 0.19rem;
      }
    }
    .bar_bg{
      position: absolute;
      height: 1.20rem;
      left: 50%;
      margin-left: -3.38rem;
    }
    .volume_control {
      position: fixed;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 9.80rem;
      height: 2.10rem;
      z-index: 1000;
      background: url('../assets/img/volume_bg.png') no-repeat;
      background-size: 9.80rem 2.10rem;
      img:nth-child(1) {
        width: 0.20rem;
        height: 0.30rem;
        margin: 0 0.40rem;
      }
      img:nth-child(3) {
        width: 0.37rem;
        height: 0.30rem;
        margin: 0 0.40rem;
      }
      span {
        position: relative;
        width:7.80rem;
        height:0.20rem;
        background:rgba(230,250,253,0.3);
        border-radius:0.11rem;
        .custom-button {
          width:0.40rem;
          height:0.40rem;
          background:rgba(11,207,241,1);
          border-radius: 50%;
        }
      }
    }
  .shade-box {
    position: fixed;
    top: 0;
    left: 0;
    width:19.20rem;
    height:10.80rem;
    background:rgba(0,0,0,0.6);
    z-index: 999
  }
  }
  >>>.van-slider {
    background: rgba(230,250,253,0.3) !important;
  }
</style>