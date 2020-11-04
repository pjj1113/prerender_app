<template>
  <div class="grade-edit">
    <div class="header">
      <span @click="editStart">{{ !isEdit && '修改状态' || '完成' }}</span>
      <strong @click="closeEdit"><van-icon name="cross" size="22"/></strong>
    </div>
    <div class="content">
      <div class="photo">
        <div class="photo-img"><img :src="studentInfo.avatarShowImgUrl ? studentInfo.avatarShowImgUrl.compressUrl :require('../../assets/img/avatar_boy.png')"/></div>
        <span>{{ studentInfo && studentInfo.childName }}</span>
      </div>
      <div class="detail">
        <div class="info">
          <span class="label">当前状态</span>
          <strong class="value studen-start">
            <ul>
              <li @click="isEdit ? gardenStatus = 0 : ''" :class="{ active_start: gardenStatus == 0 }"><span>在园</span></li>
              <li @click="isEdit ? gardenStatus = 1 : ''" :class="{ active_start: gardenStatus == 1 }"><span>离园</span></li>
            </ul>
          </strong>
        </div>
        <div class="info">
          <span class="label">请假状态</span>
          <strong class="value studen-start">
            <ul>
              <li @click="isEdit && studentInfo.leaveStatus == 0 ? leaveStatus = 0 : ''" :class="{ active_start: leaveStatus == 0 }"><span>未请假</span></li>
              <li @click="isEdit && studentInfo.leaveStatus == 0 ? leaveStatus = 2 : ''" :class="{ active_start: leaveStatus == 2 }"><span>事假</span></li>
              <li @click="isEdit && studentInfo.leaveStatus == 0 ? leaveStatus = 1 : ''" :class="{ active_start: leaveStatus == 1 }"><span>病假</span></li>
            </ul>
          </strong>
        </div>
        <div class="info">
          <span class="label">过敏源</span>
          <strong class="value">{{ alleryList }}</strong>
        </div>
        <div class="info" v-if="studentInfo && studentInfo.leaveStatus != 0">
          <span class="label">请假原因</span>
          <strong class="value">{{ studentInfo && studentInfo.leaveInfo }}</strong>
        </div>
        <div class="info">
          <span class="label">今日晨检</span>
          <strong class="value">{{ studentInfo && studentInfo.healthExceptionInfo || '无' }}</strong>
        </div>
        <!-- <div class="long-info">
          <span class="long-label">今日叮嘱</span>
          <strong class="long-text">sndusajdiosadjiosahdpwuwphreuwihreuwifeuwifiewuiroewjfoiewjfiewofuioewjiowajiaowejiowadeaiw</strong>
        </div> -->
        <div class="info">
          <span class="label">特需餐</span>
          <strong class="value">{{ studentInfo.isApply && '已申请' || '未申请' }}</strong>
        </div>
      </div>
    </div>
     <div v-if="shadeShow"
           class="popup-del-file">
        <span>是否确认修改该学生的状态？</span>
        <div class="popup-del-file-btn">
          <span @click="startCourse">确认</span>
        </div>
      </div>
      <div v-if="shadeShow"  class="shade-box"></div>
  </div>
