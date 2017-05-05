// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

import 'bootstrap/dist/css/bootstrap.css'
import 'jquery/dist/jquery.min.js'
//import 'bootstrap/dist/js/bootstrap.js'
import Vue from 'vue'
import App from './App'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
