<template>
  <div class="food">
    <div class="tab-switch">
      <ul>
        <li v-for="(item, index) in list" :key="index" :class="{ tab_active: item.id == activeId }" @click="onClick(item, index)">{{item.title}}</li>
      </ul>
    </div>
    <div class="main" :v-model="allData">
      <div class="left-content">
        <div v-if="list.toString()" class="food-total">
          <ul>
            <img src="../../assets/img/normal_count.png"/>
            <li>常规餐总计人数</li>
            <li>{{allData.generalTotalNum - allData.specialTotalNum}}</li>
          </ul>
          <ul >
            <img src="../../assets/img/special_count.png"/>
            <li class="abc">特需餐总计人数</li>
            <li class="abc">{{allData.specialTotalNum}}</li>
          </ul>
        </div>
        <div v-else class="food-total">
          <div class="lack-page">
            <img src="../../assets/img/food_left_bottom_icon.png"/>
            <span>当前无数据</span>
          </div>
        </div>
        <div v-if="activeContent" class="food-menu">
          <ul>      
            <li class="food-menu-title">{{activeName}}</li>
            <li class="food-menu-content"><pre>{{ activeContent }}</pre></li>
          </ul>
        </div>
        <div v-else class="food-menu">
          <div class="lack-page">
            <img src="../../assets/img/food_left_top_icon.png"/>
            <span>当前无数据</span>
          </div>
        </div>
      </div>
      <div class="right-content">
        <ul v-if="list.toString()">
          <li v-for="(i,index) in allData.list" :key="index">
            <div class="clazz-name" :style="{'background':colors[i.gradeOrder] }">{{i.clazzName}}</div>
            <div class="cooking-share">
              <!-- 如果是未确认的显示--并且ui需要显示灰色 -->
              <span :class="{ cooking_normal_off:  !i.isConfirm || i.specialNum == 0 }">常规餐{{ '        ' + (i.isConfirm?i.generalNum-i.specialNum:"--")  }}</span>
              <strong :class="{ cooking_share_off: !i.isConfirm || i.specialNum == 0 }">特需餐{{ '        ' +  (i.isConfirm?i.specialNum:"--") }}</strong>
            </div>
          </li>
        </ul>
        <div v-else class="lack-page">
          <img src="../../assets/img/box_icon.png"/>
            <span>当前无数据</span>
          </div>
      </div>
    </div>
  </div>
</template>

<script>

import { parseTime } from '../../utils/index';
import api from '../../api';
export default {

  data() {
    return {
      activeName:"",
      activeId:"",
      activeContent: '',
      allData :{},
      list:[],
      indexKey: 0,
      colors:['#FFA449','#FFA449','#05BA66','#009CE7','#A05BFB','#F159B9','#FFA449','#05BA66','#009CE7','#A05BFB','#F159B9','#FFA449','#05BA66','#009CE7','#A05BFB','#F159B9','#FFA449','#05BA66','#009CE7','#A05BFB','#F159B9'],
      timer: null
    }
  },
  methods:{
    onClick(val, index){
      this.indexKey = index;
      this.activeName  = val.title;
      this.activeId = val.id;
      this.activeContent = val.content ;
      this.getCookIndexByDate(this.activeId)
    },
    getCookIndexByDate() {
      api.getCookIndexByDate({isFilterUnPublish:  false, date: parseTime(new Date(), '{y}-{m}-{d}')
    }).then(res=>{
      this.list = res.data;
      this.activeName = this.list[this.indexKey].title
      this.activeId = this.list[this.indexKey].id;
      this.activeContent = this.list[this.indexKey].content;
      this.getCookByIndex(this.list[this.indexKey].id)
    }
    )
    },
    getCookByIndex(val) {
      api.getCookByIndex({mealId: val}).then(res=>{
        this.allData = res.data;
        this.allData.list =  res.data.list.sort(this.compare('gradeOrder'));
      })
    },
    compare(property){
    return function(a,b){
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
    }
}
  },
  mounted(){
    this.getCookIndexByDate();
    this.timer = setInterval(() =>{
      this.onClick({ title:this.activeName, id: this.activeId, content: this.activeContent }, this.indexKey)
    },1000* 300)
  },
  beforeDestroy() {
    clearTimeout(this.timer)
  },
}
</script>

