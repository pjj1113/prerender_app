<template>
  <div class="full-scree">
    <van-video :goback="goback" :resourcePackage="resourcePackage" v-if="$route.query.type == 1"/>
    <PptPlay :goback="goback"  v-if="$route.query.type == 2" :info="resourcePackage"/>
  </div>
</template>

<script>
import VanVideo from '../../components/BusinessComponent/video'; 
import PptPlay from '../../components/BusinessComponent/pptPlay';
export default {
  components: {
    VanVideo,
    PptPlay
  },
  data() {
    return {
     resourcePackage: this.$route.params.data,
     goback: this.$route.query.goback || ''
    }
  },
  mounted() {

  }
}
</script>

<style lang="scss" scoped>
.full-scree{
  width: 100%;
  height: 100%;
}
</style>