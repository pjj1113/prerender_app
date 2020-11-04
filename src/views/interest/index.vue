<template>
<!-- 6. 添加全局样式 -->
  <div class="clazz">
    <nav-bar @goPublicity="goPublicity" @exitHome="exitHome"/>
    <van-swipe class="my-swipe" ref="swipe" @change="page" indicator-color="white">
      <van-swipe-item><time-table v-if="pageIndex == 0" :list="courseList" :course="curCourseInfo" :room="habitRoom"/></van-swipe-item>
      <van-swipe-item><exhibition v-if="pageIndex == 1" :todayCourseList="todayCourseList" :courseDetail="courseDetail" :userInfo="userInfo" :room="habitRoom"/></van-swipe-item>
      <van-swipe-item><Publicity v-if="pageIndex == 2"/></van-swipe-item>
      <!-- <van-swipe-item><sign :course="curCourseInfo" :room="habitRoom"/></van-swipe-item>  -->
    </van-swipe>
    <div v-if="shadeShow"
           class="popup-del-file">
        <span>请点击<img src="../../assets/img/flag_icon_sm.png"/> 退出？</span>
        <div class="popup-del-file-btn">
          <span @click="exitShow">
            <img src="../../assets/img/flag_icon_big.png"/>
            <i>{{ timerNum }}S</i>
          </span>
        </div>
      </div>
    <div v-if="shadeShow" @click="closeShade" class="shade-box"></div>
  </div>
