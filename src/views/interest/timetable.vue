<template>
  <div class="timetable">
    <div class="timetable-left" v-if="habitRoom">
      <div class="class-info">
        <p>{{ habitRoom && habitRoom.roomName }}</p>
      </div>
      <div :style="{ backgroundImage: `url(${resourceVOList})` }" class="class-time">        
      </div>
    </div>
    <div class="timetable-right">
      <div class="detail" v-for="(item, index) in courseList" :key="index">
        <div class="week" :class="{ active_week_coloe: item.weeks == weekDay }"><strong>{{ item.week }}</strong><span> {{ weekES[index] }}</span></div>
        <!--  :class="{ afternoon: index == 1 }" -->
        <div class="timetable-detail" :class="{ active_week_info: item.weeks == weekDay }">
          <div
            v-for="(val, index) in item.courses"
            :key="index"
            class="time"
            :class="{ current_day_color: item.weeks == weekDay }"
            @click="viewDetail(val)"
          >
            <h4>{{ val.title }}</h4>
            <span class="attend-date">{{ parseTime( new Date(val.courseStartTime),'{h}:{i}') }}~{{ parseTime( new Date(val.courseEndTime),'{h}:{i}') }}</span><br/>
            <span class="time-date" :class="{ current_day_clazz: item.weeks == weekDay }">{{ val.clazz }}</span>
            <strong>
              <img :src="val.photo" />
              <i>{{ val.teacher }}</i>
            </strong>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../../api";
import jsBridge from "../../utils/app-bridge.js";
import { parseTime } from "../../utils/index";
import { Toast } from "vant";
export default {
  data() {
    return {
      userInfo: "",
      courseInfo: "",
      habitRoom: '',
      courseList: [],
      weekName: ["monday", "tuesday", "wednesday", "thursday", "friday","saturday", "sunday"],
      weekES: ["Mon", "Tue", "Wed", "Thur", "Fri","Sat", "Sun"],
      resourceVOList:''
    
    };
  },
  props: {
    list: Array,
    room: Object,
  },
  mounted() {
    this.userInfo = JSON.parse(jsBridge.getAppData());
    this.courseList= this.list
    this.getHabitRoom();
  },
  computed: {
    weekDay(){
      let weeks = ["sunday","monday", "tuesday", "wednesday", "thursday", "friday","saturday"]
      return weeks[new Date().getDay()]
    }
  },
  methods: {
    parseTime,
    // 获取教师详情
    getHabitRoom(){
      api.getHabitRoomDetail({ placeId: this.userInfo.refId }).then((res) => {
        this.habitRoom = res.data;
        this.resourceVOList = this.habitRoom.resourceVOList[0].compressUrl
      });
    },
    goToCourseDetail(id){
      // this.$router.push({ name: 'interest-exhibition', query: { id: id,room: this.room} })
    },
    viewDetail(val) {
      this.$router.push({ name: 'interest-detail', query: { id: val.id }, params: val })
    }
  },
  
};
</script>

<style lang="scss" scoped>
.timetable {
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 0 0.10rem 0.40rem;
  // .timetable-left {
  //   position: relative;
  //   width: 3.40rem;
  //   height: 8.68rem;
  //   box-sizing: border-box;
  //   background: #ffffff;
  //   border-radius: 0.24rem;
  //   overflow: hidden;
  //   img {
  //     width: 100%;
  //   }
  //   span {
  //     position: absolute;
  //     top: 2.48rem;
  //     left: 0;
  //     padding: 0 0.45rem;
  //     z-index: 100;
  //     font-size: 0.72rem;
  //     color: #021454;
  //   }
  // }
  .timetable-left {
    width: 3.40rem;
    height: 8.68rem;
    box-sizing: border-box;
    border-radius: 0.24rem;
    .class-info {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 3.40rem;
      height: 2.75rem;
      background: url('../../assets/img/kc_hds_leftbg.png') no-repeat 0 -0.17rem;
      background-size: 100% 1.6rem;
      background-color: rgba(7, 156, 184, 1);
      border-radius: 0.16rem;
      box-sizing: border-box;
      p {
        display: inline-block;
        width: 3rem;
        text-align: center;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 0.48rem;
        font-weight: 600;
        // text-overflow: -o-ellipsis-lastline;
        // overflow: hidden;
        // text-overflow: ellipsis;
        // display: -webkit-box;
        // -webkit-line-clamp: 2;
        // line-clamp: 2;
        // -webkit-box-orient: vertical;
      }
      .class-info-name {
        margin-top: 0.10rem;
        span {
          font-size: 0.24rem;
          font-weight: 600;
        }
      }
      .class-info-teacher {
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
        margin-top: 0.35rem;
        img {
            width: 0.40rem;
            height: 0.40rem;
            border: 0.02rem solid rgba(255, 255, 255, 1);
            border-radius: 50%;
        }
        span {
          width: 2rem;
          overflow: hidden;
          white-space: normal;
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
      // background: #021454;
      border-radius: 0.24rem;
      margin-top: 0.20rem;
      padding: 0.60rem 0.35rem;
      box-sizing: border-box;
      overflow: hidden;
      background-repeat: no-repeat;
      background-size:  auto 100% ;
      background-position: center top;
      img {
        position: absolute;
        bottom: 0;
        height: 100%;
        left: 0;
        top: 0;
        right: 0;
        margin: auto;
      }
    }
  }
  .timetable-right {
    display: flex;
    width: 15.40rem;
    height: 8.68rem;
    border-radius: 0.24rem;
    box-sizing: border-box;
    // background: rgba(255, 255, 255, 0.1);
    overflow: hidden;
    .detail {
      display: flex;
      flex-direction: column;
      width: 2.19rem;
      height: 100%;
      margin-right: 0.02rem;
      .week {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 2.19rem;
        height: 1.28rem;
        background: #544ad0;
        font-size: 0.36rem;
        font-weight: 600;
        span {
          margin-top: 0.05rem;
          font-size: 0.24rem;
          font-weight: 300;
        }
      }
      .active_week_coloe {
        background:#F77D04;
      }
      .timetable-detail {
        display: flex;
        flex-direction: column;
        // justify-content: space-around;
        height: 7.40rem;
        overflow: auto;
        background: rgba(255, 255, 255, 0.1);
      }
      .time {
        padding: 0.25rem 0 0.1rem 0.20rem;
        width: 2.19rem;
        color: #ffffff;;
        box-sizing: border-box;
        h4 {
          height: 0.38rem;
          font-size: 0.3rem;
          font-weight: 600;
          width: 1.8rem;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        span {
          display: inline-block;
          padding: 0.02rem 0.15rem ; 
          border-radius: 0.24rem;
          font-size:0.16rem;
          max-width: 1.8rem;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .attend-date {
          font-size: 0.18rem;
          padding: 0 0;
        }
        .time-date {
          position: relative;
          top: -0.03rem;
          background: rgba(255, 255, 255, 0.1);
          
        }
        .current_day_clazz {
          color: #ffffff;
          background: #F77D04;
        }
        strong {
          display: flex;
          align-items: center;
          // margin-top: 0.05rem;
          img {
            width: 0.40rem;
            height: 0.40rem;
            border: 0.02rem solid rgba(255, 255, 255, 1);
            border-radius: 50%;
          }
          i {
            margin-left: 0.10rem;
            font-size: 0.18rem;
            max-width: 1.2rem;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
      .current_day_color {
        color: #000;
      }
      .active_week_info {
          background:rgba(254,243,224,1);
        }
      .afternoon {
        background: rgba(11, 145, 188, 0.15);
      }
    }
  }
}
</style>