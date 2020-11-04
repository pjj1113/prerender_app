import Vue from 'vue';
import App from './App.vue';
import router from './router';
import touch from 'kim-vue-touch'
import VueBus from 'vue-bus'
import './utils/rem'
import {
  Button,
  Toast,
  Swipe,
  SwipeItem,
  Icon,
  Circle,
  Slider
} from 'vant';
Vue.use(Button).use(Toast).use(Swipe).use(SwipeItem).use(Icon).use(Circle).use(Slider).use(touch).use(VueBus);
Vue.config.productionTip = false;

new Vue({
  router,
  mounted() {
    document.dispatchEvent(new Event('render-event'))
  },
  render: h => h(App)
}).$mount('#app')
