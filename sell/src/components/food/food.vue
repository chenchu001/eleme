<template>
    <transition name="move">
        <div v-show="showFlag" class="food" ref="food">
            <div class="food-content">
                <div class="image-header">
                    <img :src="food.image" alt="" />
                    <div class="back">
                        <i class="icon-arrow_lift" @click="hide()"></i>
                    </div>
                </div>
                <div class="content">
                    <h1 class="title">{{food.name}}</h1>
                    <div class="detail">
                        <span class="sell-count">月售{{food.sellCount}}份</span>
                        <span class="rating">好评率{{food.rating}}%</span>
                    </div>
                    <div class="price">
                        <span class="now">￥{{food.price}}</span>
                        <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                    </div>
                    <div class="cartcontrol-wrapper">
                        <cartcontrol :food="food" @clickTarget="_dropt"></cartcontrol>
                    </div>
                    <transition name="fade">
                        <div @click="addFirst" class="buy" v-show="!food.count || food.count === 0">加入购物车</div>
                    </transition>
                </div>
                <split v-show="food.info"></split>
                <div class="info" v-show="food.info">
                    <h1 class="title">商品信息</h1>
                    <p class="text">{{food.info}}</p>
                </div>
                <split></split>
                <div class="rating">
                    <h1 class="title">商品评价</h1>
                    <ratingselect :selectType="selectType" :desc="desc" :onlyContent="onlyContent" :ratings="food.ratings" @clickType="clickType" @clickContent="toggleContent"></ratingselect>
                    <div class="rating-wrapper">
                        <ul v-show="food.ratings && food.ratings.length">
                            <li v-show="needShow(rating.rateType,rating.text)" v-for="(rating,index) in food.ratings" class="rating-item border-1px">
                                <div class="user">
                                    <span class="name">{{rating.username}}</span>
                                    <img :src="rating.avatar" alt="" class="avatar" width="12" height="12" />
                                </div>
                                <div class="time">{{rating.rateTime | formatDate}}</div>
                                <p class="text">
                                    <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>{{rating.text}}
                                </p>
                            </li>
                        </ul>
                        <div class="no-rating" v-show="!food.ratings || !food.ratings.length">
                            暂无评价
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    import BScroll from 'better-scroll';
    import Vue from 'vue';
    import {formatDate} from './../../common/js/date.js';
    import cartcontrol from './../cartcontrol/cartcontrol.vue';
    import split from './../split/split.vue';
    import ratingselect from './../ratingselect/ratingselect.vue';

    var positive = 0;
    var negative = 1;
    var all = 2;

    export default{
        props: {
            food: {
                type: Object
            }
        },
        data() {
            return {
                showFlag: false,
                selectType: all,
                onlyContent: false,
                desc: {
                    all: '全部',
                    positive: '推荐',
                    negative: '吐槽'
                }
            }
        },
        methods: {
            show() {
                this.showFlag = true;
                this.$nextTick(function() {
                    if(!this.scroll) {
                        this.scroll = new BScroll(this.$refs.food,{
                            click: true
                        });
                    }else{
                        this.scroll.refresh();
                    }
                })
            },
            hide() {
                this.showFlag = false;
            },
            _dropt() {
               this.$emit('clickTarget',event.target);
            },
            addFirst(event) {
                this.$emit('clickTarget',event.target);
                Vue.set(this.food,'count',1);
            },
            clickType(type) {
                this.selectType = type;
            },
            toggleContent() {
                this.onlyContent = !this.onlyContent;
            },
            needShow(type,text){
                if(this.onlyContent && !text){
                    return false;
                }
                if(this.selectType === all) {
                    return true;
                }else{
                    return type === this.selectType;
                }
            }
        },
        components: {
            cartcontrol,split,ratingselect
        },
        filters: {
            formatDate(time) {
                var date = new Date();
                return formatDate(date,'yyyy-MM-dd hh:mm');
            } 
        }
    }
</script>

<style lang="stylus">
    @import "../../common/stylus/mixin.styl";
    .food
        position: fixed
        left: 0
        top: 0
        z-index: 20
        background: #fff
        width: 100%
        bottom: 48px
        transition: all .4s linear
        &.move-enter,&.move-leave-to
            transform: translate3d(100%,0,0)
        .image-header
            position: relative
            width: 100%
            height: 0
            padding-top: 100%
            img
                position: absolute
                top: 0
                left: 0
                width: 100%
                height: 100%
            .back
                position: absolute
                top: 10px
                left: 0
                .icon-arrow_lift
                    display: block
                    padding: 10px
                    font-size: 20px
                    color: #fff
        .content
            padding: 18px
            position: relative
            .title
                line-height: 14px
                margin-bottom: 8px
                font-size: 14px
                font-weight: 700
                color: rgb(7,17,27)
            .detail
                margin-bottom: 18px
                line-height: 10px
                font-size: 0
                .sell-count,.rating
                    font-size: 10px
                    color: rgb(147,153,159)
                .sell-count
                    margin-right: 12px
            .price
                font-weight: 700
                line-height: 24px
                .now
                    margin-right: 8px
                    font-size: 14px
                    color: rgb(240,20,20)
                .old
                    font-size: 10px
                    color: rgb(147,153,159)
                    line-height: 24px
            .cartcontrol-wrapper
                position: absolute
                right: 12px
                bottom: 12px
            .buy
                position: absolute
                right: 18px
                bottom: 18px
                z-index: 10
                height: 24px
                line-height: 24px
                padding: 0 12px
                box-sizing: border-box
                font-size: 10px
                border-radius: 12px
                color: #fff
                background: rgb(0,160,220)
                transition: all .2s linear
                &.fade-enter-active,&.fade-leave-active
                    opacity: 1
                &.fade-enter,&.fade-leave-to
                    opacity: 0
        .info
            padding: 18px
            .title
                line-height: 14px
                margin-bottom: 6px
                font-size: 14px
                color: rgb(7,17,27)
            .text
                font-size: 12px
                line-height: 24px
                padding: 0 8px
                color: rgb(77,85,93)
        .rating
            padding-top: 18px
            .title
                line-height: 14px
                font-size: 14px
                color: rgb(7,17,27)
                margin-left: 18px
            .rating-wrapper
                padding: 0 18px
                .rating-item
                    position: relative
                    padding: 16px 0
                    border-1px(rgba(7,17,27,.1))
                    .user
                        position: absolute
                        right: 0
                        top: 16px
                        font-size: 0
                        line-height: 12px
                        font-size: 0
                        .name
                            display: inline-block
                            font-size: 10px
                            color: rgb(147,153,159)
                            line-height: 12px
                            vertical-align: top
                            margin-right: 6px
                        .avatar
                            display: inline-block
                            border-radius: 50%
                    .time
                        font-size: 10px
                        color: rgb(147,153,159)
                        line-height: 12px
                    .text
                        line-height: 16px
                        font-size: 12px
                        color: rgb(7,17,27)
                        .icon-thumb_up,.icon-thumb_down
                            line-height: 24px
                            margin-right: 4px
                            font-size: 12px
                        .icon-thumb_up
                            color: rgb(0,160,200)
                        .icon-thumb_down
                            color: rgb(147,153,159)
                .no-rating
                    padding: 16px 0
                    font-size: 12px
                    color: rgb(147,153,159)
</style>