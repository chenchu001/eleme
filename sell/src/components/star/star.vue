<template>
    <div class="star" :class="starType">
        <span v-for="itemClass in itemClasses" :class="itemClass" class="star-item"></span>
    </div>
</template>

<script>
    var length = 5;
    var cls_on = "on";
    var cls_half = "half";
    var cls_off = "off";
    export default{
        props: {
            size: {
                type: Number
            },
            score: {
                type: Number
            }
        },
        computed: {
            starType() {
                return 'star-' + this.size;
            },
            itemClasses() {
                var result = [];
                var scroe = Math.floor(this.score*2) / 2;
                var integer = Math.floor(scroe);
                var hasDecimal = scroe%1 !== 0;
                for(var i=0;i<integer;i++){
                    result.push(cls_on);
                }
                if(hasDecimal){
                    result.push(cls_half);
                }
                while(result.length < length) {
                    result.push(cls_off);
                }
                return result;
            }
        }
    }
</script>

<style lang="stylus">
    @import "../../common/stylus/mixin.styl";
    .star
        font-size: 0
        .star-item
            display: inline-block
            background-repeat: no-repeat
        &.star-48
            .star-item
                width: 20px
                height: 20px
                margin-right: 22px
                background-size: 20px 20px
                &:last-child
                    margin-right: 0
                &.on
                    bg-image('star48_on')
                &.half
                    bg-image('star48_half')
                &.off
                    bg-image('star48_off')
        &.star-36
            .star-item
                width: 15px
                height: 15px
                margin-right: 6px
                background-size: 15px 15px
                &:last-child
                    margin-right: 0
                &.on
                    bg-image('star36_on')
                &.half
                    bg-image('star36_half')
                &.off
                    bg-image('star36_off')
        &.star-24
            .star-item
                width: 10px
                height: 10px
                margin-right: 3px
                background-size: 10px 10px
                &:last-child
                    margin-right: 0
                &.on
                    bg-image('star24_on')
                &.half
                    bg-image('star24_half')
                &.off
                    bg-image('star24_off')
</style>