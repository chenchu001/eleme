<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <router-link to="/" exact>商品</router-link>
      <router-link to="/ratings">评论</router-link>
      <router-link to="/seller">商家</router-link>
    </div>
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import header from './components/header/header.vue'
import {urlParse} from './common/js/util.js'

export default {
  name: 'App',
  data() {
    return {
      seller: {
        id: function() {
          var queryParam = urlParse();
          return queryParam.id;
        }()
      }
    }
  },
  created() {
    this.$http.get('./../static/data.json').then(function(response){
      // console.log(response.body.seller);
      this.seller = response.body.seller;
    })
  },
  components: {
    'v-header':header
  }
}
</script>

<style lang="stylus">
  @import "./common/stylus/mixin.styl"
  #app
    .tab
      display: flex
      width: 100%
      height: 40px
      line-height: 40px
      // border-bottom: 1px solid rgba(7,17,27,.1)
      border-1px(rgba(7,17,27,.1))
      a
        flex: 1
        text-align: center
        color: rgb(77,85,93)
        &.router-link-active
          color: red
</style>
