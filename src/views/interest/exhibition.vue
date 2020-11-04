<template>
  <div v-if="id"  class="exhibition">
    <div class="exhibition-left">
      <div v-if="courseDetailInfo" class="class-info">
        <p>{{courseDetailInfo.courseName}}</p>
        <div class="class-info-start-time">{{ parseTime( new Date(courseDetailInfo.courseStartTime),'{h}:{i}') }} - {{ parseTime( new Date(courseDetailInfo.courseEndTime),'{h}:{i}') }}</div>
        <div class="class-info-name">
          <img src="../../assets/img/banji_icon.png"/><span>{{courseDetailInfo.clazzVOList[0].clazzName}}</span>
        </div>
        <div class="class-info-teacher">
          <img :src="courseDetail.fileResourceDTO&&courseDetail.fileResourceDTO.thumbnailUrl	|| require('../../assets/img/ic_user_default.png')" />
          <span>{{courseDetailInfo.teacherName}}</span>
          <strong @click="schoolBegins( courseDetailInfo)" :class="{ courseStatus_start: courseDetailInfo.signFlag && courseDetailInfo.courseStatus != 3 }">{{ courseDetailInfo.courseStatus == 1 ? '签到' : '已签到' }}</strong>
          <!-- <span>{{courseDetail.teacherName}}</span>
          <strong @click="startCourse(courseDetail.courseStatus)" :class="{ courseStatus_start: courseDetail.courseStatus == 2 }">{{ courseStatus[parseInt(courseDetail.courseStatus)] }}</strong> -->
        </div>
      </div>
      <div :style="{ backgroundImage: `url(${resourceVOList})` }" v-if="room.hasOwnProperty('resourceVOList')" class="class-time">
        <!-- <img :src="room.resourceVOList[0].thumbnailUrl"/> -->
        <!-- <span>上课时间</span> -->
        <!-- <strong>{{ parseTime( new Date(courseDetailInfo.courseStartTime),'{h}:{i}') }} - {{ parseTime( new Date(courseDetailInfo.courseEndTime),'{h}:{i}') }}</strong> -->
      </div>
    </div>
    <div v-if="!isVideoFlag || !isOnLine" class="exhibition-right">
      <img v-if="!isVideoFlag && isOnLine" class="box-icon" src="../../assets/img/box_icon.png"/>
      <img v-else class="box-icon" src="../../assets/img/wfbfsp_icon.png"/>
      <span v-if="isOnLine">当前无课件信息</span>
      <span v-else>当前无网络</span>
    </div>
    <div v-if="isVideoFlag && isOnLine" class="exhibition-right">
      <van-video :goback="'goback-video'" v-if="contentType == 1" :resourcePackage="resourcePackage"/>
      <ppt-play  :goback="'goback-ppt'" v-if="contentType == 2" :info="resourcePackage"/>
    </div>
    <div v-if="shadeShow"
           class="popup-del-file">
        <span>是否确认开课</span>
        <div class="popup-del-file-btn">
          <span @click="startCourse(courseDetailInfo)">确认</span>
        </div>
      </div>
    <div v-if="shadeShow" @click="closeShade" class="shade-box"></div>
  </div>
  <div v-else  class="exhibition">
    <div class="exhibition-off">
      <img class="box-icon" src="../../assets/img/box_icon.png"/>
      <span>当前该活动室无课程安排</span>
    </div>
  </div>