</template>
<script>
import NavBar from '../../components/navBar';
import TimeTable from './timetable';
import Exhibition from './exhibition';
import Publicity from '../publicity/player'
import Sign from './sign';
import api from "../../api";
import jsBridge from "../../utils/app-bridge.js";
import { parseTime } from "../../utils/index";
import { Toast } from "vant";
export default {
  data() {
    return {
      pageIndex: 0,
      curHabitRoom: '',
      curCourseInfo: {},
      todayCourseList: '',
      timer: '',
      courseList: [],
      habitRoom: {},
      courseDetail: {},
      userInfo: '',
      shadeShow: false,
      timerNum: 15,
    }
  },
  components: {
    NavBar,
    TimeTable,
    Exhibition,
    Sign,
    Publicity
  },
   watch: {
    shadeShow(val) {
      if(val == false) {
        clearInterval(this.timer)
        this.timerNum = 15;
        this.shadeShow = false;
        this.timer = ''
      }
    },
    pageIndex(val) {
      val == 0 && this.getCourseInfo()
      val == 0 && this.getHabitRoom();
    }
  },
  computed: {
    
  },
  mounted() {
    this.userInfo = JSON.parse(jsBridge.getAppData());
    this.getCourseInfo()
    this.getHabitRoom();
    this.$route.query.index ?  this.$refs.swipe.swipeTo(parseInt(this.$route.query.index)) : '';
  },
  methods: {
    getMovieList(id) {
      api.getCourseDetailInfo({ id: id }).then((res) => {
        this.courseDetail = res.data;
      });
    },
    check() {
      var curTime = new Date().getTime();
      var tempCourse = '';
      if(this.todayCourseList){
        this.todayCourseList.forEach(element => {
          if(curTime>element.courseStartTime&&curTime<element.courseEndTime){
            if(this.curCourseInfo && this.curCourseInfo.id!=element.id){
              this.curCourseInfo = element;
              this.getMovieList(this.curCourseInfo.id)
            }
          }
        });
      }
    },
    getCourseInfo() {
      this.courseList.splice(0, this.courseList.length)
      let wk = new Date().getDay() == 0 ? 7 : new Date().getDay();
      console.log(wk)
      api.getCourseInfo({ schoolId: this.userInfo.schoolId, placeRoomId: this.userInfo.refId}).then((res) => {
        var weeks = ["monday", "tuesday", "wednesday", "thursday", "friday","saturday", "sunday"];
        var weeksCn = [ "周一",  "周二", "周三", "周四", "周五", "周六","周日"];
        for (let i = 0; i < 7; i++) {
          var courses = [];
          if (res.data[weeks[i]]) {
            res.data[weeks[i]].map((item) => {
              let obj = {
                id: item.id,
                title: item.courseName,
                clazz: item.clazzVOList[0].clazzName,
                courseStartTime: item.courseStartTime,
                courseEndTime: item.courseEndTime,
                courseStatus: item.courseStatus,
                teacher: item.teacherName,
                placeRoomName: item.placeRoomName,
                photo: item.avatarImgInfo
                  ? item.avatarImgInfo.thumbnailUrl
                  : require("../../assets/img/ic_user_default.png"),
              };
              courses.push(obj);
            });
            courses.sort(function (a, b) {
              return a.courseStartTime - b.courseStartTime;
            });
          }
          if(i==(wk-1)){
            this.todayCourseList = courses;
          }
          let everyDayCourse = {
            weeks: weeks[i],
            week: weeksCn[i],
            courses: courses,
          };
          this.courseList.push(everyDayCourse);   
        }
        this.getCourseNext()
      });
      // this.getMovieList('261751907570425862')
    },
    // 获取当前课的信息或下一节课
    getCourseNext() {
      let curTime = new Date().getTime();
      // if(this.todayCourseList.length == 0) {
      //   let curDate = new Date().getDay() -2
      //   for( curDate; curDate>=0; curDate-- ) {
      //     if(this.courseList[curDate].courses.length > 0) {
      //       this.getMovieList(this.courseList[curDate].courses[this.courseList[curDate].courses.length-1].id)
      //       return
      //     }
      //   }
      // }
      this.todayCourseList.forEach(val => {
        if(val.courseStartTime > curTime || val.courseEndTime > curTime) {
          this.getMovieList(val.id)
          return;
        }
      })
    },
    // 关闭跳出宣传视图提示
    closeShade() {
      this.shadeShow = false;
    },
    // 退出宣传视图
    exitShow() {
      this.shadeShow = false;
       this.pageIndex = 1;
      this.$refs.swipe.swipeTo(1);
    },
    page(val) {
      if(this.pageIndex == 2&&val==1) {
        this.$refs.swipe.swipeTo(2);
         jsBridge.toSecondLogin();
          return;
      }
      
      if(this.$route.query.play){
        this.pageIndex = 2;
        this.$delete(this.$route.query, 'play')
        this.$router.push({  name: 'interest-index', query: { ...this.$route.query}})
        return;
      }
      if(this.$route.query.id){
        this.pageIndex = val;
        this.$router.push({  name: 'interest-index', query: { index: val } })
        return;
      }
      if(this.pageIndex == 0 && val == 2 && this.shadeShow == false) {
        this.$refs.swipe.swipeTo(0);
        return;
      }
      if(val == 2&&this.pageIndex==1) {
        if(!JSON.parse(jsBridge.getAppData()).userLoginInfo) {
          this.$refs.swipe.swipeTo(1);
          jsBridge.toLogin(`/#${ this.$route.path }?index=2`);
          return;
        } else {
        }
      }
      if(this.pageIndex==2&&val==0){
        this.$refs.swipe.swipeTo(2);
        return;
      }
     
      this.pageIndex = val
      this.$router.push({  name: 'interest-index', query: { index: val } })
      if(JSON.stringify(this.curCourseInfo) === '{}' ){
          //  this.$refs.swipe.swipeTo(0);
        // return;
      }else{
      }
    },
    goPublicity() {
      if(JSON.parse(jsBridge.getAppData()).userLoginInfo) {
        this.pageIndex = 2;
        this.$refs.swipe.swipeTo(2);
        this.$router.push({  name: 'interest-index', query: { index: 2 } })
      } 
    },
    getHabitRoom(){
      api.getHabitRoomDetail({ placeId: this.userInfo.refId }).then((res) => {
        this.habitRoom = res.data;
        console.log("cur room is ",this.habitRoom)
      });
    },
    // 用户退出
    exitHome() {
      this.shadeShow = false;
      this.pageIndex = 0;
      this.$refs.swipe.swipeTo(0);
    },
    secondLoginSuccess() {
      this.shadeShow = true;
      this.timer = setInterval(()=>{
          this.timerNum = this.timerNum-1
          if(this.timerNum<0) {
            clearInterval(this.timer)
            this.timerNum = 15;
            this.shadeShow = false;
            this.timer = ''
          }
        },1000)
    }
  },
  created() {
    this.$bus.on('secondLoginSuc', this.secondLoginSuccess)
  },
  beforeDestroy() {
    this.$bus.off('secondLoginSuc', this.secondLoginSuccess);
    clearInterval(this.timer)
  }
}
</script>
<style lang="scss" scoped>
.clazz{
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
.van-swipe {
  flex: 1;
  padding: 0 0px 30px;
  overflow: hidden;
}
</style>