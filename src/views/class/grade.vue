<template>
  <div class="grade">
    <div class="centent">
      <div class="title">
        <p>
          <span><img  src="../../assets/img/gc_light.png"/><strong>观察</strong> </span>
          <span><img  src="../../assets/img/tc_light.png"/><strong>特餐</strong> </span>
        </p>
        <p>
          <span><img src="../../assets/img/bj_icon.png"/><strong>病假</strong> </span>
          <span><img src="../../assets/img/sj_icon.png"/><strong>事假</strong> </span>
        </p>
        <span class="right-span">{{"更新时间："+updateTime}}</span>
      </div>
      <div class="details">
        <div v-show="false" class="scroll">
          <span ref="scrollComp"></span>
        </div>
        <ul ref="list" @scroll.passive="getScroll($event)" v-if="studentInfo">
          <li class="list"
              v-for="(item,index) in studentInfo.staticsDTOList"
              @click="viewStudenDetail(item)"
              :key="index">
            <div class="head">
              <div v-if="item.gardenStatus != 0" class="leave">
                <img v-if="item.leaveStatus == 1" src="../../assets/img/bj_icon.png"/>
                <img  v-if="item.leaveStatus == 2" src="../../assets/img/sj_icon.png"/>
                <span v-if="item.leaveStatus!= 0">{{ item.leaveStatus == 1 ? '病假' : '事假' }}</span>
              </div>
              <div class="avatar-img">
                <span  v-if="item.gardenStatus == 0 && item.leaveStatus != 0">
                  <img v-if="item.gardenStatus == 0 && item.leaveStatus == 1" src="../../assets/img/bj_icon.png"/>
                  <img  v-if="item.gardenStatus == 0 && item.leaveStatus == 2" src="../../assets/img/sj_icon.png"/>
                </span>
                <img :src="item.avatarShowImgUrl.url && item.avatarShowImgUrl.url || require('../../assets/img/avatar_boy.png') " /></div>
               <p>{{ item.childName }}</p>
            </div>
            <div class="case-icon">
              <div class="case-icon-style">
                <img  v-if="item.accessType == 2" src="../../assets/img/gc_light.png" />
                <img v-else src='../../assets/img/gc_icon.png'/>
              </div>
              <div class="case-icon-style">
                <img v-if="specialStudentList && specialStudentList.indexOf(item.studentId)>=0 && item.gardenStatus==0" src='../../assets/img/tc_light.png' />
                <img v-else src='../../assets/img/tc_icon.png'/>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <edit @closeEdit="closeEdit" :studentDetails="studentDetails" :id="studentId"  v-if="flag" />
    <div v-if="flag" @click="closeEdit" class="shade-box"></div>
  </div>
