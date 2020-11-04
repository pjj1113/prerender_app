<template>
  <div class="player">
    <!-- <NavBar /> -->
    <div class="player-detail">
      <div class="player-left">
        <img @click="$router.push(`/publicity/index${ $route.query.id ? ('?id='+ $route.query.id) : '' }`)" class="server-btn" src="../../assets/img/server_icon.png"/>
       <div class="player-list">
         <div v-if="scrollFlag" class="scroll">
          <span ref="scrollComp"></span>
        </div>
        <div v-if="resourceList.length == 0" class="default-page">
          <img src="../../assets/img/shiping_icon.png"/>
          <span>点击右上角图标，进入<strong>【园所资源库】</strong>下载</span>
        </div>        
         <ul v-if="resourceList.length > 0" ref="list" @scroll.passive="getScroll($event)">
           <li v-for="(item, index) in resourceList"  @click="playVideo(item)" :key="index">
             <div class="list-bj-img"><img :src="item.coverUrl"/></div>
             <span>{{ item.title }}</span>
             <img v-if="$route.query.id? $route.query.id == item.id : index == 0" class="play-being-icon" src="../../assets/img/play_being_icon.png"/>
           </li>
         </ul>
       </div>
      </div>
      <div v-if="resourceList.length == 0" class="default-video-page">
        <img src="../../assets/img/shiping_icon.png"/>
        <span>暂无视频播放</span>
      </div>
      <div v-if="resourceList.length > 0" class="player-right">
        <van-video :resourcePackage="resourcePackage" v-if="contentType == 1"/>
        <PptPlay :resourcePackage="resourcePackage" v-else :info="resourcePackage"/>
      </div>
    </div>
  </div>
