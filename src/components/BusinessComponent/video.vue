<template>
  <div  class="video" :class="{ fullScreenShowOff: fullScreenShow, fullScreenShowOn: !fullScreenShow }">
    <NavBar v-show="controlFlag" v-if="fullScreenShow" class="video-nav-nar"/>
    <video v-if="!videoError" ref="video"
           :src="resourcePackage[0].localPath"
           width="auto"
           :height="videoHeight"
           class = "video_show"
           loop="loop"
           autoplay="autoplay"
           @timeupdate="timeupdate"
           @click="clearScreen"

           preload="auto">
    </video>
    <div v-show="controlFlag" class="control-btn">
      <i><strong :style="progressBarWidth"
                ref="progressBar"></strong></i>
      <strong>
        <img v-if="!fullScreenShow" @click="requestFullScreen"
             src="../.././assets/img/screenOff_icon.png"
             alt=""/>
        <img v-else @click="cancelFullScreen" src="../.././assets/img/screenOn_icon.png"/>
      </strong>
    </div>
    <div v-if="videoError" class="default-video-page">
      <img src="../../assets/img/wfbfsp_icon.png"/>
      <span>无法播放视频</span>
    </div>
  </div>
</template>

<script>
import NavBar from '../../components/navBar';
import jsBridge from '../../utils/app-bridge.js';
export default {
  props: ['resourcePackage', 'goback'],
  data () {
    return {
      progressBarWidth: {
        width: '0.01rem'
      },
      fullScreenShow: this.$route.query.operation == 'big' ? true : false,
      videoWidth: '100%',
      videoHeight: '100%',
      controlFlag: true,
      viewRouterName: '',// 不同视图路由跳转
      videoError: false,
      routePath: [
        { type: 1, name: 'class-index', index: 4 },
        { type: 2, name: 'interest-index', index: 2 },
        { type: 3, name: 'cooking-food-index', index: 1 },
      ],
    }
  },
  components: {
    NavBar
  },

  mounted () {
    
    if(this.$route.query.currentTime) {
      this.$refs.video.currentTime = parseInt(this.$route.query.currentTime)
    }
    if(this.$route.query.operation =='big' ){
      this.requestFullScreen();
      console.log(this.$route.params.localPath)
    }
    this.play()
    if(this.controlFlag&&this.fullScreenShow) {
      this.timer = setTimeout(() => {
        this.controlFlag = false
        clearTimeout(this.timer)
      }, 10000);
    }
    this.viewRouterName = this.routePath.filter(item => item.type == JSON.parse(JSON.parse(jsBridge.getAppData()).appType).viewType)[0];
  },
  methods: {
    imgError(e) {
      if(e.type == 'error') {
        this.videoError = true
      }
    },
    clearScreen() {
      this.fullScreenShow ? this.controlFlag = !this.controlFlag : ''
    },
    timeupdate (event) {
      // console.log(event.target.duration, event.target.currentTime)
      // console.log(this.$refs.progressBar.offsetWidth,this.$refs.progressBar.parentElement.offsetWidth)
      // console.log(this.$refs.progressBar.parentElement.offsetWidth * (event.target.currentTime / event.target.duration))
      if(!this.$refs.progressBar) return;
      // console.log(event.target.currentTime ,event.target.duration)
      if(parseInt(event.target.currentTime) == parseInt( event.target.duration)) {
        this.progressBarWidth.width = parseInt(this.$refs.progressBar.parentElement.offsetWidth) + 'px'
        event.target.currentTime = 0
      }
      this.progressBarWidth.width = parseInt(this.$refs.progressBar.parentElement.offsetWidth * (event.target.currentTime / event.target.duration)) + 'px'
    },
    // 全屏
    requestFullScreen () {
      this.$router.push({ name: 'publicity-fullScreen', query: { operation: 'big', id: this.$route.query.id, type: 1, currentTime: this.$refs.video.currentTime, goback: this.goback  }, params: { data: this.resourcePackage }})
      this.fullScreenShow = true;
      this.videoWidth = "100%";
      this.$refs.video.play();
    },
    // 返回
    cancelFullScreen() {
      if(this.$route.query.goback) {
        this.$router.go(-2);
        return;
      }
      this.$router.push({ name: this.viewRouterName.name, query: { id: this.$route.query.id, index: this.viewRouterName.index ,play: 'play', currentTime: this.$refs.video.currentTime }})
      // this.fullScreenShow = false;
      // this.videoWidth = "100%"
    },
    webkitRequestFullScreen () {
      this.$refs.video.webkitRequestFullScreen();//进入全屏
    },
    webkitCancelFullScreen () {
      document.webkitCancelFullScreen();//退出全屏
    },
    pause () {
      this.$refs.video.pause()
    },
    play () {
      this.$refs.video.play()
    }
  }
}
</script>

<style lang="scss" scope>
.video {
  position: relative;
  width: 100%;
  height: 100%;
  background:rgba(0,0,0,0.6);
  .video_show {
    position: absolute;
    z-index: 1000;
    right: 0;
    top: 0;
    left: 0;
    bottom: 0;
    margin: auto;
    max-width: 100%;
    max-height: 100%;
  }
  .video-nav-nar{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    background:rgba(0,0,0,0.6);
  }
  .control-btn {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 0.90rem;
    bottom: 0;
    background:rgba(0,0,0,0.6);
    border-radius: 0rem 0rem 0.16rem 0.16rem;
    padding: 0 0.40rem;
    z-index: 1001;
    i {
      position: relative;
      width: 85%;
      height: 0.20rem;
      background: rgba(230, 250, 253, 0.3);
      border-radius: 0.11rem;
      strong {
        position: absolute;
        left: 0;
        top: 0;
        height: 0.20rem;
        background: rgba(11, 207, 241, 1);
        border-radius: 0.11rem;
      }
    }
    strong {
      width: 0.52rem;
      height: 0.52rem;
      img {
        width: 0.52rem;
        height: 0.52rem;
      }
    }
  }
  .default-video-page {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    border-radius: 0.24rem;
    box-sizing: border-box;
    overflow: hidden;
    background:rgba(26,36,104,1);
    z-index: 1100;
    img {
      width: 1.35rem;
      height: 1.50rem;
    }
    span {
      font-size:0.40rem;
      font-weight:500;
      color:rgba(105,113,156,1);
      line-height:0.56rem;
      margin-top: 0.20rem;
    }
  }
}
.fullScreenShowOff {
  position: fixed;
  left: 0;
  top: 0;
  width: 19.20rem;
  height: 10.80rem;
}
.fullScreenShowOn {
  position: relative;
  width: 100%;
  height: 100%;
}
video {
  object-fit: fill;
}
//播放按钮
video::-webkit-media-controls-play-button {
  display: none;
}
//进度条
video::-webkit-media-controls-timeline {
  display: none;
}
//观看的当前时间
video::-webkit-media-controls-current-time-display {
  display: none;
}
//剩余时间
video::-webkit-media-controls-time-remaining-display {
  display: none;
}
//音量按钮
video::-webkit-media-controls-mute-button {
  display: none;
}
video::-webkit-media-controls-toggle-closed-captions-button {
  display: none;
}
//音量的控制条
video::-webkit-media-controls-volume-slider {
  display: none;
}
video::-internal-media-controls-download-button {
  display: none;
}

video::-webkit-media-controls-enclosure {
  overflow: hidden;
}

video::-webkit-media-controls-panel {
  width: calc(100% + 30px);
}
</style>