<template>
  <div class="cookconfirm">
    <ul class="title"
        v-if="hasUnApprovalNum">
      <img src="../../assets/img/confirm_meal_tip.png" />
      <li>配餐确认已超时</li>
    </ul>
    <table>
      <thead>
        <th  class="table_title">配餐确认时间</th>
        <th class="table_title">餐次</th>
        <th class="table_title">在园</th>
        <th class="table_title">特需餐人数</th>
        <th class="table_title">特需餐待审批</th>
        <th class="table_title">操作</th>
      </thead>
      <tbody>
          <tr v-for="(item,index) in mealInfo" :key="index">
            <td :rowspan="item.rowspan.row" v-show="index == item.rowspan.index" align="center">
              <ul class="list">
                <img v-if="!item.isConfirm && currentTime >= parseTime(item.confirmTime,'{h}{i}{s}')"
                     src="../../assets/img/confirm_meal_tip.png" />
                <span v-if="!item.isConfirm && currentTime >= parseTime(item.confirmTime,'{h}{i}{s}')">{{ hasUnApprovalNumChange() }}</span>
                <span>{{parseTime(item.confirmTime,'{h}:{i}')}}</span></ul>
            </td>
            <td align="center">{{item.mealName}}</td>
            <td align="center">{{item.studentNum }}</td>
            <td align="center">{{ item.specialNum }}</td>
            <td align="center">{{item.unApprovalNum}}</td>
            <td :rowspan="item.rowspan.row" v-show="index == item.rowspan.index" align="center" class="sub-btn">
              <span v-if="item.isConfirm">已确认</span>
              <strong v-else class="btn" @click="confirm(item.confirmTime)">确认配餐</strong>
            </td>
          </tr>
      </tbody>
    </table>
  </div>
</template>
<script>

import Edit from './edit';
import api from '../../api';
import { parseTime } from '../../utils/index';
import jsBridge from '../../utils/app-bridge.js';
import Vue from 'vue';

