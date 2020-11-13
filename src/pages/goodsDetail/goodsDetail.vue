<template>
    <div class="goodsDetail fullscreen">
        <Back></Back>

        <van-swipe
            class="my-swipe cover"
            :autoplay="3000"
            indicator-color="white"
            @change="coverChange"
        >
            <van-swipe-item>1</van-swipe-item>
            <van-swipe-item>2</van-swipe-item>
            <template #indicator>
                <div class="custom-indicator">{{ currentCover + 1 }}/2</div>
            </template>
        </van-swipe>

        <div class="goodsInfo">
            <div class="mainTitle multipleLinesOmitted">
                纯牛奶纯牛奶纯牛奶纯牛奶纯牛奶纯牛奶纯牛奶纯牛奶纯牛奶纯牛奶纯牛奶纯牛奶纯牛奶纯牛奶
            </div>
            <div class="subTitle">纯天然产品</div>
            <div class="priceAndsalesVolume">
                <div class="noDiscount">
                    <span>￥</span>50.00
                </div>
                <!-- <div class="haveDiscount">
                    <span>￥</span>50.00
                    <span>价格￥11.00</span>
                </div> -->
                <div class="salesVolume">已售1份</div>
            </div>
        </div>
    </div>
</template>

<script>
import Back from "../../components/backToPrevious/backToPrevious";

export default {
    data() {
        return {
            currentCover: 0,
        };
    },
    components: {
        Back,
    },
    methods: {
        coverChange(index) {
            this.currentCover = index;
        },
    },
};
</script>

<style lang="scss" scoped>
@import "./goodsDetail.scss";
@import "../../static/css/common.scss";
</style>