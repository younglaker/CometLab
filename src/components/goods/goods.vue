<template>
  <div>
    <div class="goods">
      <!-- .menu-wrapper 和 .foods-wrapper 两栏布局，menu定宽，foods自适应。采用flex布局 -->
      <!-- 左边分类栏 -->
      <div class="menu-wrapper" ref="menuWrapper">
        <ul>
          <li v-for="(item,index) in goods" class="menu-item" :class="{'current':currentIndex===index}">
          <span class="text border-1px">
            <!-- data.json里，goods/优惠分类/type
                "goods": [
                  {
                    "name": "热销榜",
                    "type": -1,
                    "foods": [...]
                  },
                  {
                    "name": "单人精彩套餐",
                    "type": 2,
                    "foods": [...]
                  },
            ，当type大于1，就有相应的icon显示
            v-show="item.type>0" 当item.type>0时，显示这个span，即icon  -->
            <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
          </span>
          </li>
        </ul>
      </div>

      <!-- 右边食品列表 -->
      <div class="foods-wrapper" ref="foodsWrapper">
        <ul>
          <li v-for="item in goods" class="food-list" ref="foodList">
            <h1 class="title">{{item.name}}</h1>
            <ul>
              <li v-for="food in item.foods" class="food-item border-1px">
                <div class="icon">
                  <img width="57" height="57" :src="food.icon">
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                  </div>
                  <div class="price">
                    <span class="now">￥{{food.price}}</span><span class="old"
                                                                  v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <!-- <shopcart ref="shopcart" ></shopcart> -->
    </div>
    <!-- <food  ref="food"></food> -->
  </div>
</template>


<script>
import BScroll from 'better-scroll'

// 定义一个常量，表示请求返回正常
const RESP_OK = 1

export default {
  props: {
    seller: {
      type: Object
    }
  },
  computed: {
    /* 计算当前位置属于第几个优惠分类 */
    currentIndex () {
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i]
        let height2 = this.listHeight[i + 1]
        // 当在最后一个优惠分类时，heigh2为undefined，所以要!height2使其为true
        // 通过判断scrollY在哪个高度区间内，算出当前index
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i
        }
      }
      return 0
    }
  },
  data () {
    return {
      goods: [], // 定义goods变量，在created () 里获得api数据
      listHeight: [],
      scrollY: 0,
      selectedFood: {}
    }
  },
  created () {
    // 存放“优惠分类”的数组，同 header.vue 里的使用方法
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']

    this.$http.get('/api/goods').then((response) => {
      response = response.body
      if (response.status === RESP_OK) {
        this.goods = response.data
        this.$nextTick(() => {
          this._initScroll()
          this._calculateHeight()
        })
      }
    })
  },
  methods: {
    _initScroll () {
      this.meunScroll = new BScroll(this.$refs.menuWrapper, {
        click: true
      })

      this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
        click: true,
        probeType: 3
      })

      this.foodsScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y))
      })
    },
    _calculateHeight () {
      let foodList = this.$refs.foodList
      let height = 0
      this.listHeight.push(height)
      console.log(foodList)
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i]
        console.log(item)
        height += item.clientHeight
        this.listHeight.push(height)
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  // goods 部分在页面中间
  .goods
    display: flex // flex布局
    position: absolute
    top: 174px // 除去header部分
    bottom: 46px // 除去底部购物车
    width: 100%
    overflow: hidden
    .menu-wrapper
      // flex: none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]
      // flex-grow: 放大比例，默认为0，即如果存在剩余空间，也不放大
      // flex-shrink: 缩小比例，默认为1，即如果空间不足，该项目将缩小
      // flex-basis: 在分配多余空间之前，项目占据的主轴空间（main size）。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为auto，即项目的本来大小。可以设为跟width或height属性一样的值（比如350px），则项目将占据固定空间
      flex: 0 0 80px
      width: 80px // 写宽度，保证在安卓浏览器下兼容性
      background: #f3f5f7
      .menu-item
        display: table // 使内容垂直居中
        height: 54px
        width: 56px
        padding: 0 12px
        line-height: 14px
        &.current
          position: relative
          z-index: 10
          margin-top: -1px
          background: #fff
          font-weight: 700
          .text
            border-none()
        .icon
          display: inline-block
          vertical-align: top
          width: 12px
          height: 12px
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat
          // 同 header.vue，不同的class选择不同的icon图
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')
        .text
          display: table-cell
          width: 56px
          vertical-align: middle
          border-1px(rgba(7, 17, 27, 0.1))
          font-size: 12px
    .foods-wrapper
      flex: 1
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147, 153, 159)
        background: #f3f5f7
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom: 0
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex: 1
          .name
            margin: 2px 0 8px 0
            height: 14px
            line-height: 14px
            font-size: 14px
            color: rgb(7, 17, 27)
          .desc, .extra
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .desc
            line-height: 12px
            margin-bottom: 8px
          .extra
            .count
              margin-right: 12px
          .price
            font-weight: 700
            line-height: 24px
            .now
              margin-right: 8px
              font-size: 14px
              color: rgb(240, 20, 20)
            .old
              text-decoration: line-through
              font-size: 10px
              color: rgb(147, 153, 159)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 12px
</style>