</template>
<script>
import NavBar from '../../components/navBar';
import VanVideo from '../../components/BusinessComponent/video'; 
import PptPlay from '../../components/BusinessComponent/pptPlay';
import jsBridge from '../../utils/app-bridge.js';
import { Toast } from 'vant';
export default {
  components: {
    NavBar,
    VanVideo,
    PptPlay
  },
  data () {
    return {
      resourceList: [],
      contentType: '0',
      resourcePackage: '',
      scrollFlag: false,
      viewRouterName: '',
      routePath: [
        { type: 1, name: 'class-index', index: 4 },
        { type: 2, name: 'interest-index', index: 2 },
        { type: 3, name: 'cooking-food-index', index: 1 },
      ],
    }
  },
  mounted () {
    // let list =[{"contentType":2,"coverUrl":"http://resource-fat.7kid.com/7kid/garden/img/202006/avatar_girl.png?x-oss-process=image/resize,w_200,h_200/format,src/quality,Q_50","id":"240711254854222855","imgUrlList":[{"123":"","ext":"png","fileType":"img","id":"240711099689899013","localPath":"http://resource-fat.7kid.com/7kid/garden/img/202006/avatar_girl.png"},{"ext":"png","fileType":"img","id":"240711126692828166","aaa":"","localPath":"http://resource-fat.7kid.com/7kid/garden/img/202006/del_file_bg.png"},{"ext":"png","fileType":"img","id":"240732099756332035","aaa":"","localPath":"http://resource-fat.7kid.com/7kid/garden/img/202006/11111.png"}],"isNeedUpdate":true,"remark":" 这是ppt","schoolId":"204422401314783240","timeInterval":4,"title":"ppt","videoUrlList":[],"voiceUrlList":[{ 'localPath': "http://resource-fat.7kid.com/7kid/garden/img/202006/Innervation.mp3" }]},{"contentType":1,"coverUrl":"http://resource-fat.7kid.com/7kid/garden/img/202006/aaa.mp4?x-oss-process=video/snapshot,t_200,f_jpg,m_fast,ar_auto","id":"240710901584774151","imgUrlList":[],"isNeedUpdate":true,"remark":" 视频111","schoolId":"204422401314783240","timeInterval":0,"title":"视频","videoUrlList":[{"ext":"mp4","fileType":"mp4","id":"240710873902126088","aaa":"","localPath":"http://resource-fat.7kid.com/7kid/garden/img/202006/aaa.mp4"}],"voiceUrlList":[]}]
    this.localMedia = JSON.parse(jsBridge.getLocalMedia());
    //  this.localMedia = list
    this.userInfo = JSON.parse(jsBridge.getAppData())
    this.viewRouterName = this.routePath.filter(item => item.type == JSON.parse(this.userInfo.appType).viewType)[0];
    this.resourceList = this.localMedia;
    if(this.$route.query.play && !this.$route.query.id) {
      this.$router.push({  name: this.viewRouterName.name, query: { id: this.resourceList[0].id }  })
    }
    if(this.$route.query.id){
      this.resourceList.forEach(item => {
        if(this.$route.query.id == item.id) {
          this.playVideo(item)
        }
      })
    } else {
      this.contentType = this.resourceList[0].contentType
      this.contentType == '1' ? this.resourcePackage = this.resourceList[0].videoUrlList : this.resourcePackage = { imgUrlList: this.resourceList[0].imgUrlList, timeInterval: this.resourceList[0].timeInterval, voiceUrlList: this.resourceList[0].voiceUrlList  }
    }
    setTimeout(() => {
      if(this.$refs.list.scrollHeight > this.$refs.list.clientHeight) {
      this.scrollFlag = true
    } else {
      this.scrollFlag = false
    }
    }, 0);
    
  },
  methods: {
    // 播放
    playVideo(val) {
      this.$router.push({ name: this.viewRouterName.name, query: { id: val.id } })
      this.contentType = val.contentType;
      this.contentType == '1' ? this.resourcePackage = val.videoUrlList : this.resourcePackage = { imgUrlList: val.imgUrlList, timeInterval: val.timeInterval, voiceUrlList: val.voiceUrlList  }
    },
    // 滚动
    getScroll (event) {
      let scrollAll = this.$refs.scrollComp.parentElement.offsetHeight - this.$refs.scrollComp.offsetHeight;
      this.$refs.scrollComp.style.top = scrollAll / ((event.target.scrollHeight - event.target.clientHeight) / event.target.scrollTop) + 'rem';
    }
  }
}
</script>
<style lang="scss" scoped>
.player{
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 0 0.10rem 0.40rem;

}
.player-detail {
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 0 0.10rem 0.40rem;
  .player-left {
    position: relative;
    width: 3.40rem;
    height: 8.68rem;
    box-sizing: border-box;
    border-radius: 0.24rem;
    background: #1A2468;
    box-sizing: border-box;
    padding: 0.30rem;
    .server-btn {
      position: absolute;
      width: 0.72rem;
      height: 0.72rem;
      top: 0.07rem;
      left: 0.40rem;
      z-index: 100;
    }
    .player-title {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 0.55rem;
      margin-top: 0.20rem;
      span {
        font-size:0.32rem;
      }
    }
    .player-list {
      width: 100%;
      height: 100%;
      overflow: hidden;
      .scroll {
        position: absolute;
        top: 0.20rem;
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
          border-radius: 0.05rem;
        }
      }
      .default-page {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
        padding: 0 0.20rem;
        img {
          width: 0.80rem;
          height: 0.80rem;
        }
        span {
          font-size:0.22rem;
          font-weight:500;
          color:rgba(105,113,156,1);
          line-height:0.30rem;
          strong {
            color: #FAF391;
          }
        }
      }
      ul {
        height: 100%;
        overflow: auto;
        li {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .play-being-icon {
            position: absolute;
            width: 0.40rem;
            height: 0.35rem;
            bottom: 0.96rem;
            left: 1.20rem;
          }
          .list-bj-img {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 2.80rem;
            height: 1.50rem;
            border-radius:0.08rem;
            overflow: hidden;
            img {
              width:100%;
              height:auto;
            }
          }
          span {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 2.80rem;
            line-height:0.47rem;
            font-size: 0.24rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
  }
  .player-right {
    width: 15.40rem;
    height: 8.68rem;
    border-radius: 0.24rem;
    box-sizing: border-box;
    overflow: hidden;
    margin-left: 0.20rem;
  }
  .default-video-page {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 15.40rem;
    height: 8.68rem;
    border-radius: 0.24rem;
    box-sizing: border-box;
    overflow: hidden;
    margin-left: 0.20rem;
    background:rgba(26,36,104,0.86);
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
</style>