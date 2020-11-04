<template>
  <div class="publicity">
    <nav-bar />
    <div class="centent">
      <div class="resource">
        <div class="go-back-btn" @click="$router.push({  name: viewRouterName.name, query: { index: viewRouterName.index, play : 'play' } })"><img src="../../assets/img/return_play_icon.png"/></div>
        <div class="group-btn">
          <span :class="{ active_btn: resource_dir }"
                @click="findClassBrand"><img v-if="resource_dir" src="../../assets/img/yun_icon_on.png"/> <img v-if="!resource_dir" src="../../assets/img/yun_icon_off.png"/>园所资源库</span>
          <strong :class="{ active_btn: !resource_dir }"
                  @click="getLocalMedia"><img v-if="resource_dir" src="../../assets/img/download_off_icon.png"/><img v-if="!resource_dir" src="../../assets/img/download_on_icon.png"/>本地</strong>
        </div>
        <div class="capacity">
          <i><strong ref="memoryUse" :style="memoryTotalWidth"></strong></i>
          <span>{{ memoryUse }}G/{{ memoryTotal }}G</span>
        </div>
        <div v-if="(memoryUse/memoryTotal).toFixed(2)>=0.8" class="memory-hint">提示：剩余空间不足，为了班牌系统能够正常使用，请及时清理不需要的资源</div>
      </div>
      <div class="resource-details">
        <ul v-if="localList.length > 0 || resource_dir">
          <li v-for="(item, index) in downloadList"
           @click.stop.prevent="download(item, index)"        
              :key="index">
            <div class="show-img">
              <div class="show-img-coverUrl">
                <img :src="item.coverUrl" />
              </div>
              <img v-if="$route.query.id? $route.query.id == item.id : index == 0" class="play-being-icon" :src="exit_icon"/>
              <img v-if="($route.query.id? $route.query.id != item.id : index != 0) && !item.isNeedUpdate"  class="play-being-icon" :src="playResources_icon"/>
              <div class="download-btn" v-if="resource_dir&&item.isNeedUpdate">
                <div class="download-btn-content">
                  <span><b v-if="item.flagProgress">{{ !item.isAwaitDownload && `${ item.progressValue }%` || '等待中…' }}</b><img v-else src="../../assets/img/download_icon.png" /></span>
                  <strong ><i>{{ (item.size/(1024*1024)).toFixed(2) }}M</i></strong>
                </div>
              </div>
              <div v-if="!item.isNeedUpdate" class="del-file">
                <span @click.stop="deleteFile(item,index)"></span>
                <img  @click.stop="deleteFile(item,index)" src="../../assets/img/del_icon.png" />
              </div>
            </div>
            <div class="show-title">
              <span>{{ item.title }}</span>
              <strong>{{ (item.size/(1024*1024)).toFixed(2) }}M</strong>
            </div>
          </li>
        </ul>
        <div v-else class="video-vanish">
          <img src="../../assets/img/shiping_icon.png"/>
          <span>您尚未下载视频到本地</span>
        </div>
      </div>
      <div v-if="shadeShow"
           class="popup-del-file">
        <img src="../../assets/img/del_icon.png" />
        <span>确认清理文件?</span>
        <div class="popup-del-file-btn">
          <i @click="shadeShow=false">取消</i>
          <b @click.stop="delFile()">清理</b>
        </div>
      </div>
    </div>
    <div v-if="shadeShow" class="shade-box"></div>
  </div>
</template>

