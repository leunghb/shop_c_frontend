<template>
    <div class="goodsDetail fullscreen">
        <Back></Back>

        <van-swipe
            class="my-swipe cover"
            :autoplay="3000"
            indicator-color="white"
            @change="coverChange"
        >
            <van-swipe-item
                v-for="(item, index) in cover"
                :key="index"
                :style="{ background: 'url(' + item + ')' }"
            >
            </van-swipe-item>
            <template #indicator>
                <div
                    v-if="cover.length > 1"
                    class="custom-indicator"
                    v-text="currentCover + 1 + '/' + cover.length"
                ></div>
            </template>
        </van-swipe>

        <div class="goodsInfo">
            <div
                class="mainTitle multipleLinesOmitted"
                v-text="mainTitle"
            ></div>
            <div class="subTitle" v-text="subTitle">纯天然产品</div>
            <div class="priceAndsalesVolume">
                <div class="noDiscount" v-if="discountPrice == 0">
                    <span>￥</span>{{ originalPrice }}
                </div>
                <div class="haveDiscount" v-else>
                    <span>￥</span>{{ discountPrice }}
                    <span>价格￥{{ originalPrice }}</span>
                </div>
                <div
                    class="salesVolume"
                    v-text="'已售' + salesVolume + '份'"
                ></div>
            </div>
        </div>
        <div class="specifications">
            <div class="label">选择</div>
            <van-icon name="arrow" />
            <div class="value">规格</div>
        </div>
        <div class="address">
            <div class="label">地址</div>
            <van-icon name="arrow" />
            <div class="value">厦门</div>
        </div>
        <div class="evaluate">
            <div class="label">评价</div>
            <van-icon name="arrow" />
            <div class="value"></div>
        </div>
        <div class="detail">
            详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情
        </div>
        <div class="footer">
            <div class="buy" @click="showSku = true">购买</div>
            <div class="cart" @click="showSku = true">加入购物车</div>
        </div>

        <van-sku
            v-model="showSku"
            :sku="sku"
            :goods="goods"
            :goods-id="goodsId"
            :message-config="messageConfig"
            @buy-clicked="onBuyClicked"
            @add-cart="onAddCartClicked"
        />
    </div>
</template>

<script>
import Back from "../../components/backToPrevious/backToPrevious";
import { post, api } from "../../utils/httpApi";

export default {
    data() {
        return {
            currentCover: 0,

            goodsId: null,
            cover: [],
            mainTitle: "",
            subTitle: "",
            originalPrice: 0,
            discountPrice: 0,
            salesVolume: 0,

            showSku: false,
            sku: {},
            goods: {},
            messageConfig: {},
        };
    },
    components: {
        Back,
    },
    created() {
        let query = this.$route.query;
        this.goodsId = query.goodsId;
        this.getGoodsDetail();
    },
    methods: {
        coverChange(index) {
            this.currentCover = index;
        },
        getGoodsDetail() {
            let params = this.$qs.stringify({
                goodsId: this.goodsId,
            });
            post(api.getGoodsDetail, params)
                .then((res) => {
                    let data = res.data;
                    if (data.code != 0) {
                        this.$toast(data.message);
                        return false;
                    }
                    data = data.data;
                    // console.log(data);
                    data.cover.split(",").forEach((v) => {
                        v = api.baseUrl + v;
                        this.cover.push(v);
                    });
                    this.mainTitle = data.mainTitle;
                    this.subTitle = data.subTitle;
                    this.originalPrice = data.originalPrice;
                    this.discountPrice = data.discountPrice;
                    this.salesVolume = data.salesVolume;
                    let sku = JSON.parse(data.sku);
                    console.log(sku);
                    let tree = [],
                        treeIndex = 0;
                    for (let i in sku) {
                        console.log(i);
                        console.log(sku[i]);
                        let treeObj = {};
                        treeObj.k = i;
                        treeObj.k_s = treeIndex++;
                        tree.push(treeObj);
                    }
                    console.log(tree);
                })
                .catch((err) => {
                    this.$toast(err);
                });
        },
        onBuyClicked() {},
        onAddCartClicked() {},
    },
};
</script>

<style lang="scss" scoped>
@import "./goodsDetail.scss";
@import "../../static/css/common.scss";
</style>