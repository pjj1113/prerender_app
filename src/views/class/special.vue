<template>
  <div class="special">
    <div class="centent">
      <div class="centent-left" v-for="(item, index) in list" :key="index">
        <div class="emphasis">
          <h3><img :src="getItemIcon(item.type)"/>{{ item.title }}</h3>
          <div ref="tabHeight" class="food-title-list" v-if="item.type == 3"><span :class="{ current_active_food: index === currentFoodIndex }" v-for="(item, index) in specialList" :key="index" @click.stop="setCurrentFood(index)">{{ item.mealName }}</span></div>
          <ul>
            <li v-for="(val, index) in item.childrenList" :key="index" @click="viewStudenDetail(val)">
              <div class="head">
              <div v-if="val.gardenStatus != 0" class="leave">
                <img v-if="val.leaveStatus == 1" src="../../assets/img/bj_icon.png"/>
                <img  v-if="val.leaveStatus == 2" src="../../assets/img/sj_icon.png"/>
                <span v-if="val.leaveStatus!= 0">{{ val.leaveStatus == 1 ? '病假' : '事假' }}</span>
              </div>
              <div class="avatar-img">
                <span  v-if="val.gardenStatus == 0 && val.leaveStatus != 0">
                  <img v-if="val.gardenStatus == 0 && val.leaveStatus == 1" src="../../assets/img/bj_icon.png"/>
                  <img  v-if="val.gardenStatus == 0 && val.leaveStatus == 2" src="../../assets/img/sj_icon.png"/>
                </span>
                <img :src="!!val.avatarShowImgUrl.url && val.avatarShowImgUrl.url || require('../../assets/img/avatar_boy.png') " />
                </div>
               <p>{{ val.childName }}</p>
            </div>
              <!-- <img :src="val.img"/>
              <span>{{ val.name }}</span> -->
            </li>
          </ul>
        </div>
        <!-- <div class="emphasis-box"></div> -->
      </div>
    </div>
    <edit @closeEdit="closeEdit" :studentDetails="studentDetails" :id="studentId"  v-if="flag" />
    <div v-if="flag" @click="closeEdit" class="shade-box"></div>
  </div>
</template>
<script>
import api from '../../api';
import { parseTime } from '../../utils/index';
import jsBridge from '../../utils/app-bridge.js';
import Edit from './edit';
export default {
  data() {
    return {
      userInfo: JSON.parse(jsBridge.getAppData()),
      specialList: [],
      specialChildrenList: [],
      currentFoodIndex: 0,
      tabHeight: '0.54rem',
      list:[
        {
          title: '今日重点观察儿童',
          type: 1,
          childrenList: [],
        },
        // {
        //   title: '今日叮嘱儿童',
        //   type: 2,
        //   childrenList: []
        // },
        {
          title: '今日特需餐儿童',
          type: 3,
          childrenList: []
        }
      ],
      flag: false,
      studentId: '',
      teacherInfo: '',
      studentList: [],
      studentDetails: '',
    }
  },
  components: {
    Edit
  },
  watch: {
    specialChildrenList: {
      handler(n, o) {
        this.list[1].childrenList = n;
      },
      deep: true
    }
  },
  mounted() {
    this.getStudentStatistical();
  },
  methods: {
    getItemIcon(val) {
      switch(val) {
        case 1:
          return require('../../assets/img/gc_light.png');
          break;
        case 2: 
          return require('../../assets/img/gc_light.png');
          break;
        case 3: 
          return require('../../assets/img/tc_light.png');
          break;
      }
    },
    setCurrentFood(val) {
      this.currentFoodIndex = val;
      let studentIdList =['2s1w',...this.specialList[val].students.map(item => item.studentId)].join(',')
      let emphasisSeeStudent = [];
      this.studentList.forEach(item => {
          if(studentIdList.indexOf(item.studentId) != -1) {
            emphasisSeeStudent.push(item);
          }
        })
      this.specialChildrenList = emphasisSeeStudent;
    },
    getStudentStatistical() {
      api.getStudentStatistical({ clazzId:  this.userInfo.refId, date: parseTime(new Date(), '{y}-{m}-{d}') }).then(res => {
        this.specialList = res.data;
        this.healthInspectStudentList();
        // res.data.length > 0 ? this.specialChildrenList= res.data[0].students.map(item => ({ img: item.photo || require('../../assets/img/avatar_boy.png'), name: item.studentName, studentId: item.studentId })) : '';
        // console.log(res)
      }).catch(() => {
        this.healthInspectStudentList();
      })
    },
    // 获取学生重点观察列表
    healthInspectStudentList() {
      api.healthInspectStudentList({schoolId: this.userInfo.schoolId, clazzId:  this.userInfo.refId, day: parseTime(new Date(), '{y}-{m}-{d}')
      }).then(res => {
        const emphasisSeeStudent = [];
        res.data.staticsDTOList.forEach(item => {
          if(item.accessType == 2) {
            emphasisSeeStudent.push(item)
          }
        })
        this.studentList =  res.data.staticsDTOList;
        this.list[0].childrenList = emphasisSeeStudent;
        this.setCurrentFood(0)
      })
    },
    // 关闭
    closeEdit () {
      this.flag = false;
      this.studentId = '';
      this.getStudentStatistical();
      this.healthInspectStudentList();
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
  }
}
</script>
<style lang="scss" scoped>
.special {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  .centent {
    position: absolute;
    display: flex;
    width: 16.85rem;
    height: 8.70rem;
    padding: 0.20rem;
    margin: 0 auto;
    box-sizing: border-box;
    .centent-left {
      width:5.35rem;
      height: 8.70rem;
      float: left;
      margin: 0 0.10rem;
      box-sizing: border-box;
      overflow: hidden;
      .emphasis {
        width:5.35rem;
        height: 8.70rem;
        padding: 0.20rem;
        background:rgba(26,36,104,0.86);
        border-radius:0.24rem;
        margin-bottom: 0.18rem;
        display: flex;
        flex-direction: column;
        h3 {
          position: relative;
          font-size:0.36rem;
          font-weight:500;
          line-height:0.50rem;
          margin-top: 0.20rem;
          text-indent: 1.00rem;
          img {
            position: absolute;
            left: 0.2rem;
            top: 0.05rem;
            width: 0.4rem;
            height: 0.4rem;
          }
        }
        .food-title-list {
          margin-top: 0.1rem;
          width: 100%;
          padding-bottom: 0.1rem;
          span {
            display: inline-block;
            height: 0.54rem;
            padding: 0 0.25rem;
            text-align: center;
            line-height: 0.54rem;
            border-radius: 0.27rem;
            background: #021454;
            font-size: 0.24rem;
            margin-right: 0.2rem;
            color: #0BCFF1;
            margin-bottom: 0.1rem;
          }
          .current_active_food {
            background: #0BCFF1;
            color: #021454;
          }
        }
        ul {
          display: flex;
          flex-wrap: wrap;
          width: 100%;
          flex: 1;
          overflow: auto;
          padding-left: 0.15rem;
           align-content: flex-start;
          &::-webkit-scrollbar {
            display: none;
          }
          li {
            width: 1.50rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            padding:0.20rem 0.30rem;
            img {
              width:0.90rem;
              height:0.90rem;
              border-radius: 50%;
            }
            span {
              font-size:0.20rem;
              font-weight:500;
              line-height: 0.28rem;
              margin-top: 0.10rem;
            }
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
          }
        }
      }
      .emphasis-box {
        width:5.35rem;
        height: 8.70rem;
        background:rgba(26,36,104,0.86);
        border-radius: 0.24rem;
      }
    }
  }
}
</style>