<template>
    <div class="ratings" ref="ratings">
        <div class="ratings-content">
            <div class="overview">
                <div class="overview-left">
                    <h1 class="score">{{seller.score}}</h1>
                    <div class="title">综合评分</div>
                    <div class="rank">高于周边商家{{seller.rankRate}}%</div>
                </div>
                <div class="overview-right">
                    <div class="score-wrapper">
                        <span class="title">服务态度</span>
                        <star :size="36" :score="seller.serviceScore"></star>
                        <span class="score">{{seller.serviceScore}}</span>
                    </div>
                    <div class="score-wrapper">
                        <span class="title">商品评分</span>
                        <star :size="36" :score="seller.foodScore"></star>
                        <span class="score">{{seller.foodScore}}</span>
                    </div>
                    <div class="score-wrapper">
                        <span class="title">送达时间</span>
                        <span class="time">{{seller.deliveryTime}}分钟</span>
                    </div>
                </div>
            </div>
            <split></split>
            <ratingselect :selectType="selectType" :onlyContent="onlyContent" :ratings="ratings" @clickType="clickType" @clickContent="toggleContent"></ratingselect>
            <div class="rating-wrapper">
                <ul>
                    <li v-for="rating in ratings" class="rating-item border-1px" v-show="needShow(rating.rateType,rating.text)">
                        <div class="avatar">
                            <img :src="rating.avatar" width="28" height="28" alt="" />
                        </div>
                        <div class="content">
                            <h1 class="name">{{rating.username}}</h1>
                            <div class="star-wrapper">
                                <star :size="24" :score="rating.score"></star>
                                <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
                            </div>
                            <p class="text">{{rating.text}}</p>
                            <div class="recommend" v-show="rating.recommend && rating.recommend.length">
                                <span class="icon-thumb_up"></span>
                                <span v-for="item in rating.recommend" class="item">{{item}}</span>
                            </div>
                            <div class="time">{{rating.rateTime | formatDate}}</div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import BScroll from 'better-scroll';
    import star from './../star/star.vue';
    import {formatDate} from './../../common/js/date.js';
    import split from './../split/split.vue';
    import ratingselect from './../ratingselect/ratingselect.vue'
    var positive = 0;
    var negative = 1;
    var all = 2;
    export default{
        props: {
            seller: {
                type: Object
            }
        },
        data() {
            return {
                ratings: [],
                selectType: positive,
                onlyContent: true 
            }  
        },
        created() {
            this.$http.get('./../../../static/data.json').then(function(response){
                this.ratings = response.body.ratings;
                this.$nextTick(function() {
                    this._initScroll();
                })
            });
        },
        components: {
            star,split,ratingselect
        },
        methods: {
            _initScroll() {
                var that = this;
                this.scroll = new BScroll(this.$refs.ratings,{
                    click: true
                });
            },
            clickType(type) {
                console.log(type);
                this.selectType = type;
            },
            toggleContent() {
                this.onlyContent = !this.onlyContent;
            },
            needShow(type,text) {
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
    .ratings
        position: absolute
        top: 174px
        bottom: 0
        width: 100%
        left: 0
        overflow: hidden
        .overview
            display: flex
            padding: 18px 0
            .overview-left
                flex: 0 0 137px;
                width: 137px
                text-align: center
                border-right: 1px solid rgba(7,17,27 .1)
                @media only screen and (max-width: 320px)
                    flex: 0 0 120px
                    width: 120px
                .score
                    font-size: 24px
                    color: rgb(255,153,0)
                    line-height: 28px
                .title
                    font-size: 12px
                    color: rgb(7,17,27)
                    line-height: 12px
                    margin-top: 6px
                    margin-bottom: 8px
                .rank
                    font-size: 10px
                    color: rgb(147,153,159)
                    line-height: 10px
            .overview-right
                flex: 1
                padding:6px 0 6px 24px
                @media only screen and (max-width: 320px)
                    padding-left: 6px
                .score-wrapper
                    font-size: 0
                    margin-bottom: 8px
                    .title
                        display: inline-block
                        font-size: 12px
                        color: rgb(7,17,27)
                        vertical-align: top
                        line-height: 18px
                    .star
                        display: inline-block
                        margin: 0 12px
                    .score
                        display: inline-block
                        font-size: 12px
                        color: rgb(255,153,0)
                        line-height: 18px
                    .time
                        font-size: 12px
                        color: rgb(147,153,159)
                        line-height: 18px
                        margin-left: 12px      
        .rating-wrapper
            padding: 0 18px
            .rating-item
                display: flex
                padding: 18px 0
                border-1px(rgba(7,17,27,.1))
                .avatar
                    flex: 0 0 28px
                    width: 28px
                    margin-right: 12px
                    img
                        border-radius: 50%
                .content
                    position: relative
                    flex: 1
                    .name
                        fong-size: 10px
                        color: rgb(7,17,27)
                        line-height: 12px
                        margin-bottom: 4px
                    .star-wrapper
                        margin-bottom: 6px
                        font-size: 0
                        .star
                            display: inline-block
                            vertical-align: top
                            margin-right: 6px
                        .delivery
                            display: inline-block
                            font-size: 10px
                            font-weight: 200
                            color: rgb(147,153,159)
                            line-height: 12px
                .text
                    font-size: 12px
                    color: rgb(7,17,27)
                    line-height: 18px
                    margin-bottom: 8px
                .recommend
                    .icon-thumb_up
                        font-size: 12px
                        color: rgb(0,160,220)
                        line-height: 16px
                    .item
                        display: inline-block
                        padding: 0 12px
                        border: 1px solid rgba(7,17,27,.1)
                        font-size: 9px
                        color: rgb(147,153,159)
                        line-height: 16px
                        margin-right: 8px
                        margin-bottom: 8px
                .time
                    position: absolute
                    right: 0
                    font-size: 10px
                    font-weight: 200
                    color: rgb(147,153,159)
                    line-height: 12px
                    top: 0
</style>