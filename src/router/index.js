import Vue from 'vue';
import VueRouter from 'vue-router';
import Class from '../views/class';
import Interest from '../views/interest';
import Publicity from '../views/publicity';
import Player from '../views/publicity/player';
import FullScreen from '../views/publicity/fullScreen';
import Exhibition from '../views/interest/exhibition';
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/interest/index'
  },
  {
    path: '/class/index',
    name: 'class-index',
    component: () => import('@/views/class'),
    meta: {
      title: '班级'
    }
  },
  {
    path: '/interest/index',
    name: 'interest-index',
    component:() => import('@/views/interest'),
    meta: {
      title: '兴趣班'
    }
  },
  {
    path: '/interest/detail',
    name: 'interest-detail',
    component: () => import('@/views/interest/detail'),
    meta: {
      title: '课程详情'
    }
  },
  {
    path: '/publicity/index',
    name: 'publicity-index',
    component: () => import('@/views/publicity'),
    meta: {
      title: '宣传视图'
    }
  },
  {
    path: '/publicity/player',
    name: 'publicity-player',
    component: () => import('@/views/publicity/player'),
    meta: {
      title: '播放器'
    }
  },
  {
    path: '/publicity/fullScreen',
    name: 'publicity-fullScreen',
    component: () => import('@//views/publicity/fullScreen'),
    meta: {
      title: '全屏播放'
    }
  },
  {
    path: '/cooking-food/index',
    name: 'cooking-food-index',
    component: () => import('@/views/cookingFood/index'),
    meta: {
      title: '食谱'
    }
  },
  {
    path: '/interest/exhibition',
    name: 'interest-exhibition',
    component: () => import('@/views/interest/exhibition'),
  }
]
const originalPush = VueRouter.prototype.push
   VueRouter.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
