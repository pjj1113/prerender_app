<template>
  <div id="app" :class="themeClass">
    <div class="app-container box"
      v-tap="()=>vueTouch('点击')" 
      v-longtap="()=>vueTouch('长按')" 
      v-swipeleft="()=>vueTouch('左滑')"
      v-swiperight="()=>vueTouch('右滑')"
      v-swipeup="()=>vueTouch('上滑')"
      v-swipedown="()=>vueTouch('下滑')">
      <div style="width:100%;height:100%">
        <Layout />
      </div>
    </div>
  </div>
</template>
<script>
import './style/reset.scss';
import Layout from './layout'
import './utils/rem'
import api from './api/index'
export default {
  name: 'App',
  data() {
    return {
      theme: 'default',
      timer: '',
      touchTime: ''
    }
  },
  components : {
    Layout
  },
  computed: {
    themeClass() {
      return `theme-${this.theme}`
    }
  },
  methods: {
    getTimestamp(){
      api.getServerTimestamp().then(res=>{
        let diffTimestamp = res.data - new Date().valueOf();
        localStorage.setItem('kid_diffTimestamp',diffTimestamp)
      })
    },
    handleClick: function() {
      this.show = !this.show
    },
    vueTouch: function (txt) {
      console.log(txt)
      this.touchTime = new Date().getTime()
    },
    check: function () {
      var curTime = new Date().getTime()
      if((curTime - this.touchTime)>5*60*1000 ) {
        var loginInfo = localStorage.getItem('teacherInfo')
        if(loginInfo){
          this.$bus.emit('timeOutExitLogin')
        }
      }
    },
    loginSuccess(){
      this.touchTime = new Date().getTime()
    }
  },
  mounted() {
    this.getTimestamp()
    this.touchTime = new Date().getTime()
    this.timer = setInterval(this.check,5000)
    localStorage.removeItem('jsBridgeInfo')
  },
   created() {
    this.$bus.on('loginSuccess',this.loginSuccess);
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.$bus.off('loginSuccess', this.loginSuccess);
  }
}
</script>
<style lang="scss"> 
  @import "./style/theme.scss";
  .app-container {
    width: 19.20rem;
    height: 10.80rem;
    
    @include mytheme;
  }
</style>
