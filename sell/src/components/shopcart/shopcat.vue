<template>
    <div>
        <div class="shopcat">
            <div class="content">
                <div class="content-left" @click="toggleList">
                    <div class="logo-wrapper">
                        <div class="logo" :class="{'highlight': totalCount>0}">
                            <span class="icon-shopping_cart" :class="{'highlight': totalCount>0}"></span>
                        </div>
                        <div class="num" v-show="totalCount>0">{{totalCount}}</div>
                    </div>
                    <div class="price" :class="{'highlight': totalPrice>0}">{{totalPrice}}元</div>
                    <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
                </div>
                <div class="content-right">
                    <div class="pay" :class="payClass">{{payDesc}}</div>
                </div>
            </div>
            <!-- 小球 -->
            <div class="ball-container">
                <transition v-on:before-enter="beforeEnter" v-on:enter="enter" v-on:after-enter="afterEnter" v-for="(ball,index) in balls" :key="index">
                    <div class="ball" v-show="ball.show">
                        <div class="inner inner-hook"></div>
                    </div>
                </transition>
            </div>
            <!-- 商品展示区域 -->
            <transition name="fold">
                <div class="shopcart-list" v-show="listShow">
                    <div class="list-header">
                        <h1 class="title">购物车</h1>
                        <span class="empty" @click="empty">清空</span>
                    </div>
                    <div class="list-content" ref="listContent">
                        <ul>
                            <li class="food boder-1px" v-for="(food,index) in selectFoods" :key="index">
                                <span class="name">{{food.name}}</span>
                                <div class="price">
                                    <span>￥{{food.price*food.count}}</span>
                                </div>
                                <div class="cartcontrol-wrapper">
                                    <cartcontrol :food="food"></cartcontrol>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </transition>
        </div>
        <transition name="list-mask">
            <div class="list-mask" v-show="listShow" @click="hideList"></div>
        </transition>
    </div>
</template>

<script>
    import BScroll from 'better-scroll';
    import cartcontrol from './../cartcontrol/cartcontrol.vue';
    export default{
        props: {
            selectFoods: {
                type: Array,
                default() {
                    return [];
                }
            },
            deliveryPrice: {
                type: Number
            },
            minPrice: {
                type: Number
            }
        },
        data() {
            return {
                balls: [
                    {
                        show: false
                    },
                    {
                        show: false
                    },
                    {
                        show: false
                    },
                    {
                        show: false
                    },
                    {
                        show: false
                    }
                ],
                dropBall: [],
                fold: true
            }
        },
        computed: {
            //计算总金额
            totalPrice() {
                var total = 0;
                this.selectFoods.forEach((food) => {
                    total += food.price * food.count;
                })
                return total;
            },
            //计算总数
            totalCount() {
                var count = 0;
                this.selectFoods.forEach((food) => {
                    count += food.count;
                })
                return count;
            },
            //起送价格变化
            payDesc() {
                if(this.totalPrice === 0) {
                    return '￥'+ this.minPrice + '元起送';
                }else if(this.totalPrice < this.minPrice) {
                    var diff = this.minPrice - this.totalPrice;
                    return '还差￥' + diff + '元起送';
                }else{
                    return '去结算';
                }
            },
            payClass() {
                if(this.totalPrice < this.minPrice) {
                    return 'not-enough';
                }else{
                    return 'enough';
                }
            },
            listShow() {
                if(!this.totalCount) {
                    this.fold = true;
                    return false;
                }
                var show = !this.fold;
                if(show){
                    if(!this.scroll){
                        this.scroll = new BScroll(this.$refs.listContent,{
                            click: true
                        })
                    }else{
                        this.scroll.refresh();
                    }
                }
                return show;
            }
        },
        methods: {
            drop(el) {
                for(var i=0;i<this.balls.length;i++) {
                    var ball = this.balls[i];
                    if(!ball.show){
                        ball.show = true;
                        ball.el = el;
                        this.dropBall.push(ball);
                        // console.log(this.dropBall);
                        return;
                    }
                }
            },
            beforeEnter(el) {
                var count = this.balls.length;
                while(count--) {
                    var ball = this.balls[count];
                    if(ball.show){
                        //获得点击小球相当于浏览器的位置
                        var rect = ball.el.getBoundingClientRect();
                        //小球要移动的横坐标距离
                        var x = rect.left - 32;
                        //小球要一定的纵坐标距离
                        var y = -(window.innerHeight - rect.top - 22);
                        // el.style.display = "";
                        el.style.webkitTransform = 'translate3d(0,' + y +'px,0)';
                        el.style.transform = 'translate3d(0,'+ y +'px,0)';
                        var inner = el.getElementsByClassName('inner-hook')[0];
                        inner.style.webkitTransform = 'translate3d('+ x +'px,0,0)';
                        inner.style.transform = 'translate3d('+ x +'px,0,0)';
                    }
                }
            },
            enter(el) {
                //进入的时候页面进行重绘
                var rf = el.offsetHeight;
                this.$nextTick(()=>{
                    el.style.webkitTransform = 'translate3d(0,0,0)';
                    el.style.transform = 'translate3d(0,0,0)';
                    let inner = el.getElementsByClassName('inner-hook')[0];
                    inner.style.webkitTransform = 'translate3d(0,0,0)';
                    inner.style.transform = 'translate3d(0,0,0)';
                })
            },
            afterEnter(el) {
                var ball = this.dropBall.shift();
                if(ball){
                    ball.show = false;
                    el.style.display = 'none';
                }
            },
            toggleList() {
                if(!this.totalCount){
                    return;
                }
                this.fold = !this.fold;
            },
            //清空
            empty() {
                this.selectFoods.forEach(function(food) {
                    food.count = 0;
                })
            },
            hideList() {
                this.fold = !this.fold;
            }
        },
        components: {
            cartcontrol
        }
    }
