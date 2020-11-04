<template>
<!-- 6. 添加全局样式 -->
  <div class="clazz">
    <nav-bar @goPublicity="goPublicity" @exitHome="exitHome"/>
    <van-swipe class="my-swipe" ref="swipe" :initial-swipe="initIndex" @change="page" indicator-color="white">
      <van-swipe-item><Food v-if="pageIndex == 0"/></van-swipe-item>
      <van-swipe-item><Publicity  v-if="pageIndex == 1"/></van-swipe-item>
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
import Food from './food'
import Publicity from '../publicity/player'
import jsBridge from '../../utils/app-bridge.js';
import { Toast } from 'vant';
export default {
  data() {
    return {
      pageIndex: 0,
      userInfo: '',
      shadeShow: false,
      timerNum: 15,
      timer: '',
      initIndex: 0,
      swipeLeftOrRight: 2,
    }
  },
  components: {
    NavBar,
    Food,
    Publicity
  },
  computed: {
    
  },
  watch: {
    shadeShow(val) {
      if(val == false) {
         clearInterval(this.timer)
          this.timerNum = 15;
          this.shadeShow = false;
          this.timer = ''
      }
    }
  },
  created() {
    if(this.$route.query.play ) {
      this.initIndex = 1;
      this.pageIndex = 1;
      this.$refs.swipe.swipeTo(1)
    }
  },
  mounted() {
    this.userInfo = JSON.parse(jsBridge.getAppData());
    this.$route.query.index ?  this.$refs.swipe.swipeTo(parseInt(this.$route.query.index)) : '';
    
  },
  methods: {
    //  vueTouch: function (txt) {
    //    Toast(txt)
    //   console.log(txt)
    //   if(txt=='左滑'){
    //     this.swipeLeftOrRight = 0;
    //   }else{
    //     this.swipeLeftOrRight=1;
    //   }
    // },
    page(val) {
    //  Toast('val is '+val+' pageIndex is '+this.pageIndex)
     

       if(this.pageIndex == 1&&val==0) {
          this.$refs.swipe.swipeTo(1);
          jsBridge.toSecondLogin();
          return;
      }

    //   if(this.swipeLeftOrRight==1&&this.pageIndex==0&&val==1){
    //   this.$refs.swipe.swipeTo(0);
    //   return;
    // }
    // if(this.swipeLeftOrRight==0&&this.pageIndex==1&&val==0){
    //   this.$refs.swipe.swipeTo(1);
    //   return;
    // }
      
      if(this.$route.query.play){
        this.pageIndex = 1;
        this.$delete(this.$route.query, 'play')
        this.$router.push({  name: 'cooking-food-index', query: { ...this.$route.query}})
        return;
      }
      if(this.$route.query.id){
        this.pageIndex = val;
        this.$router.push({  name: 'cooking-food-index', query: { index: val } })
        return;
      }
      // if(this.pageIndex == 0 && val == 1 && this.shadeShow == false) {
      //   console.log(111)
      //   this.$refs.swipe.swipeTo(0);
      //   return;
      // }
      if(val == 1&&this.pageIndex==0) {
        if(!JSON.parse(jsBridge.getAppData()).userLoginInfo) {
          this.$refs.swipe.swipeTo(0);
          jsBridge.toLogin(`/#${ this.$route.path }?index=1`);
          return;
        } else {
          // Toast('请教师登陆')
        }
      }
      // if(this.pageIndex==1&&val==0){
      //   this.$refs.swipe.swipeTo(1);
      //   return;
      // }
    
     
      this.pageIndex = val
      this.$router.push({  name: 'cooking-food-index', query: { index: val } })
    },
    goPublicity() {
      if(JSON.parse(jsBridge.getAppData()).userLoginInfo) {
        this.pageIndex = 1;
        this.$refs.swipe.swipeTo(1);
        this.$router.push({  name: 'cooking-food-index', query: { index: 1 } })
      } 
    },
    exitShow() {
      this.shadeShow = false;
      this.pageIndex = 0
      this.$refs.swipe.swipeTo(0);
    },
    exitHome() {
      this.shadeShow = false;
      this.pageIndex = 0;
      this.$refs.swipe.swipeTo(0);
    },
    closeShade() {
      this.shadeShow = false;
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
  beforeDestroy(){
    this.$bus.off('secondLoginSuc', this.secondLoginSuccess);
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
}
</script>
<style lang="scss">
.clazz{
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
.van-swipe {
  flex: 1;
  padding: 0 0rem 0.30rem;
  overflow: hidden;
}
.van-swipe__indicators {
  bottom: 0.30rem;
}
.van-swipe__indicator {
  width: 0.16rem;
  height: 0.16rem;
}
.van-swipe__indicator:not(:last-child) {
  margin-right: 0.28rem;
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
        width:1.10rem;
        height:1.10rem;
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
</style>