<template>
  <!-- 循环填充星星状态的class -->
  <div class="star" :class="starType">
    <!-- v-for：循环获取 itemClasses() 返回的数组 -->
    <!-- :class="itemClass" 把获取的class加给span -->
    <span v-for="(itemClass,index) in itemClasses" :class="itemClass" class="star-item" key="index"></span>
  </div>
</template>

<script>
  // const 定义常量
  const LENGTH = 5   // 星星个数
  const CLS_ON = 'on'   // 星星的三种状态
  const CLS_HALF = 'half'
  const CLS_OFF = 'off'

  export default {
    // 使用组件时传入的参数
    props: {
      size: {
        type: Number
      },
      score: {
        type: Number
      }
    },
    // 计算
    computed: {
      starType () {
        return 'star-' + this.size
      },
      itemClasses () {
        let result = []  // 存放最终结果的数组
        let score = Math.floor(this.score * 2) / 2 // 通过分数算星星个数
        // 向下取0.5的公式。floor() 执行向下取整
        // floor(3.3 * 2) / 2 = 3 即 3颗全星+2颗无星
        // floor(3.6 * 2) / 2 = 3.5 即 3颗全星+1颗半星+1颗无星
        let hasDecimal = score % 1 !== 0 // 取余不为0则有半星
        let integer = Math.floor(score) // 整数部分
        for (let i = 0; i < integer; i++) { // 设置全星
          result.push(CLS_ON)
        }
        if (hasDecimal) {
          result.push(CLS_HALF)
        }
        while (result.length < LENGTH) { // 循环，补充无星
          result.push(CLS_OFF)
        }
        return result
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .star
    font-size: 0
    .star-item
      display: inline-block
      background-repeat: no-repeat
    // star-xx 不同尺寸的星星
    &.star-48
      .star-item
        width: 20px
        height: 20px
        margin-right: 22px
        background-size: 20px 20px
        &:last-child
          margin-right: 0 // 最后 一个星星没有margin-right
        &.on
          // mixin.styl 里定义的 bg-image()
          bg-image('star48_on') // 全星
        &.half
          bg-image('star48_half')  // 半星
        &.off
          bg-image('star48_off')  // 无星
    &.star-36
      .star-item
        width: 15px
        height: 15px
        margin-right: 6px
        background-size: 15px 15px
        &:last-child
          margin-right: 0
        &.on
          bg-image('star36_on')
        &.half
          bg-image('star36_half')
        &.off
          bg-image('star36_off')
    &.star-24
      .star-item
        width: 10px
        height: 10px
        margin-right: 3px
        background-size: 10px 10px
        &:last-child
          margin-right: 0
        &.on
          bg-image('star24_on')
        &.half
          bg-image('star24_half')
        &.off
          bg-image('star24_off')
</style>