</template>
<script>
import api from '../../api';
import jsBridge from '../../utils/app-bridge.js';
export default {
  props: ['id', 'studentDetails'],
  data() {
    return {
      userInfo: JSON.parse(jsBridge.getAppData()),
      studentId: this.id,
      shadeShow: false,
      studentInfo:this.studentDetails,
      isEdit: false,
      gardenStatus:this.studentDetails ? this.studentDetails.gardenStatus : 0,
      leaveStatus:this.studentDetails ? this.studentDetails.leaveStatus : 0,
      teacherInfo: ''
    }
  },
  mounted() {
    this.getStudentdetail()
  },
  computed:{
    alleryList() {
      if(this.studentInfo && !this.studentInfo.alleryList) {
        return '无';
      }
      if(this.studentInfo.alleryList) return [...this.studentInfo.alleryList.map(item => item.name)].join('、')
    },
  },
  methods: {
    // 获取学生详情
    getStudentdetail() {
      api.getStudentdetail({ 
        schoolId: this.userInfo.schoolId, clazzId:  this.userInfo.refId,studentId: this.studentId }).then(res => {
        this.studentInfo = res.data;
        this.gardenStatus = this.studentInfo.gardenStatus;
        this.leaveStatus = this.studentInfo.leaveStatus;
      }).catch(err => {

        
      })
    },
    // 修改转态
    editStart() {
      this.teacherInfo = JSON.parse(jsBridge.getAppData()).userLoginInfo && JSON.parse(JSON.parse(jsBridge.getAppData()).userLoginInfo);
      if(!this.teacherInfo) {
        this.$bus.emit('goCurrentPage')
        jsBridge.toLogin(`/#${ this.$route.path }?index=1`);
        return
      }
      if(this.isEdit) {
        this.shadeShow = true;
      }
      this.isEdit = true;
    },
    // 确认修改
    startCourse() {
      this.shadeShow= false;
      api.updateAttendanceStatus({ schoolId: this.userInfo.schoolId, 
      clazzId:  this.userInfo.refId, 
      studentId: this.studentId, 
      gardenStatus: this.gardenStatus == this.studentInfo.gardenStatus ? null : this.gardenStatus,
      leaveStatus: this.leaveStatus == this.studentInfo.leaveStatus ? null : this.leaveStatus,
      }).then(res => {
        this.closeEdit();
      }).catch(err => {
        this.closeEdit();
      })
    },
    closeEdit() {
      this.$emit('closeEdit')
    }
  },
}
</script>
<style lang="scss" scoped>
.grade-edit {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  z-index: 100;
  width: 15.55rem;
  // min-height: 6.5rem;
  max-height: 6.5rem;
  background: linear-gradient(180deg,rgba(21, 46, 134, 1) 0%,rgba(7, 28, 104, 1) 100%);
  box-shadow: 0rem 0rem 0.50rem 0rem rgba(0, 7, 54, 1);
  border-radius: 0.24rem;
  padding: 0.20rem 0.30rem;
  z-index: 1001;
  .header {
    display: flex;
    justify-content: flex-end;
    height: 0.6rem;
    span {
      display: flex;
      justify-content: center;
      align-items: center;
      width:2.20rem;
      height:0.54rem;
      background:rgba(2,24,105,0.86);
      border-radius:0.27rem;
      font-size:0.28rem;
      font-weight:400;
      color:rgba(11,207,241,1);
      line-height:0.40rem;
    }
    strong {
      display: flex;
      justify-content: center;
      align-items: center;
      width:0.54rem;
      height:0.54rem;
      background:rgba(2,24,105,0.86);
      border-radius: 50%;
      margin-left: 0.20rem;
    }
  }
  .content{
    display: flex;
    margin-top: 0.20rem;
    max-height:calc(100% - 0.6rem );
    overflow: hidden;
    .photo {
      display: flex;
      flex-direction: column;
      align-items: center;
      max-height: 100%;
      overflow: hidden;
      .photo-img {
        display: flex;
        justify-content: center;
        align-items: center;
        width:2.59rem;
        height:3.48rem;
        border-radius:0.24rem;
        overflow: hidden;
        background: #fff;
        img {
          width:auto;
          height: 100%;
        }
      }
      
      span {
        font-size:0.38rem;
        font-weight:400;
        line-height:0.53rem;
        margin-top: 0.30rem;
      }
    }
    .detail {
      display: flex;
      flex-direction: column;
      width: 12.00rem;
       max-height: 100%;
      margin-left: 0.70rem;
      overflow: auto;
      .info {
        display: flex;
        width: 11.00rem;
        margin-bottom: 0.26rem;
        .label {
          display: flex;
          justify-content: center;
          align-items: center;
          width:2.20rem;
          font-size:0.30rem;
          background:rgba(4,5,36,0.37);
          border-radius:0.08rem 0rem 0rem 0.08rem;
        }
        .value {
          line-height: 0.54rem;
          width:8.80rem;
          background:rgba(2,24,105,0.86);
          border-radius:0rem 0.08rem 0.08rem 0rem;
          padding: 0 0.5rem 0 1.00rem;
          font-size:0.30rem;
          font-weight: 400;
          box-sizing: border-box;
          // white-space: nowrap;
          // overflow: hidden;
          // text-overflow: ellipsis;
          // word-break: break-all;
        }
        .studen-start {
            ul {
              display: flex;
              li {
                display: flex;
                align-items: center;
                width: 2.5rem;
                span {
                  position: relative;
                  font-size:0.30rem;
                  &::after {
                    content: '';
                    position: absolute;
                    left: -0.5rem;
                    top: 0.13rem;
                    display: inline-block;
                    width: 0.30rem;
                    height: 0.30rem;
                    background:rgba(2,20,84,1);
                    border: 0.02rem solid rgba(24,41,99,1);
                    border-radius: 50%;
                    margin-right: 0.23rem;
                  }
                }
              }
              .active_start {
                span {
                  color: rgba(11,207,241,1);
                  &::after {
                    content: '';
                    position: absolute;
                    left: -0.5rem;
                    top: 0.13rem;
                    display: inline-block;
                    width: 0.24rem;
                    height: 0.24rem;
                    background:rgba(11,207,241,1);
                    border-radius: 50%;
                    margin-right: 0.23rem;
                  }
                }
              }
            }
          }
      }
      .long-info {
          display: flex;
          width: 11.00rem;
          height:2.75rem;
          margin-bottom: 0.26rem;
        .long-label {
          display: flex;
          justify-content: center;
          align-items: center;
          width:2.20rem;
          height:2.75rem;
          font-size:0.30rem;
          background:rgba(4,5,36,0.37);
          border-radius:0.08rem 0rem 0rem 0.08rem;
        }
        .long-text {
          width:8.80rem;
          height:2.75rem;
          font-size:0.30rem;
          font-weight: 400;
          padding: 0.15rem 1.00rem;
          box-sizing: border-box;
          background:rgba(2,24,105,0.86);
          border-radius:0rem 0.08rem 0.08rem 0rem;
          word-wrap: break-word;
          overflow: hidden;
          white-space:normal;
        }
      }
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
</style>