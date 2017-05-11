import Vue from 'vue'
import Router from 'vue-router'
// import Hello from '@/components/Hello'
// import header from '@/components/header/header.vue'
import goods from '@/components/goods/goods'
import ratings from '@/components/ratings/ratings'
import seller from '@/components/seller/seller'

// 引入并注册 vue-router
Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    redirect: '/goods'
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
