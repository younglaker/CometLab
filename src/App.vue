<template>
  <div>
    <v-header :seller="seller"></v-header>
    <div class="tab">
      <!-- <router-link> 组件支持用户在具有路由功能的应用中（点击）导航。 通过 to 属性指定目标地址，默认渲染成带有正确链接的 <a> 标签 -->
      <!-- http://router.vuejs.org/zh-cn/api/router-link.html -->
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>

    <!-- <router-view> 组件是一个 functional 组件，渲染路径匹配到的视图组件。<router-view> 渲染的组件还可以内嵌自己的 <router-view>，根据嵌套路径，渲染嵌套组件。 -->
    <!-- http://router.vuejs.org/zh-cn/api/router-view.html -->
    <!-- :seller="seller" 把seller传给下面的组件 -->
    <router-view :seller="seller"></router-view>
  </div>
</template>

<script>
import header from './components/header/header.vue'

// 定义一个常量，表示请求返回正常
const RESP_OK = 1

export default {
  name: 'app',
  data () {
    return {
      seller: {}
    }
  },
  created () {
    this.$http.get('/api/seller').then((response) => {
      // .body 获取 json 数据
      response = response.body

      // 判断请求是否正常
      if (response.status === RESP_OK) {
        this.seller = response.data
        console.log(this.seller)
        // this.seller = Object.assign({}, this.seller, response.data);
      }
    })
  },
  components: {
    'v-header': header
  }
}
</script>

<style lang="stylus">
@import "./common/stylus/mixin.styl"

.tab
  display: flex
  width: 100%
  height: 40px
  line-height: 40px
  border-1px(rgba(7, 17, 27, 0.1))
  .tab-item
    flex: 1
    text-align: center
    & > a
      display: block
      font-size: 14px
      color: rgb(77, 85, 93)
      &.active
        color: rgb(240, 20, 20)
</style>
