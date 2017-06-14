<template>
  <div class="cartcontrol">
    <!-- 减号滚动出现、数字渐变的动画 -->
    <transition name="move">
      <!-- 当food.count>0时显示删除按钮 -->
      <div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart">
        <span class="inner icon-remove_circle_outline"></span>
      </div>
    </transition>
    <!-- 当food.count>0时显示数量 -->
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
  </div>
</template>

<script>
// 要用到vue的一个方法来新增对象的属性
import Vue from 'vue'

export default {
  // 接收 shopcart.vue 传入的 food
  props: {
    food: {
      type: Object
    }
  },
  methods: {
    /* 添加食物到购物车 */
    addCart (event) {
      // 与 goods.vue 的 selectMenu()同理，解决BScroll 插件的点击事件的问题，组织浏览器默认的点击事件，避免两次执行
      if (!event._constructed) {
        return
      }
      // 如果没有count属性，就添加
      if (!this.food.count) {
        // 若直接写 this.food.count = 1 来新增属性，是不能实时监听
        // Vue.set(对象, '属性', 默认值) 给对象添加的属性能实时监听
        Vue.set(this.food, 'count', 1)
      } else { // 如果已经有count属性，就+1
        this.food.count++
      }
      this.$emit('add', event.target)
    },
    /* 减少食物 */
    decreaseCart (event) {
      if (!event._constructed) {
        return
      }
      if (this.food.count) {
        this.food.count--
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .cartcontrol
    font-size: 0
    .cart-decrease
      display: inline-block
      // 按钮的icon大小已固定，为了增大用户按钮生效的区域且不改变显示效果，这里用了padding扩大可点击的区域
      padding: 6px
      opacity: 1
      // translate3d(x轴方向的位移 ,y轴方向的位移, z轴方向的位移)
      transform: translate3d(0, 0, 0)
      // name="xx",这里就是 xxe-enter-active，xxe-leave-active
      // xx-enter: 进入过渡的开始状态。在元素被插入时生效，在下一个帧移除。
      // xx-enter-active: 进入过渡的结束状态。在元素被插入时生效，在 transition/animation 完成之后移除。
      // xx-leave: 离开过渡的开始状态。在离开过渡被触发时生效，在下一个帧移除。
      // xx-leave-active: 离开过渡的结束状态。在离开过渡被触发时生效，在 transition/animation 完成之后移除。
      .inner
        display: inline-block
        line-height: 24px
        font-size: 24px
        color: rgb(0, 160, 220)
        transition: all 0.4s linear
        transform: rotate(0)
      &.move-enter-active, &.move-leave-active
        transition: all 0.4s linear
      &.move-enter, &.move-leave-active
        opacity: 0
        transform: translate3d(24px, 0, 0)
        .inner
          transform: rotate(180deg)
    .cart-count
      display: inline-block
      vertical-align: top
      width: 12px
      padding-top: 6px
      line-height: 24px
      text-align: center
      font-size: 10px
      color: rgb(147, 153, 159)
    .cart-add
      display: inline-block
      padding: 6px
      line-height: 24px
      font-size: 24px
      color: rgb(0, 160, 220)
</style>
