import Vue from 'vue'
import Router from 'vue-router'
// import Hello from '@/components/Hello'
// import header from '@/components/header/header.vue'

// 引入并注册 vue-router
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'app'
    }
  ]
})