<script>
import NavBar from '../../components/navBar';
import jsBridge from '../../utils/app-bridge.js';
import api from '../../api';
import { Toast } from 'vant'
export default {
  data () {
    return {
      resource_dir: true,
      shadeShow: false,
      resourceList: '',
      downloadList: '',
      progress: '0',
      timer: '',
      localDBInfo: '',
      allFileList: [],
      localList: [],
      progressIndex: '',
      progressState: '',
      waitDownloadList:[],
      isDownloadFlag: false,
      memoryTotal: 1,
      memoryUse: 1,
      memoryTotalWidth: { width: '0.10rem' },
      exit_icon: require('../../assets/img/play_being_icon.png'),
      playResources_icon: require('../../assets/img/return_play_icon.png'),
      localMedia: [],
      viewRouterName: '',// 不同视图路由跳转
      appType: '',
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
    this.getLocalMemory();
    this.findClassBrand();

    this.appType = JSON.parse(JSON.parse(jsBridge.getAppData()).appType)
    this.viewRouterName = this.routePath.filter(item => item.type == this.appType.viewType)[0];
    // let list =[{"contentType":2, isNeedUpdate: false, "coverUrl":"http://resource-fat.7kid.com/7kid/garden/img/202006/avatar_girl.png?x-oss-process=image/resize,w_200,h_200/format,src/quality,Q_50","id":"240711254854222855","imgUrlList":[{"123":"","ext":"png","fileType":"img","id":"240711099689899013","localPath":"http://resource-fat.7kid.com/7kid/garden/img/202006/avatar_girl.png"},{"ext":"png","fileType":"img","id":"240711126692828166","aaa":"","localPath":"http://resource-fat.7kid.com/7kid/garden/img/202006/del_file_bg.png"},{"ext":"png","fileType":"img","id":"240732099756332035","aaa":"","localPath":"http://resource-fat.7kid.com/7kid/garden/img/202006/11111.png"}],"isNeedUpdate":true,"remark":" 这是ppt","schoolId":"204422401314783240","timeInterval":4,"title":"ppt","videoUrlList":[],"voiceUrlList":[{ 'localPath': "http://resource-fat.7kid.com/7kid/garden/img/202006/Innervation.mp3" }]},{"contentType":1,"coverUrl":"http://resource-fat.7kid.com/7kid/garden/img/202006/aaa.mp4?x-oss-process=video/snapshot,t_200,f_jpg,m_fast,ar_auto","id":"240710901584774151","imgUrlList":[],"isNeedUpdate":false,"remark":" 视频111","schoolId":"204422401314783240","timeInterval":0,"title":"视频","videoUrlList":[{"ext":"mp4","fileType":"mp4","id":"240710873902126088","aaa":"","localPath":"http://resource-fat.7kid.com/7kid/garden/img/202006/aaa.mp4"}],"voiceUrlList":[]},{"contentType":2, isNeedUpdate: false, "coverUrl":"http://resource-fat.7kid.com/7kid/garden/img/202006/avatar_girl.png?x-oss-process=image/resize,w_200,h_200/format,src/quality,Q_50","id":"240711254854222855","imgUrlList":[{"123":"","ext":"png","fileType":"img","id":"240711099689899013","localPath":"http://resource-fat.7kid.com/7kid/garden/img/202006/avatar_girl.png"},{"ext":"png","fileType":"img","id":"240711126692828166","aaa":"","localPath":"http://resource-fat.7kid.com/7kid/garden/img/202006/del_file_bg.png"},{"ext":"png","fileType":"img","id":"240732099756332035","aaa":"","localPath":"http://resource-fat.7kid.com/7kid/garden/img/202006/11111.png"}],"isNeedUpdate":true,"remark":" 这是ppt","schoolId":"204422401314783240","timeInterval":4,"title":"ppt","videoUrlList":[],"voiceUrlList":[{ 'localPath': "http://resource-fat.7kid.com/7kid/garden/img/202006/Innervation.mp3" }]},{"contentType":1,"coverUrl":"http://resource-fat.7kid.com/7kid/garden/img/202006/aaa.mp4?x-oss-process=video/snapshot,t_200,f_jpg,m_fast,ar_auto","id":"240710901584774151","imgUrlList":[],"isNeedUpdate":false,"remark":" 视频111","schoolId":"204422401314783240","timeInterval":0,"title":"视频","videoUrlList":[{"ext":"mp4","fileType":"mp4","id":"240710873902126088","aaa":"","localPath":"http://resource-fat.7kid.com/7kid/garden/img/202006/aaa.mp4"}],"voiceUrlList":[]}]
    // this.downloadList = list
    this.localMedia = JSON.parse(jsBridge.getLocalMedia());
    window.notifyProgress = this.notifyProgress;// 获取下载进度
    window.syncOver = this.syncOver; // 获取数据库列表
    this.localMedia = JSON.parse(jsBridge.getLocalMedia());
  },
  methods: {
    // 存储空间统计
    getLocalMemory() {
      [ this.memoryUse, this.memoryTotal  ] = jsBridge.getLocalMemory().split('/');
      this.memoryTotal = (this.memoryTotal/(1024*1024*1024)).toFixed(2);
      this.memoryUse = (this.memoryUse/(1024*1024*1024)).toFixed(2);
      if((this.memoryUse / this.memoryTotal).toFixed(2) >= 0.8) {
        this.memoryTotalWidth.background = '#F77D04'
      }
      this.memoryTotalWidth.width = parseInt(this.$refs.memoryUse.parentElement.offsetWidth * (this.memoryUse / (this.memoryTotal))) + 'px';
    },
    // 同步到原生本地数据库
    findClassBrand () {
      // this.downloadList=[];
      this.resource_dir = true
      try {
        api.findClassBrand({ model: '0' }).then(res => {
          if(!res.data.list) {
            Toast('请去园所后台上传内容包')
          }
        this.resourceList = res.data.list.map(item => {
          let obj = {
            id: item.id,
            schoolId: item.schoolId,
            contentType: item.contentType,
            model: item.model,
            title: item.title,
            remark: item.remark,
            contentType: item.contentType,
            timeInterval: item.timeInterval,
          }
          if (!!item.imgUrlList) {
            obj.coverUrl = item.imgUrlList[0].thumbnailUrl
            obj.imgUrlList = item.imgUrlList.map(val => ({
              id: val.id,
              url: val.url,
              ext: val.ext,
              fileType: val.fileType,
              size: val.size
            }))
            item.voiceUrlList ? 
            obj.voiceUrlList = item.voiceUrlList.map(val => ({
              id: val.id,
              url: val.url,
              ext: val.ext,
              size: val.size,
              fileType: val.fileType,
            }))
            : ''
          } else {
            obj.coverUrl = item.videoUrlList[0].snapshotUrl
            obj.videoUrlList = item.videoUrlList.map(val => ({
              id: val.id,
              url: val.url,
              ext: val.ext,
              size: val.size,
              fileType: val.fileType,
              snapshotUrl: val.snapshotUrl
            }))
          }
          return obj
        });
        jsBridge.syncData(JSON.stringify(this.resourceList));
        // setTimeout(() => {
        //   this.getLocalMedia();
        // }, 100);
      })
      } catch (error) {
        // jsBridge.toLogin(`/#${this.$route.path }`);
        // try {
        //   if(!JSON.parse(JSON.parse(localStorage.getItem('jsBridgeInfo')).userLoginInfo).token) {
            
        //   }
        // } catch {
        // }
        // this.downloadList.splice(0,this.downloadList.length-1);
      }
    },
    // 获取数据库列表
    syncOver (val) {
      this.allFileList = JSON.parse(val); 
      this.downloadList = this.allFileList.map((item, index)=> {
        // let list = [{"contentType":2,"coverUrl":"http://resource-fat.7kid.com/7kid/garden/img/202006/11111.png?x-oss-process\u003dimage/resize,w_200,h_200/format,src/quality,Q_50","id":"246575945614667781","imgUrlList":[{"ext":"png","fileType":"img","id":"246575779629143046","size":"4450","url":"http://resource-fat.7kid.com/7kid/garden/img/202006/11111.png"},{"ext":"jpg","fileType":"img","id":"246575807923917824","size":"143477","url":"http://resource-fat.7kid.com/7kid/garden/img/202006/1.jpg"},{"ext":"png","fileType":"img","id":"246575852794582018","size":"10010","url":"http://resource-fat.7kid.com/7kid/garden/img/202006/icon_slide.png"}],"isNeedUpdate":true,"remark":" ","schoolId":"204422401314783240","timeInterval":3,"title":"图片7777","voiceUrlList":[{"ext":"mp3","fileType":"mp3","id":"246575914517959686","size":"367612","url":"http://resource-fat.7kid.com/7kid/garden/img/202006/Innervation.mp3"}]}]
        this.$set(item, 'isNeedUpdate', this.allFileList[index].isNeedUpdate)
        this.$set(item, 'flagProgress', item.flagProgress ? true :false)
        this.$set(item, 'progressValue', 0);
        this.$set(item, 'isAwaitDownload', false);
        this.$set(item, 'coverUrl', this.allFileList[index].coverUrl);
        this.$set(item, 'size', this.allFileList[index].totalSize);
        return item;
      })
    },
    // 下载
    download (val,index) {
      if(!val.isNeedUpdate) {
        console.log(2222)
        this.$router.push({ name: this.viewRouterName.name, query: { id: val.id,  index: this.viewRouterName.index ,play: 'play'}, params: { ...val } })
        return
      } else if(this.isDownloadFlag) {
        this.waitDownloadList.push({ content: val, index: index });
        this.downloadList[index].isAwaitDownload = true;
        this.downloadList[index].flagProgress = true;
        return;
      }
      // return;
      jsBridge.download(val.id);
      this.progressIndex = index;
      this.downloadList[index].flagProgress = true;
      // this.getLocalMedia();
      this.isDownloadFlag = true
    },
    deleteFile(val, index) {
      this.delId = val;
      this.shadeShow = true;
      this.progressIndex = index;
    },
    // 删除数据
    delFile () {
      let delFlag = jsBridge.delete(this.delId.id);
      this.shadeShow = false;
      this.downloadList[this.progressIndex].isNeedUpdate = true;
      this.downloadList[this.progressIndex].flagProgress = false;
      this.downloadList[this.progressIndex].progressValue = 0;
      if(this.resource_dir){
        this.findClassBrand()
      }else{
        this.getLocalMedia()
      }

      this.getLocalMemory() 
    },
    // 获取进度
    notifyProgress(val,id) {
      // this.moreFileDowload(val, id)
      this.downloadList[this.progressIndex].progressValue = val;
      this.progressState = val;
      if(val == 100) {
        this.getLocalMemory();
        this.downloadList[this.progressIndex].isNeedUpdate = false;
        this.isDownloadFlag = false;
        if(!this.waitDownloadList[0]) return;
        this.progressIndex = this.waitDownloadList[0].index;
        this.downloadList[this.progressIndex].isAwaitDownload = false;
        this.download(this.waitDownloadList[0].content, this.waitDownloadList[0].index);
        this.waitDownloadList.shift();
      }
      else if(val==-1){
        Toast('下载失败')
         this.downloadList[this.progressIndex].isNeedUpdate = true;
       this.downloadList[this.progressIndex].flagProgress = false;
       this.downloadList[this.progressIndex].progressValue = 0;
        this.isDownloadFlag = false;
        if(!this.waitDownloadList[0]) return;
        this.progressIndex = this.waitDownloadList[0].index;
        this.downloadList[this.progressIndex].isAwaitDownload = false;
        this.download(this.waitDownloadList[0].content, this.waitDownloadList[0].index);
        this.waitDownloadList.shift();
      }
      // Toast(this.downloadList[this.progressIndex].progressValue +id );
    },
    // 获取更新的数据
    getLocalMedia() {
      this.resource_dir = false
      this.localList = JSON.parse(jsBridge.getLocalMedia())
      this.downloadList = this.localList.map((item, index)=> {
        // let list = [{"contentType":2,"coverUrl":"http://resource-fat.7kid.com/7kid/garden/img/202006/11111.png?x-oss-process\u003dimage/resize,w_200,h_200/format,src/quality,Q_50","id":"246575945614667781","imgUrlList":[{"ext":"png","fileType":"img","id":"246575779629143046","size":"4450","url":"http://resource-fat.7kid.com/7kid/garden/img/202006/11111.png"},{"ext":"jpg","fileType":"img","id":"246575807923917824","size":"143477","url":"http://resource-fat.7kid.com/7kid/garden/img/202006/1.jpg"},{"ext":"png","fileType":"img","id":"246575852794582018","size":"10010","url":"http://resource-fat.7kid.com/7kid/garden/img/202006/icon_slide.png"}],"isNeedUpdate":true,"remark":" ","schoolId":"204422401314783240","timeInterval":3,"title":"图片7777","voiceUrlList":[{"ext":"mp3","fileType":"mp3","id":"246575914517959686","size":"367612","url":"http://resource-fat.7kid.com/7kid/garden/img/202006/Innervation.mp3"}]}]
        this.$set(item, 'size', this.localList[index].totalSize);
        return item;
      })
    }
  },
  beforeDestroy() {
  },
}
</script>
<style lang="scss" scope>
.publicity {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 0 .25rem;
  .centent {
    position: absolute;
    display: flex;
    flex-direction: column;
    left: 50%;
    margin-left: -9.10rem;
    width: 18.20rem;
    height: 8.70rem;
    padding: 0.20rem;
    background: #1a2468;
    border-radius: 0.15rem;
    .resource {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 1.40rem;
      .go-back-btn {
        position: absolute;
        left: 0rem;
        top: 0rem;
        height: .54rem;
        line-height: .54rem;
        padding: 0 0.30rem;
        font-size: 0.28rem;
        border-radius: 0.27rem;
        img {
          width: 0.72rem;
          height: 0.72rem;
        }
      }
      .group-btn {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-content: center;
        // width: 300px;
        height: 0.54rem;
        background: rgba(4, 5, 36, 0.37);
        border-radius: 0.27rem;
        span {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0 0.35rem;
          height: 0.54rem;
          color: rgba(11, 207, 241, 1);
          font-size: 0.28rem;
          border-radius: 0.27rem;
          img {
            width: 0.28rem;
            height: 0.28rem;
            margin-right: 0.05rem;
          }
        }
        strong {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 1.40rem;
          height: 0.54rem;
          color: rgba(11, 207, 241, 1);
          font-size: 0.28rem;
          border-radius: 0.27rem;
          font-weight: 400;
          img {
            width: 0.28rem;
            height: 0.28rem;
            margin-right: 0.05rem;
          }
        }
        .active_btn {
          background: rgba(11, 207, 241, 1);
          color: rgba(2, 20, 84, 1);
        }
      }
      .capacity {
        display: flex;
        flex-direction: column;
        width: 3.00rem;
        margin-top: 0.40rem;
        i {
          position: relative;
          width: 3.00rem;
          height: 0.05rem;
          background: rgba(230, 250, 253, 0.3);
          border-radius: 0.11rem;
          strong {
            position: absolute;
            left: 0;
            top: 0;
            width: 1.25rem;
            height: 0.05rem;
            background: rgba(11, 207, 241, 1);
            border-radius: 0.11rem;
          }
        }
        span {
          font-size: 0.18rem;
          margin-top: 0.10rem;
          text-align: right;
        }
      }
      .memory-hint {
        font-size: 0.14rem;
        color:rgba(247,125,4,1);
        margin-top: 0.20rem;
      }
    }
    .resource-details {
      margin: 0.36rem 0;
      height: 6.00rem;
      padding: 0 0.80rem;
      .video-vanish {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
        img {
          position: relative;
          top: -0.5rem;
          width: 1.35rem;
          height: 1.50rem;
        }
        span {
          position:relative;
          top: -0.5rem;
          font-size:0.40rem;
          font-weight:500;
          color:rgba(105,113,156,1);
          line-height:0.56rem;
          margin-top: 0.15rem;
        }
      }
      ul {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        height: 100%;
        width: 100%;
        overflow: auto;
        li {
          position: relative;
          display: flex;
          flex-direction: column;
          width: 3.00rem;
          height: 2.15rem;
          margin: 0.10rem;
          overflow: hidden;

          .show-img {
            position: relative;
            width: 3.00rem;
            height: 1.65rem;
            border-radius: 0.08rem;
            overflow: hidden;
            .play-being-icon {
              position: absolute;
              left: 0;
              top: 0;
              right: 0;
              bottom: 0;
              margin: auto;
              width: 0.40rem;
              height: 0.40rem;
            }
            .show-img-coverUrl {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 3.00rem;
              height: 1.65rem;
              overflow: hidden;
              img {
                width:100%;
                height:auto;
              }
            }
            .download-btn {
              position: absolute;
              left: 0;
              top: 0;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              width: 100%;
              height: 100%;
              background: rgba(22, 33, 100, 0.4);
              z-index: 100;
              .download-btn-content {
                height: 0.8rem;
                display: flex;
                flex-direction: column;
                align-items: center;
                span {
                  display: inline-block;
                  min-width: 0.40rem;
                  min-height: 0.40rem;
                  b {
                    font-size: 0.36rem;
                    font-weight: 400;
                    line-height: 0.50rem;
                  }
                  img {
                    width: 0.40rem;
                    height: 0.40rem;
                  }
                }
                strong {
                  height: 0.40rem;
                  i {
                    font-style: normal;
                    font-size: 0.18rem;
                    font-weight: 400;
                  }
                }
              }
              
            }
            .del-file {
              position: absolute;
              right: 0;
              top: 0;
              width: 0.80rem;
              height: 0.80rem;
              span {
                display: inline-block;
                position: absolute;
                top: -0.55rem;
                right: -0.55rem;
                width: 1.10rem;
                height: 1.10rem;
                transform: rotate(45deg);
                background: rgba(22, 33, 100, 0.4);
                // border: 40px solid rgba(22, 33, 100, 0);
                // border-top-color: rgba(22, 33, 100, 0.4);
                // border-right-color: rgba(22, 33, 100, 0.4);
              }
              img {
                position: absolute;
                right: 0.09rem;
                top: 0.12rem;
                height: 0.20rem;
                width: 0.20rem;
              }
            }
          }
          .show-title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 0.07rem;
            span {
              width: 2.40rem;
              height: 0.47rem;
              font-size: 0.24rem;
              color: rgba(255, 255, 255, 0.85);
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            strong {
              font-size: 0.18rem;
              font-weight: 400;
            }
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
      img {
        width: 0.60rem;
        height: 0.60rem;
      }
      span {
        font-size: 0.32rem;
        margin-top: 0.16rem;
      }
      .popup-del-file-btn {
        display: flex;
        justify-content: space-around;
        width: 100%;
        margin-top: 0.45rem;
        i {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 2.20rem;
          height: 0.54rem;
          background: rgba(26, 51, 143, 0.86);
          border-radius: 0.27rem;
          font-size: 0.28rem;
          letter-spacing: 0.04rem;
        }
        b {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 2.20rem;
          height: 0.54rem;
          background: rgba(11, 207, 241, 1);
          border-radius: 0.27rem;
          font-size: 0.28rem;
          letter-spacing: 0.04rem;
          font-weight: 400;
          color: #081d6a;
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