</template>
<script>
import Edit from './edit';
import api from '../../api';
import { parseTime } from '../../utils/index';
import jsBridge from '../../utils/app-bridge.js';
export default {
  data () {
    return {
      flag: false,
      scrollFlag: false,
      studentInfo: '',
      userInfo: '',
      specialStudentList:[],
      updateTime:'',
      timer: null,
      studentId: '',
      teacherInfo: '',
      studentDetails: ''
    }
  },
  components: {
    Edit
  },
  mounted() {
    this.userInfo = JSON.parse(jsBridge.getAppData());
    this.healthInspectStudentList();
    this.getSpecialStudentList();
    this.timer = setInterval(() =>{
      this.healthInspectStudentList();
      this.getSpecialStudentList();
    },1000* 300)
    this.$bus.on('goEditStudentDetail', ()=> {
      this.studentId ? this.flag = true : ''
    })
   
  },
  methods: {
    healthInspectStudentList() {
      api.healthInspectStudentList({schoolId: this.userInfo.schoolId, clazzId:  this.userInfo.refId, day: parseTime(new Date(), '{y}-{m}-{d}')
      }).then(res => {
        this.studentInfo = res.data;
        this.updateTime = parseTime(new Date(),'{y}/{m}/{d} {h}:{i}');
        this.$nextTick(()=> {
          if(this.$refs.list.scrollHeight > this.$refs.list.clientHeight) {
            this.scrollFlag = true
          } else {
            this.scrollFlag = false
          }
        })
      })
    },
    getSpecialStudentList() {
      api.specialStudentList({clazzId:  this.userInfo.refId, date: parseTime(new Date(), '{y}-{m}-{d}')
      }).then(res => {
        this.specialStudentList = res.data;
      })
    },
    closeEdit () {
      this.flag = false;
      this.studentId = '';
      this.healthInspectStudentList();
    },
    getScroll (event) {
      if(!this.scrollFlag) return;
      let scrollAll = this.$refs.scrollComp.parentElement.offsetHeight - this.$refs.scrollComp.offsetHeight;
      this.$refs.scrollComp.style.top = scrollAll / ((event.target.scrollHeight - event.target.clientHeight) / event.target.scrollTop) + 'rem';
    },
    viewStudenDetail(val) {
      this.studentId = val.studentId;
      this.teacherInfo = JSON.parse(jsBridge.getAppData()).userLoginInfo && JSON.parse(JSON.parse(jsBridge.getAppData()).userLoginInfo);
      if(!this.teacherInfo) {
        localStorage.setItem('goDetail', 'true')
        this.$bus.emit('goCurrentPage')
        jsBridge.toLogin(`/#${ this.$route.path }?index=1`);
        return
      }
      this.getStudentdetail();
    },
    // 获取学生详情
    getStudentdetail() {
      api.getStudentdetail({ schoolId: this.userInfo.schoolId, clazzId:  this.userInfo.refId,studentId: this.studentId }).then(res => {
        this.studentDetails= res.data;
        this.flag = true;
      })
    },
  },
   beforeDestroy() {
    clearTimeout(this.timer);
    this.$bus.off('goEditStudentDetail');
  }
}
</script>
<style lang="scss" scoped>
.grade {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 0 0.25rem;
  .centent {
    position: absolute;
    left: 50%;
    margin-left: -9.10rem;
    display: flex;
    flex-direction: column;
    width: 18.20rem;
    height: 8.70rem;
    padding: 0.20rem;
    background: #1a2468;
    border-radius: 0.15rem;
    .title {
      display: flex;
      height: 0.60rem;
      .right-span{
         margin-left: auto;
      }
      p {
        display: flex;
        height: 0.25rem;
        background: #021454;
        padding: 0 0.20rem;
        border-radius: 0.10rem;
        margin-right: 0.10rem;
        img {
          width: 0.30rem;
          height: 0.30rem;
          margin-right: 0.10rem;
        }
        span {
          display: flex;
          align-items: center;
          font-size: 0.16rem;
          margin-right: 0.20rem;
          b {
            width: 0.26rem;
            height: 0.26rem;
            
            border-radius: 50%;
            background: url('../../assets/img/eye_icon.png') no-repeat;
            background-size: 100%;
            background-color: #1C98FA;
          }
          strong {
            font-weight: 400;
            margin-left: 0.10rem;
            font-size: 0.16rem;
          }
          i {
            padding-left: 0.10rem;
            color: #0bcff1;
          }
        }
      }
    }
    .details {
      position: relative;
      width: 100%;
      height: 7.40rem;
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
          background: #0bcff1;
          border-radius: 0,05rem;
        }
      }
      ul {
        position: relative;
        display: flex;
        align-content: flex-start;
        flex-wrap: wrap;
        height: 100%;
        width: 100%;
        overflow: auto;
        &::-webkit-scrollbar {
          display: none;
        }
        .list {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 1.70rem;
          height: 1.70rem;
          margin: 0.25rem 0;
          .head {
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-content: center;
            width: 1.00rem;
            height: 1.40rem;
            overflow: hidden;
            .leave {
              position: absolute;
              top: -5px;
              left: 0;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              width: 1.00rem;
              height: 1.48rem;
              background:rgba(26,36,104,0.7);
              z-index: 10;
              img {
                width: .24rem;
                height: .24rem;
                border-radius: 50%;
              }
              span {
                margin-top: .06rem;
                font-size: .18rem;
              }
            }
            .avatar-img {
                position: relative;
                width: 1.00rem;
                height: 1.00rem;
                border-radius: 50%;
              span {
                position: absolute;
                bottom: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 1.00rem;
                height: .50rem;
                background:rgba(26,36,104,0.7);
                img {
                  width: .24rem;
                  height: .24rem;
                  border-radius: 50%;
                }
              } 
              img {
                width: 1.00rem;
                height: 1.00rem;
                border-radius: 50%;
              }
            }
             p {
              font-size: .20rem;
              font-weight: 500;
              line-height: .28rem;
              margin-top: .07rem;
              text-align: center;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }
          }
          .case-icon {
            display: flex;
            justify-content: center;
            align-items: center;
            .case-icon-style{
              display: inline-block;
              width: .26rem;
              height: .26rem;
              margin-right: 0.1rem;
              img {
                width: .24rem;
                height: .24rem;
                padding: 0 0.03rem;
                margin-top: 0.10rem;
              }
            }
            // b {
            //   display: inline-block;
            //   width: .26rem;
            //   height: .26rem;
            //   border-radius: 50%;
            //   background: url('../../assets/img/eye_icon.png') no-repeat;
            //   background-size: 100%;
            //   background-color: #1C98FA;
            // }
            // img {
            //   width: .24rem;
            //   height: .24rem;
            //   padding: 0 0.09rem;
            //   margin-top: 0.10rem;
            // }
          }
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
</style>