import Vue from 'vue'
import Router from 'vue-router'
import Resource from 'vue-resource'
// import Hello from '@/components/Hello'

// 在 build/webpack.base.conf.js 定义了 components 的地址
// 不然要用 @/components
import goods from 'components/goods/goods'
import ratings from 'components/ratings/ratings'
import seller from 'components/seller/seller'

// 引入并注册 vue-router
Vue.use(Router)

// 引入并注册 vue-resource
Vue.use(Resource)

export default new Router({
  // 全局配置 <router-link> 的默认『激活 class 类名』
  // http://router.vuejs.org/zh-cn/api/options.html
  linkActiveClass: 'active',

  routes: [{
    path: '/',
    redirect: '/goods' // 重定向,进入就显示goods信息
  }, {
    path: '/goods',
    component: goods
  }, {
    path: '/ratings',
    component: ratings
  }, {
    path: '/seller',
    component: seller
  }]
})


