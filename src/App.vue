<template>
  <div id="app">
    <img src="./assets/logo.png">
    <v-header></v-header>
    <router-view></router-view>
  </div>
</template>

<script>
import header from './components/header/header.vue'

export default {
  name: 'app',
  components: {
    'v-header': header
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
#app
  font-family: 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50
  margin-top: 60px
</style>
