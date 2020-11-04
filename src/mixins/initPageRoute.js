import jsBridge from '../utils/app-bridge.js';
export default {
  data() {
    return {
      viewRouterName: '',// 不同视图路由跳转
      routePath: [
        { type: 1, name: 'class-index', index: 3 },
        { type: 2, name: 'interest-index', index: 2 },
        { type: 3, name: 'cooking-food-index', index: 1 },
      ],
    }
  },
  mounted() {
    this.viewRouterName = this.routePath.filter(item => item.type == JSON.parse(JSON.parse(jsBridge.getAppData()).appType).viewType)[0];
  },
}