</template>
<script>
import api from "../../api";
import jsBridge from "../../utils/app-bridge.js";
import { parseTime } from "../../utils/index";
import { Toast } from "vant";
import VanVideo from "../../components/BusinessComponent/video";
import PptPlay from "../../components/BusinessComponent/pptPlay";
export default {
  components: {
    PptPlay,
    VanVideo,
  },
  props: ['courseDetail', 'room', 'todayCourseList'],
  watch: {
    // userInfo: {
    //   handler(n,o){
    //     console.log('userinfo is ',n)
    //   }
    // }
  },
  data() {
    return {
      userInfo: JSON.parse(jsBridge.getAppData()),
      id: this.$route.query.id || this.courseDetail.id,
      contentType: '',
      courseResource: [],
      resourcePackage: [],
      contentType: 0,
      newDate: '',
      courseStatus:['签到', '签到', '签到', '已签到', '已签到'],
      isVideoFlag: true,
      courseDetailInfo: '',
      courseStartTime: this.courseDetail.courseStartTime || '',
      advanceCourseFlag: false,
      signFlag: false,
      resourceVOList: '',
      shadeShow: false,
      teacherInfo: '',
      isOnLine: true,
      timer: null
    };
  },
  mounted() {
    this.getMovieList(this.id);
    this.getCourseDetailInfo();
    this.getHabitRoom();
    this.$bus.on('getNewDate', (val)=> {
      this.newDate = val;
      if((new Date(this.newDate).getTime())+ 60*1000*5 > this.courseStartTime) {
        if(this.advanceCourseFlag) return;
        this.advanceCourseFlag = true;
        if(this.advanceCourseFlag) {
          this.getCourseDetailInfo();
        }
      }
    })
    this.resourceVOList = this.room.resourceVOList ? this.room.resourceVOList[0].url : '';
    this.timer = setInterval(()=> {
      if(window.navigator.onLine){
        this.isOnLine = true;
      } else {
        this.isOnLine = false;
      }
    }, 1000)
  },
  methods: {
    parseTime,
    // 确认开课
    schoolBegins(val) {
      console.log(val)
      if(val.courseBeginStatus == 1 && val.courseStatus == 1 &&  !this.courseDetailInfo.signFlag) {
        Toast('未到签到时间！');
        return
      }
      if(val.courseBeginStatus == 3  && val.courseStatus == 1) {
        Toast('签到时间超时！');
        return
      }
      if(val.courseStatus == 2) {
        Toast('已签到！');
        return
      }
      this.teacherInfo = JSON.parse(jsBridge.getAppData()).userLoginInfo && JSON.parse(JSON.parse(jsBridge.getAppData()).userLoginInfo);
      if(!this.teacherInfo) {
        this.$bus.emit('goCurrentPage')
        jsBridge.toLogin(`/#${ this.$route.path }`);
        return
      }
      if(!val.signFlag || val.courseStatus == 2) return;
      this.shadeShow = true;
    },
    closeShade() {
      this.shadeShow = false;
    },
    startCourse(val) {
      if(!val.signFlag || val.courseStatus ==3) return;
      api.startCourse({id: this.id,schoolId: this.userInfo.schoolId}).then(res=>{
        if(!this.id) return 
        this.getMovieList();
        this.getCourseDetailInfo();
        this.closeShade();
      }).catch(err => {
        Toast(err.message)
        this.getCourseDetailInfo();
        this.closeShade();
      })
    },
    getCourseDetailInfo() {
      if(!this.id) return; 
      api.getCourseDetailInfo({ id:this.id }).then((res) => {
        this.courseDetailInfo = res.data;
        this.courseStartTime = res.data.courseStartTime;
        
        
      });
    },
    // 获取教师详情
    getHabitRoom(){
      api.getHabitRoomDetail({ placeId: this.userInfo.refId }).then((res) => {
        this.resourceVOList =  res.data.resourceVOList[0].url
      });
    },
    getMovieList(id) {
      if(!id) return 
      api.getCourseDetailInfo({ id: this.id }).then((res) => {
        if(!res.data.videoVOList && !res.data.imgVOList ) {
          this.isVideoFlag = false;
          return
        }
         this.isVideoFlag = true;
        if(res.data.videoVOList.length > 0) {
          this.resourcePackage =  res.data.videoVOList.map(item => ({
            localPath: item.url
          }))
          this.contentType = 1;
        } else if(res.data.imgVOList.length > 0) {
          this.resourcePackage = { 
            imgUrlList: [...res.data.imgVOList.map(item => ({localPath: item.url}))], 
            timeInterval: parseInt(res.data.playInterval), 
            voiceUrlList: [...res.data.voiceVOList.map(item => ({localPath: item.url}))]  
          }
          this.contentType = 2;  
        }    
      });
    },
  },
  beforeDestroy() {
    this.$bus.off('getNewDate');
    clearInterval(this.timer)
    this.timer = null;
  }
};
</script>
<style lang="scss" scoped>

