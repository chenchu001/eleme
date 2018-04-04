// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import FastClick from 'fastclick'
import App from './App'

//使用路由
Vue.use(VueRouter)
//使用resource
Vue.use(VueResource)
//使用fastclick
FastClick.attach(document.body)

Vue.config.productionTip = false

//创建路由
import header from './components/header/header.vue'
import goods from './components/goods/goods.vue'
import ratings from './components/ratings/ratings.vue'
import seller from './components/seller/seller.vue'
import './common/stylus/base.styl'
import './common/stylus/icon.styl'
import './common/stylus/mixin.styl'

const router = new VueRouter({
    routes: [
        {path: '/', component: goods},
        {path: '/goods', component: goods},
        {path: '/seller', component: seller},
        {path: '/ratings', component: ratings}
    ],
    // mode: 'history',
    base: '/chenchu/vue/',
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  router
})
