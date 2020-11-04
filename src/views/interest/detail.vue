<template>
  <div class="interest-detail">
    <nav-bar @exitHome="exitHome">
      <template v-slot:header>
        <router-link class="router-index" to="/interest/index">返回</router-link>
      </template>
    </nav-bar>
    <exhibition :courseDetail="courseDetail" :room="habitRoom"/>
  </div>
</template>

<script>
import NavBar from '../../components/navBar';
import Exhibition from './exhibition';
import jsBridge from "../../utils/app-bridge.js";
import api from "../../api";
export default {
  components: {
    NavBar,
    Exhibition
  },
  data() {
    return {
      courseDetail: '',
      habitRoom: '',
      userInfo: ''
    }
  },
  mounted() {
    this.userInfo = JSON.parse(jsBridge.getAppData());
    this.getHabitRoom();
    this.getMovieList();
  },
  methods: {
    exitHome() {
      this.shadeShow = false;
      this.pageIndex = 0;
      this.$refs.swipe.swipeTo(0);
    },
    getMovieList() {
      api.getCourseDetailInfo({ id: this.$route.query.id }).then((res) => {
        this.courseDetail = res.data;
      });
    },
    getHabitRoom(){
      api.getHabitRoomDetail({ placeId: this.userInfo.refId }).then((res) => {
        console.log(21)
        this.habitRoom = res.data;
      });
    },
  },
}
</script>

<style lang="scss" scoped>
.interest-detail {
  .router-index {
    width:2.20rem;
    height: 0.54rem;
    background:rgba(2,24,105,0.86);
    color: #0BCFF1;
    border-radius: 0.27rem;
    font-size:28px;
    text-align: center;
    line-height: 0.54rem;
  }
}
</style>