<style lang="scss" scoped>
  .food {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding: 0 0.20rem 0.40rem;
    overflow: hidden;
    .tab-switch {
      ul {
        display: flex;
        justify-content: center;
        align-items: center;
        li {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-left: 0.2rem;
          width:2.20rem;
          height:0.54rem;
          // background:rgba(11,207,241,1);
          background:rgba(23,33,100,1);
          font-size: 0.28rem;
          color:rgba(11,207,241,1);
          border-radius: 0.27rem;
        }
        .tab_active {
          background:rgba(11,207,241,1);
          color: #fff
        }
      }
    }
    .main {
      display: flex;
      width: 100%;
      height: 7.75rem;
      margin-top: 0.2rem;
      .left-content {
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 4.6rem;
        .food-total {
          display: flex;
          flex-direction: column;
          justify-content: center;
          height:2rem;
          background:rgba(7,156,184,1);
          border-radius:16px;
          ul {
            display: flex;
            justify-content: center;
            align-items: center;
            padding-left: 0.5rem;
            img {
               display: flex;
               justify-content: center;
               align-items: center;         
            }
            li {
               display: flex;
               justify-content: center;
               align-items: center;
               margin-left: 0.2rem;
               width:2.20rem;
               height:0.54rem;
            }
            .abc{ color:#FFE089} 
          }
          .lack-page {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            img {
              width: 0.68rem;
              height: 0.62rem;
            }
            span {
              font-size: 0.26rem;
              margin-top: 0.2rem;
              color: rgba($color: #fff, $alpha: 0.3);
              font-weight:500;
            }
          }
        }
        .food-menu {
          height:5.54rem;
          background:rgba(96,28,225,1);
          border-radius:24px;
          margin-top: 0.15rem;
          padding: 0.3rem .4rem;
          ul {
            height: 100%;
             overflow: hidden;
            .food-menu-title {
            text-align: center;
            font-size: .36rem;
            font-weight:500;
            letter-spacing: .09rem;
            height: 0.54rem;
           
          }
          .food-menu-content {
            margin-top: 0.2rem;
            font-size: 0.24rem;
            word-wrap: break-word;
            line-height: 0.4rem;
            height: 5rem;
            overflow: auto;
            pre {
              margin: 0;
            }
          }
          }
          .lack-page {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            img {
              width: 0.68rem;
              height: 0.62rem;
            }
            span {
              font-size: 0.26rem;
              margin-top: 0.2rem;
              color: rgba($color: #fff, $alpha: 0.3);
              font-weight:500;
            }
          }
        }
      }
      .right-content {
        width: 14.40rem;
        margin-left: .15rem;
        .lack-page {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            img {
              width: 1.00rem;
              height: 0.87rem;
            }
            span {
              font-size: 0.4rem;
              margin-top: 0.2rem;
              color: rgba($color: #fff, $alpha: 0.3);
              font-weight:500;
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
          li {
            display: flex;
            flex-direction: column;
            width:2.19rem;
            height:2.20rem;
            background:linear-gradient(180deg,rgba(21,46,134,1) 0%,rgba(7,28,104,1) 100%);
            border-radius: 0.24rem;
            margin-top: 0.15rem;
            margin-right: 0.15rem;
            .clazz-name {
              height: 0.72rem;
              background:rgba(255,164,73,1);
              border-radius: 0.24rem 0.24rem 0rem 0rem;
              font-size: 0.28rem;
              line-height: 0.72rem;
              text-align: center;
            }
            .cooking-share {
              display: flex;
              flex-direction: column;
              justify-items: center;
              align-items: center;
              font-size: 0.24rem;
              line-height: 0.52rem;
              .cooking_normal_off {
                color: rgba($color: #fff, $alpha: 0.5);
              }
              .cooking_share_off {
                color: rgba(255,224,137,.7);
              }
              span {
                margin-top: 0.1rem;
              }
              strong {
                font-weight: 400;
                color:rgba(255,224,137,1);
              }
            }
          }
        }
      }
    }
  }
</style>