</script>

<style lang="stylus">
    @import "../../common/stylus/mixin.styl";
    .shopcat
        position: fixed
        left: 0
        bottom: 0
        z-index: 50
        width: 100%
        height: 48px
        .content
            display: flex
            background: #141d27
            .content-left
                flex: 1
                font-size: 0
                .logo-wrapper
                    display: inline-block
                    position: relative
                    top: -10px
                    margin: 0 12px
                    padding: 6px
                    width: 56px
                    height: 56px
                    box-sizing: border-box
                    border-radius: 50%
                    vertical-align: top
                    background: #141d27
                    .logo
                        width: 100%
                        height: 100%
                        border-radius: 50%
                        background: #2b343c
                        text-align: center
                        &.highlight
                            background: rgb(0,160,220)
                        .icon-shopping_cart
                            font-size: 24px
                            color: #80858a
                            line-height: 44px
                            &.highlight
                                color: #fff
                    .num
                        position: absolute
                        top: 0
                        right: 0
                        width: 24px
                        height: 16px
                        line-height: 16px
                        text-align: center
                        border-radius: 16px
                        font-size: 9px
                        font-weight: 400
                        color: #fff
                        background: rgb(240,20,20)
                        box-shadow: 0 4px 8px 0 rgba(0,0,0,0.4)
                .price
                    display: inline-block
                    vertical-align: top
                    margin-top: 12px
                    line-height: 24px
                    padding-right: 12px
                    box-sizing: border-box
                    border-right: 1px solid rgba(255,255,255,.1)
                    font-size: 16px
                    font-weight: 700
                    color: rgba(255,255,255,.4)
                    &.highlight
                        color: #fff
                .desc
                    display: inline-block
                    vertical-align: top
                    line-height: 24px
                    margin: 12px 0 0 12px
                    color: rgba(255,255,255,.4)
                    font-size: 10px
            .content-right
                flex: 0 0 105px
                width: 105px
                .pay
                    height: 48px
                    line-height: 48px
                    text-align: center
                    font-size: 12px
                    font-weight: 700
                    color: rgba(255,255,255,.4)
                    background: #2b333b
                    &.not-enough
                        background: #2b333b
                    &.enough
                        background: #00b43c
                        color: #fff
        .ball-container
            .ball
                position: fixed
                left: 32px
                bottom: 22px
                z-index: 200
                transition: all .4s cubic-bezier(0.49,-0.29,0.75,0.41)
                .inner
                    width: 16px
                    height: 16px
                    border-radius: 50%
                    background: rgb(0,160,220)
                    transition: all .4s linear
        .shopcart-list
            position: absolute
            top: 0
            left: 0
            z-index: -1
            width: 100%
            transition: all .5s
            transform: translate3d(0,-100%,0)
            &.fold-enter-active,&.fold-leave-active
                transform: translate3d(0,-100%,0)
            &.fold-enter,&.fold-leave-to
                transform: translate3d(0,0,0)
            .list-header
                height: 40px
                line-height: 40px
                padding: 0 18px
                background: #f3f5f7
                border-bottom: 1px solid rgba(7,17,27,.1)
                .title
                    float: left
                    font-size: 14px
                    color: rgb(7,17,27)
                .empty
                    float: right
                    font-size: 12px
                    color: rgb(0,160,220)
            .list-content
                padding: 0 18px
                max-height: 217px
                background: #fff
                overflow: hidden
                .food
                    position: relative
                    padding: 12px 0
                    box-sizing: borer-box
                    border-1px(rgba(7,17,27,.1))
                    .name
                        line-height: 24px
                        font-size: 14px
                        color: rgb(7,17,27)
                    .price
                        position: absolute
                        right: 90px
                        bottom: 12px
                        line-height: 24px
                        font-size: 14px
                        font-weight: 700
                        color: rgb(240,20,20)
                    .cartcontrol-wrapper
                        position: absolute
                        right: 0
                        bottom: 6px
    .list-mask
        position: fixed
        top: 0
        left: 0
        width: 100%
        height: 100%
        z-index: 40
        background: rgba(7,17,27,0.6)
        backdrop-filter: blur(10px)
        transition: all .3s
        &.list-mask-enter-active,&.list-mask-leave
            opacity: 1
            background: rgba(7,17,27,0.6)
        &.list-mask-enter,&.list-mask-leave-active
            opacity: 0
            background: rgba(7,17,27,0)
</style>