.exhibition {
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 0 0.10rem 0.40rem;
  .exhibition-left {
    width: 3.40rem;
    height: 8.68rem;
    box-sizing: border-box;
    border-radius: 0.24rem;
    .class-info {
      width: 3.40rem;
      height: 2.75rem;
      background: rgba(7, 156, 184, 1);
      border-radius: 0.16rem;
      box-sizing: border-box;
      padding: 0.30rem 0.35rem 0;
      background: url('../../assets/img/kc_hds_leftbg.png') no-repeat 0 -0.17rem;
      background-size: 100% 1.6rem;
      background-color: rgba(7, 156, 184, 1);
      border-radius: 0.16rem;
      p {
        width: 3rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 0.48rem;
        font-weight: 600;
        line-height: 0.67rem;
      }
      .class-info-start-time {
        font-size: 0.18rem;
        line-height: 0.25rem;
      }
      .class-info-name {
        display: flex;
        align-items: center;
        margin-top: 0.10rem;
        span {
          width: 2rem;
          font-size: 0.24rem;
          font-weight: 600;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        img {
          width: 0.32rem;
          height: 0.3rem;
          margin-right: 0.2rem;
        }
      }
      .class-info-teacher {
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
        margin-top: 0.20rem;
        img {
          width: 0.40rem;
          height: 0.40rem;
          border: 0.02rem solid rgba(255, 255, 255, 1);
          border-radius: 50%;
        }
        span {
          width: 1.5rem;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          font-size: 0.20rem;
          padding-left: .10rem;
        }
        strong {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 1.10rem;
          height: 0.38rem;
          border-radius: 0.19rem;
          background: rgba(255, 255, 255, 0.1);
          font-weight: 400;
        }
        .courseStatus_start {
          background: #FF9000;
        }
      }
    }
    .class-time {
      position: relative;
      display: flex;
      flex-direction: column;
      width: 3.40rem;
      height: 5.72rem;
      background: rgba(255, 255, 255, 1);
      border-radius: 0.24rem;
      margin-top: 0.20rem;
      padding: 0.60rem 0.35rem;
      box-sizing: border-box;
      overflow: hidden;
      background-repeat: no-repeat;
      background-size:  auto 100% ;
      background-position: center top;
      span {
        position: relative;
        z-index: 10;
        font-size: 0.28rem;
        color: rgba(2, 20, 84, 1);
      }
      strong {
        position: relative;
        z-index: 10;
        font-size: 0.36rem;
        font-weight: 600;
        color: rgba(2, 20, 84, 1);
        font-weight: 400;
        margin-top: 0.10rem;
      }
      img {
        position: absolute;
        bottom: 0;
        height: 100%;
        left: 0;
      }
    }
  }
  .exhibition-right {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 15.40rem;
    height: 8.68rem;
    border-radius: 0.24rem;
    box-sizing: border-box;
    overflow: hidden;
    background: #1A2468;
    .box-icon {
      width: 1rem;
      height: 0.87rem;
    }
    span {
      font-size: 0.40rem;
      font-weight:500;
      color:rgba(105,113,156,1);
    }
  }
  .popup-del-file {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 6.00rem;
    height: 3.00rem;
    background: url("../../assets/img/del_file_bg.png") no-repeat;
    background-size: 100%;
    z-index: 1009;
    span {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 0.32rem;
      margin-top: 0.16rem;
      img {
        width: 0.40rem;
        height: 0.40rem;
        margin: 0 0.05rem;
      }
    }
    .popup-del-file-btn {
      display: flex;
      justify-content: space-around;
      width: 100%;
      margin-top: 0.45rem;
      span {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        width:3rem;
        height:0.70rem;
        background:rgba(2,20,84,1);
        border-radius:0.55rem;
        img {
          width: 0.60rem;
          height: 0.60rem;
        }
        i {
          font-size: 0.24rem;
          font-weight: 400;
          color: #0BCFF1;
        }
      }
    }
  }
  
  .shade-box {
    position: absolute;
    top: 0;
    left: 0;
    width: 19.20rem;
    height: 10.80rem;
    background: rgba(0, 0, 0, 0.6);
    z-index: 1000;
  }
}
.exhibition-off {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 8.68rem;
  border-radius: 0.14rem;
  background: #1A2468;
   .box-icon {
      width: 1rem;
      height: 0.87rem;
    }
    span {
      font-size: 0.40rem;
      font-weight:500;
      color:rgba(105,113,156,1);
    }
}
</style>