export default {
  data () {
    return {
      flag: false,
      scrollFlag: false,
      mealInfo: [],
      userInfo: '',
      teacherInfo: '',
      hasUnApprovalNum: false,
      currentTime: '',
      timer: null
    }
  },
  components: {
    Edit
  },
  mounted () {
    this.userInfo = JSON.parse(jsBridge.getAppData())
    this.$bus.on('getNewDate', (val)=> {
      this.currentTime = parseTime(new Date(), '{h}{i}{s}');
    })
    this.mealStatsForClass();
    this.timer = setInterval(() =>{
       this.mealStatsForClass();
    },1000* 300)
  },
  methods: {
    parseTime,
    confirm (val) {
      this.teacherInfo = JSON.parse(jsBridge.getAppData()).userLoginInfo && JSON.parse(JSON.parse(jsBridge.getAppData()).userLoginInfo);
      if(!this.teacherInfo) {
        this.$bus.emit('goCurrentPage')
        jsBridge.toLogin(`/#${ this.$route.path }?index=2`);
        return
      }
      let idList = [...this.mealInfo.filter(item => item.confirmTime == val).map(item => item.mealId.toString())]
      api.confirmMeal({ mealIds: idList, clazzId: this.userInfo.refId,teacherId: this.teacherInfo.teacherId }).then(res => {
        this.mealStatsForClass()
        // api.mealStatsForClass({
        //   clazzId: this.userInfo.refId, date: parseTime(new Date(), '{y}-{m}-{d}')
        // }).then(res => {
        //   this.mealInfo = (res.data);
        //   this.hasUnApprovalNum = false;
        //   // todo 数据转换
        //   this.mealInfo.find(item => {
        //     if (item.unApprovalNum != 0) {
        //       hasUnApprovalNum = true
        //     }
        //   })

        // })
      })
    },
    mealStatsForClass() {
      api.mealStatsForClass({
        clazzId: this.userInfo.refId, date: parseTime(new Date(), '{y}-{m}-{d}')
      }).then(res => {
        let arr = res.data;
        let list = arr.sort(this.compare('confirmTime'))
        this.mealInfo = this.tableArrRowSpan(list)
        this.hasUnApprovalNum = false;
        this.mealInfo.find(item => {
          if (item.unApprovalNum != 0) {
            hasUnApprovalNum = true
          }
        })
      })
    },
    compare(property){
      return function(a,b){
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
      }
    },
    hasUnApprovalNumChange() {
      this.hasUnApprovalNum = true;
    },
    closeEdit () {
      this.flag = false;
    },
    // 处理表格合并
    tableArrRowSpan(list) {
      let allArr = []
      let arrData = [];
      list.forEach((item, index, form)=> {
        if(arrData.some(val =>val.confirmTime == item.confirmTime)) {
          arrData.push(item)
        } else {
          allArr.push(arrData)
          arrData = []
          arrData.push(item)
        }
      })
      allArr.push(arrData)
      allArr.shift()
      var initArr = []
      let count = 0
      allArr.forEach((item,index) => {
        let rowIndex = count;
        item.forEach((val, j)=> {
          this.$set(val, 'rowspan', { row: item.length, index: rowIndex })
          initArr.push(val)
          count++
        })
      })
      return initArr
    }
    //  parseData(tables) {
    // 	// 1. 获取 confirmTime 数组并去重
    // 	const confirmTimes = Array.from(
    // 		new Set(tables.map(({ confirmTime }) => confirmTime))
    // 	);
    // 	let resutnArr = [];
    // 	// 2. 遍历 confirmTimes 数组，将数组内容放入
    // 	confirmTimes.map(confirmTime => {
    // 		// filter 对应 confirmTime 的内容，返回一个新数组
    // 		const filterTables = tables.filter(
    // 			table => table.confirmTime === confirmTime
    // 		);
    // 		// 封装新数组内容
    // 		const b = filterTables.map((filter, index) => ({
    // 			...filter,
    // 			span: index === 0 ? filterTables.length : 0,
    // 			mealIds: filterTables.map(({ mealId }) => mealId).join(',')
    // 		}));

    // 		resutnArr = [...resutnArr, ...b];
    // 	});
    // 	console.log(resutnArr);

    // 	return resutnArr;
    // },
    // arraySpanMethod({ row, column, rowIndex, columnIndex }) {
    // 	// 第一列和最后一列
    // 	if (columnIndex === 0 || columnIndex === 5) {
    // 		return [row.span, 1];
    // 	}
    // }
  },
  beforeDestroy() {
    clearTimeout(this.timer)
  }
}
</script>
<style lang="scss" scoped>
.cookconfirm {
  position: relative;
  width: 16rem;
  height: 100%;
  .title {
    position: absolute;
    top: -1.3rem;
    display: flex;
    justify-content: left top;
    margin-left: 1.61rem;
    align-items: center;
    margin-top: .6rem;
    img {
      width: 0.32rem;
      height: 0.32rem;
      margin-right: .2rem;
    }
    li {
      margin-left: 0.05rem;
      width: 2.11rem;
      height: 0.42rem;
      font-size: 0.3rem;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(244, 138, 3, 1);
      line-height: 0.42rem;
    }
  }
  table {
    width: 100%;
    justify-content: left top;
    margin-top: 1.1rem;
    margin-left: 1.61rem;
    align-items: center;
    thead {
      // display:table;
      width:100%;
      // table-layout:fixed;
    }
    // tbody {
    //   display:block;
    //   height:6rem;
    //   overflow-y:scroll;
    //   tr {
    //     display:table;
    //     width:100%;
    //     table-layout:fixed;
    //     .list {
    //       position: relative;
    //       img {
    //         position: absolute;
    //         left: .4rem;
    //         width: .28rem;
    //         height: .28rem;
    //         margin-right: .1rem;
    //       }
    //     }
    //   }
    // }
    .list {
      position: relative;
      img {
        position: absolute;
        left: .4rem;
        width: .28rem;
        height: .28rem;
        margin-right: .1rem;
      }
    }
    .table_title {
      padding: 0.1rem;
      height: 0.7rem;
      background: rgba(4, 5, 36, 0.37);
    }
    td {
      height: 0.6rem;
      padding: 0.1rem;
      background: rgba(26, 36, 104, 0.86);
      
    }
  }
  .sub-btn {
    .btn {
      display: inline-block;
      width:2.20rem;
      height:0.54rem;
      background: #0BCFF1;
      border-radius: 0.27rem;
      line-height: 0.54rem;
      font-weight: 400;
      color: #000;
    }
  }
  // table tbody {
  //   display:block;
  //   height:195px;
  //   overflow-y:scroll;
  // }

}
</style>