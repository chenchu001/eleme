<template>
    <div class="goods">
        <div class="menu-wrapper" ref="menuWrapper">
            <ul>
                <li v-for="(item,index) in goods" class="menu-item border-1px menu-item-hook" :class="{'current':currentIndex===index}" @click="selectMenu(index)">
                    <span class="text">
                        <span v-if="item.type>0" class="icon" :class="classMap[item.type]"></span>
                        {{item.name}}
                    </span>
                </li>
            </ul>
        </div>
        <div class="foods-wrapper" ref="foodsWrapper">
            <ul>
                <li v-for="item in goods" class="food-list food-list-hook">
                    <h1 class="title">{{item.name}}</h1>
                    <ul>
                        <li v-for="food in item.foods" class="food-item border-1px" @click="selectFood(food,$event)">
                            <div class="icon">
                                <img width="57" height="57" :src="food.icon" />
                            </div>
                            <div class="content">
                                <h2 class="name">{{food.name}}</h2>
                                <p class="desc">{{food.description}}</p>
                                <div class="extra">
                                    <span class="count">月售{{food.sellCount}}份</span>
                                    <span>好评率{{food.rating}}%</span>
                                </div>
                                <div class="price">
                                    <span class="now">￥{{food.price}}</span>
                                    <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                                </div>
                                <div class="cartcontrol-wrapper">
                                    <cartcontrol :food="food" @clickTarget = "_dropt"></cartcontrol>
                                </div>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <shopcat ref="shopcat" :selectFoods="selectFoods" :delivery-price = "seller.deliveryPrice" :min-price="seller.minPrice"></shopcat>
        <food :food="selectedFood" ref="food" @clickTarget="_dropt"></food>
    </div>
</template>

<script>
    import BScroll from 'better-scroll';
    import shopcat from './../shopcart/shopcat.vue';
    import cartcontrol from './../cartcontrol/cartcontrol.vue';
    import food from './../food/food.vue';
    export default{
        props: {
            seller: {
                type: Object
            }
        },
        data() {
            return {
                goods: [],
                listHeight: [],
                scrollY: 0,
                selectedFood: {}
            }
        },
        created() {
            this.$http.get('http://www.banmago.cn/chenchu/eleme/static/data.json').then(function(response){
                this.goods = response.body.goods;
                //数据加载完成之后初始化高度
                this.$nextTick(function() {
                    this._initScroll();
                    this._calculateHeight();
                })
            });
            this.classMap = ['decrease','discount','special','invoice','guarantee']
        },
        computed: {
            currentIndex() {
                for(var i=0;i<this.listHeight.length;i++){
                    var height1 = this.listHeight[i];
                    var height2 = this.listHeight[i+1];
                    if(!height2 || (this.scrollY>=height1&&this.scrollY<height2)){
                        return i;
                    }
                }
                return 0;
            },
            selectFoods() {
                var foods = [];
                this.goods.forEach(function(good) {
                    good.foods.forEach(function(food) {
                        if(food.count){
                            foods.push(food);
                        }
                    })
                })
                return foods;
            }
        },
        methods: {
            _initScroll() {
                var that = this;
                this.menuScroll = new BScroll(this.$refs.menuWrapper,{
                    click: true
                });
                this.foodsScroll = new BScroll(this.$refs.foodsWrapper,{
                    click: true,
                    //probeType设置参数3代表屏幕滚动时派发scroll事件
                    probeType: 3
                });
                var menuList = this.$refs.menuWrapper.getElementsByClassName('menu-item-hook');
                var totalHeight = this.$refs.menuWrapper.offsetHeight;
                this.foodsScroll.on('scroll', function(pos) {
                    that.scrollY = Math.abs(Math.round(pos.y));
                    for(var i=0;i<that.listHeight.length;i++) {
                        if(that.scrollY > that.listHeight[i]){
                            var el = menuList[i];
                            that.menuScroll.scrollToElement(el,300);
                        }
                    }
                })
            },
            _calculateHeight() {
                var foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
                var height = 0;
                this.listHeight.push(height);
                for(var i=0;i<foodList.length;i++) {
                    var item = foodList[i];
                    height += item.clientHeight;
                    this.listHeight.push(height);
                }
            },
            selectMenu(index) {
                var foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
                var el = foodList[index];
                this.foodsScroll.scrollToElement(el,300);
            },
            _dropt(target) {
                this.$refs.shopcat.drop(target);
            },
            selectFood(food,event) {
                this.selectedFood = food;
                this.$refs.food.show();
            }
        },
        components: {
            shopcat,cartcontrol,food
        }
    }
</script>

<style lang="stylus">
    @import "../../common/stylus/mixin.styl";
    .goods
        display: flex
        position: absolute
        top: 174px
        bottom: 46px
        width: 100%
        overflow: hidden
        .menu-wrapper
            flex: 0 0 80px
            width: 80px
            background: #f3f5f7
            .menu-item
                display: table
                height: 54px
                width: 56px
                padding: 0 12px
                line-height: 14px
                border-1px(rgba(7,17,27,.1))
                &.current
                    position: relative
                    margin-top: -1px
                    z-index: 10
                    background: #fff
                    font-weight: 700
                .icon
                    display: inline-block
                    vertical-align: top
                    width: 12px
                    height: 12px
                    background-size: 12px 12px
                    background-repeat: no-repeat
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
                    vertical-align: middle
                    width: 56px
                    font-size: 12px
        .foods-wrapper
            flex: 1
            .title
                padding-left: 14px
                height: 26px
                line-height: 26px
                border-left: 2px solid #d9dde1
                font-size: 12px
                color: rgb(147,153,159)
                background: #f3f5f7
            .food-item
                display: flex
                margin: 18px
                padding-bottom: 18px
                border-1px(rgba(7,17,27,.1))
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
                        color: rgb(7,17,27)
                    .desc
                        margin-bottom: 8px
                        line-height: 12px
                        font-size: 10px
                        color: rgb(147,153,159)
                    .extra
                        line-height: 10px
                        font-size: 10px
                        color: rgb(147,153,159)
                        .count
                            margin-right: 12px
                    .price
                        font-weight: 700
                        line-height: 24px
                        .now
                            margin-right: 8px
                            font-size: 14px
                            color: #f70a0a
                        .old
                            font-size: 10px
                            color: rgb(147,153,159)
                            line-height: 24px
                    .cartcontrol-wrapper
                        position: absolute
                        right: 0
                        bottom: 12px
</style>