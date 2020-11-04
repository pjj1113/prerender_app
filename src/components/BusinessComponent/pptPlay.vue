<template>
  <div  class="video" :class="{ fullScreenShowOff: fullScreenShow, fullScreenShowOn: !fullScreenShow }">
    <NavBar v-show="controlFlag" v-if="fullScreenShow" class="video-nav-nar"/>
    <audio autoplay="autoplay"  preload="auto" loop="loop" ref="audio" :src="voiceLocaPath"></audio>
    <!--     @error="imgError" -->
    <img v-if="!videoError" ref="video"

      class="video_show"
           :src="exhibition"
           width="auto"
           :height="videoHeight"
           @click="clearScreen"
           >
    <div v-show="controlFlag" class="control-btn">
      <i><strong :style="progressBarWidth"
                ref="progressBar"></strong></i>
      <strong>
        <img v-if="!fullScreenShow" @click="requestFullScreen"
             src="../../assets/img/screenOff_icon.png"
             alt=""/>
        <img v-else @click="cancelFullScreen" src="../../assets/img/screenOn_icon.png"/>
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
  props:['info', 'goback'],
  data () {
    return {
      infoList: '',
      progressBarWidth: {
        width: '0.10rem'
      },
      fullScreenShow: this.$route.query.operation == 'big' ? true : false,
      videoWidth: '100%',
      videoHeight: '100%',
      controlFlag: true,
      second: 0,
      timer: '',
      exhibition: '',
      voiceLocaPath: '',
      imgIndx: 0,
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
  watch: {
  //   info(val) {
  //     console.log(val)
  //     this.exhibition = val.imgUrlList[0].localPath,
  //     this.voiceLocaPath = val.voiceUrlList.length > 0 ? val.voiceUrlList[0].localPath : ''
  //     this.infoList = val;
  //     this.timeupdate(val);
    // }
    'info': {
      handler(n, o) {
        console.log(n)
        if(n) {
          this.exhibition = n.imgUrlList[0].localPath,
          this.voiceLocaPath = n.voiceUrlList.length > 0 ? n.voiceUrlList[0].localPath : ''
          this.infoList = n;
          this.play()
          this.timeupdate(n);
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted () {
    // this.play()
    clearInterval(this.timer);
    this.infoList= this.info;
    this.viewRouterName = this.routePath.filter(item => item.type == JSON.parse(JSON.parse(jsBridge.getAppData()).appType).viewType)[0];
    this.timer = '';
    if(this.$route.query.operation == 'big') {
      this.infoList =this.$route.params.data
      console.log(this.infoList, 111)
      this.timeupdate (this.infoList)
    } else {
       this.infoList && this.timeupdate(this.infoList)
    }
    // if(this.controlFlag&&this.fullScreenShow) {
    //   this.timer = setTimeout(() => {
    //     this.controlFlag = false
    //     clearTimeout(this.timer)
    //     this.timer = '';
    //   }, 10000);
    // }
  },
  
  methods: {
    imgError(e) {
      if(e.type == 'error') {
        this.videoError = true
      }
    },
    clearScreen() {
      this.fullScreenShow ? this.controlFlag = !this.controlFlag : '';
    },
    timeupdate (val) {
      if( this.timer) return;
      try {
        this.$refs.audio.play();
      } catch (error) {
        
      }
      // console.log(this.$refs.progressBar.offsetWidth,this.$refs.progressBar.parentElement.offsetWidth)
      // console.log(this.infoList.timeInterval*this.infoList.imgUrlList.length)
      let that = this
      this.timer = setInterval(()=> {
        if(this.second == val.timeInterval*this.imgIndx) {
          this.exhibition = this.infoList.imgUrlList[this.imgIndx].localPath;
          this.imgIndx++
        }
        this.second++
        this.progressBarWidth.width = parseInt(this.$refs.progressBar.parentElement.offsetWidth * (this.second / (this.infoList.timeInterval*this.infoList.imgUrlList.length))) + 'px';
        if(this.infoList.timeInterval*this.infoList.imgUrlList.length <= this.second) {
          // clearInterval(this.timer);
          this.play()
        }
      },1000)      
    },
    // 重复播放
    play() {
      clearInterval(this.timer)
      this.timer = '';
      this.second = 0;
      this.imgIndx =0;
      this.timeupdate(this.infoList);
    },
    requestFullScreen () {
      this.$router.push({ name: 'publicity-fullScreen', query: { operation: 'big', id: this.$route.query.id, type: 2,  goback: this.goback  }, params: { data: this.infoList }})
      this.fullScreenShow = true;
      this.videoWidth = "100%";
    },
    cancelFullScreen() {
      if(this.$route.query.goback) {
        this.$router.go(-1);
        return;
      }
      this.$router.push({ name: this.viewRouterName.name, query: { id: this.$route.query.id, index: this.viewRouterName.index, play: 'play' }})
      this.fullScreenShow = false;
      this.videoWidth = "100%"
    },
  },
   beforeDestroy(){
    if (this.timer) {
      clearInterval(this.timer); // 在Vue实例销毁前，清除我们的定时器
    }
  }
}
</script>

<style lang="scss" scope>
.video {
  position: relative;
  width: 100%;
  height: 100%;
  .video-nav-nar{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    background:rgba(0,0,0,0.6);
    z-index: 1001;
  }
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
  z-index: 100;
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