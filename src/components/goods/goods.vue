<template>
  <div>
    <div class="goods">
      <!-- .menu-wrapper 和 .foods-wrapper 两栏布局，menu定宽，foods自适应。采用flex布局 -->
      <!-- 左边分类栏 -->
      <!-- ref 被用来给元素或子组件注册引用信息。如果在普通的 DOM 元素上使用，引用指向的就是 DOM 元素; 如果用在子组件上，引用就指向组件实例。 -->
      <div class="menu-wrapper" ref="menuWrapper">
        <ul>
          <!-- :class="{'current':currentIndex===index}" 表示，若currentIndex（右边食品块的index）等于index（本导航菜单index），则添加.current，使其有高亮效果 -->

          <!-- selectMenu(index,$event) 传递点击事件，为了解决PC浏览器事件重复问题 -->
          <li v-for="(item,index) in goods" class="menu-item" :class="{'current':currentIndex===index}"
              @click="selectMenu(index,$event)">
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
        <!-- 一个优惠分类下所有食品，一个li对应一个优惠分类 -->
        <ul>
          <li v-for="item in goods" class="food-list" ref="foodList">
            <!-- 优惠分类的标题 -->
            <h1 class="title">{{item.name}}</h1>

            <!-- 具体的食品列表，一个li对应一个食品 -->
            <ul>
              <li v-for="food in item.foods" @click="selectFood(food,$event)" class="food-item border-1px">
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
                    <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <cartcontrol @add="addFood" :food="food"></cartcontrol>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <!-- 给组件传值selectFoods（选择的食物）、deliveryPrice（配送费）、minPrice（起送价） -->
      <shopcart ref="shopcart" :selectFoods="selectFoods" :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice"></shopcart>
    </div>
    <!-- <food @add="addFood" :food="selectedFood" ref="food"></food> -->
  </div>
</template>


<script>
// https://github.com/ustbhuangyi/better-scroll
import BScroll from 'better-scroll'
// 购物车组件
import shopcart from 'components/shopcart/shopcart'
import cartcontrol from 'components/cartcontrol/cartcontrol'


// 定义一个常量，表示请求返回正常
const RESP_OK = 1

export default {
  // 接收App.vue <router-view> 进来的seller
  props: {
    seller: {
      type: Object
    }
  },
  data () {
    return {
      goods: [], // 定义goods变量，在created () 里获得api数据
      listHeight: [], // 右侧食品列表，每个分类下食品列表块的高度
      scrollY: 0, // 当前滑动的高度
      selectedFood: {}
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

      // 否则返回0
      return 0
    },
    selectFoods () {
      let foods = []
      this.goods.forEach((good) => {
        good.foods.forEach((food) => {
          if (food.count) {
            foods.push(food)
          }
        })
      })
      return foods
    }
  },
  created () {
    // 存放“优惠分类”的数组，同 header.vue 里的使用方法
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']

    this.$http.get('/api/goods').then((response) => {
      response = response.body
      if (response.status === RESP_OK) {
        this.goods = response.data

        // 在获取数据后执行滑动插件
        // vue 会在更新数据后更新DOM，但是是异步的。导致获取数据后插入 DOM 里，执行 this._initScroll() 时 DOM 还没建好，better-scroll 插件无法获取高度，就不能生效
        // $nextTick() 表示 DOM 更新后的回调，所以在这里面执行 _initScroll() 才有用
        this.$nextTick(() => {
          this._initScroll()
          this._calculateHeight()
        })
      }
    })
  },
  methods: {
    /* 点击左边菜单，右边的食品列表自动滑到相应分类 */
    selectMenu (index, event) {
      // 点击左边菜单是，在移动端，执行的是BScroll 插件的点击事件，在PC端浏览器会多执行一次浏览器自带的点击事件，就会执行两次selectMenu()
      // 自己创建的事件会有_constructed属性（!event._constructed为false），而浏览器自带的事件没有（!event._constructed为true，就退出函数），以此来阻止浏自带事件的执行
      if (!event._constructed) {
        return
      }

      let foodList = this.$refs.foodList
      let el = foodList[index]
      // BScroll 插件的方法：scrollToElement(el, time, offsetX, offsetY, easing)滚动到某个元素，el（必填）表示 dom 元素，time 表示动画时间，offsetX 和 offsetY 表示坐标偏移量，easing 表示缓动函数
      this.foodsScroll.scrollToElement(el, 300)
    },
    selectFood (food, event) {
      if (!event._constructed) {
        return
      }
      this.selectedFood = food
      this.$refs.food.show()
    },
    addFood (target) {
      this._drop(target)
    },
    _drop (target) {
      // 体验优化,异步执行下落动画
      this.$nextTick(() => {
        this.$refs.shopcart.drop(target)
      })
    },
    /* 初始化滑动插件 */
    _initScroll () {
      this.meunScroll = new BScroll(this.$refs.menuWrapper, {
        click: true // 可以点击（BScroll 插件默认阻止点击事件，就不能点击面板进行操作）
      })

      this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
        click: true, // 可以点击
        probeType: 3 // 实时获取滑动的位置
      })

      // BScroll 插件的事件，返回当前位置纵坐标pos
      this.foodsScroll.on('scroll', (pos) => {
        // round 取四舍五入取整，abs 取正数
        this.scrollY = Math.abs(Math.round(pos.y))
      })
    },
    /* 计算每个分类下食品列表总长度，放入数组 */
    _calculateHeight () {
      // foodList表示优惠分类下的块的合集
      let foodList = this.$refs.foodList
      let height = 0

      // 把初始高度0放入第一个，因为currentIndex()计算当前块的index时，要拿第i和i+1块的高度比，当高度为0-第1块高度时，表示在第一块
      this.listHeight.push(height)

      // foodList.length等于优惠分类的个数
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i]

        // 累加来获取每个区间的高度
        // 因为下一个区间的高度基于上一个区间，所以要累加
        height += item.clientHeight
        this.listHeight.push(height)
      }
    }
  },
  components: {
    shopcart,
    cartcontrol
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
