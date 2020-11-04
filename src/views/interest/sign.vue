<template>
  <div class="sign">
    <div class="sign-left">
      <div class="class-info">
        <p>{{course.title}}</p>
        <div class="class-info-name">
          <img/>
          <span>{{room.roomName}}</span>
        </div>
        <div class="class-info-teacher">
          <!-- <img/> -->
          <span>{{course.teacher}}</span>
          <strong>已签到</strong>
        </div>
      </div>
      <div class="class-time">
        <span>上课时间</span>
        <strong>{{ parseTime( new Date(course.courseStartTime),'{h}:{i}') }} - {{ parseTime( new Date(course.courseEndTime),'{h}:{i}') }}</strong>
      </div>
    </div>
    <div class="sign-right">
      <div class="btn">
        <span>签到</span>
      </div>
      <div class="content">
        <div class="scroll">
          <span ref="scrollComp"></span>
        </div>
        <ul  @scroll.passive="getScroll($event)" ref="list">
          <li v-for="(item, index) in list" :key="index">
            <img :src="item.avatarShowImg || require('../../assets/img/avatar_girl.png')"/>
            <span>{{ item.childName }}</span>
          </li>
      </ul>
      </div>
    </div>
  </div>
</template>
<script>
import api from '../../api';
import jsBridge from '../../utils/app-bridge.js';
import { parseTime } from '../../utils/index';
import { Toast } from 'vant';
export default {
  data() {
    return {
      list: [],
      isScroll: false,
    }
  },
  props: {
    course: Object,
    room: Object
  },
  mounted() {
    api.getStudentList({courseId: "255923353524203526"}).then(res=>{
      this.list = res.data;
    })
  },
  methods: {
    parseTime,
    getScroll(event) {
      // let scrollBottom = event.target.scrollHeight - event.target.scrollTop - event.target.clientHeight;
      let scrollAll  = this.$refs.scrollComp.parentElement.offsetHeight - this.$refs.scrollComp.offsetHeight;
      this.$refs.scrollComp.style.top = scrollAll / ((event.target.scrollHeight-event.target.clientHeight)/event.target.scrollTop) + 'px';
    }
  }
}
</script>
<style lang="scss" scoped>
.sign {
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 0 0.10rem 0.40rem;
  .sign-left {
    width: 3.40rem;
    height: 8.68rem;
    box-sizing: border-box;
    border-radius: 0.24rem;
    .class-info {
      width:3.40rem;
      height:2.75rem;
      background:rgba(7,156,184,1);
      border-radius:0.16rem;
      box-sizing: border-box;
      padding: 0.50rem 0.35rem 0 ;
      p {
        font-size: 0.48rem;
        font-weight: 600;
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
        span {
          font-size:0.20rem;
        }
        strong {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 1.10rem;
          height: 0.38rem;
          border-radius: 0.19rem;
          background:rgba(255,255,255,0.1);
          font-weight: 400;
        }
      }
    }
     .class-time {
      display: flex;
      flex-direction: column;
      width:3.40rem;
      height:5.72rem;
      background:rgba(255,255,255,1);
      border-radius:0.24rem;
      margin-top: 0.20rem;
      padding: 0.60rem  0.35rem;
      box-sizing: border-box;
      span {
        font-size:0.28rem;
        
        color:rgba(2,20,84,1);
      }
      strong {
        font-size: 0.36rem;
        font-weight:600;
        color:rgba(2,20,84,1);
        font-weight:400;
        margin-top: 0.10rem;
      }
    }
  }
  .sign-right {
    width: 15.40rem;
    height: 8.68rem;
    border-radius: 0.24rem;
    box-sizing: border-box;
    overflow: hidden;
    background: #1A2468;
    .btn {
      width: 100%;
      height: 0.60rem;
    }
    .content{
      position: relative;
      width: 15.40rem;
      height: 7.40rem;
      padding: 0.10rem 0;
      box-sizing: border-box;
      overflow: hidden;
    .scroll {
        position: absolute;
        top: 0;
        right: 0.12rem;
        width: 0.10rem;
        height: 7.40rem;
        background: #021454;
        border-radius: 0.05rem;
        span {
          position: absolute;
          top: 0;
          left: 0;
          width: 0.10rem;
          height: 1.20rem;
          background: #0BCFF1;
          border-radius: 0.05rem;
        }
      }
    }
    ul {
      position: relative;
      display: flex;
      flex-wrap: wrap;
      height: 100%;
      width: 100%;
      overflow: auto;
      &::-webkit-scrollbar{
        display: none;
      }
      li {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 0.40rem 0.45rem 0;
        img {
          width: 1.20rem;
          height: 1.20rem;
          border-radius: 50%;
        }
      }
    }
  }
}
</style>