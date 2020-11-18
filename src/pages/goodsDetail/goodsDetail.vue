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
        <div class="detail"></div>

        <!-- <van-sku
            v-model="showSku"
            :sku="sku"
            :goods="goods"
            :goods-id="goodsId"
            @buy-clicked="onBuyClicked"
            @add-cart="onAddCartClicked"
        /> -->
        <van-sku
            v-model="showSku"
            :sku="skuData.sku"
            :goods="skuData.goods"
            :goods-id="skuData.goods_id"
            :hide-stock="skuData.sku.hide_stock"
            :quota="skuData.quota"
            :quota-used="skuData.quota_used"
            :initial-sku="initialSku"
            reset-stepper-on-hide
            reset-selected-sku-on-hide
            disable-stepper-input
            :close-on-click-overlay="closeOnClickOverlay"
            :custom-sku-validator="customSkuValidator"
            @buy-clicked="onBuyClicked"
            @add-cart="onAddCartClicked"
        />

        <div class="footer">
            <div class="buy" @click="showSku = true">购买</div>
            <div class="cart" @click="showSku = true">加入购物车</div>
        </div>
    </div>
</template>

<script>
import Back from "../../components/backToPrevious/backToPrevious";
import { post, api } from "../../utils/httpApi";
// import skuData from "../../utils/data"

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

            // showSku: false,
            // sku: {},
            // goods: {},
            // messageConfig: {},
            skuData: {},
            showSku: false,
            showCustom: false,
            showStepper: false,
            showSoldout: false,
            closeOnClickOverlay: true,
            initialSku: {
                // //默认选中
                // s1: "30349",
                // s2: "1193",
                // selectedNum: 3,
            },
            customSkuValidator: () => "请选择xxx!",
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
                    let goodsInfo = data.data.goodsInfo,
                        goodsSpecs = data.data.goodsSpecs;
                    goodsInfo.cover.split(",").forEach((v) => {
                        v = api.baseUrl + v;
                        this.cover.push(v);
                    });
                    this.mainTitle = goodsInfo.mainTitle;
                    this.subTitle = goodsInfo.subTitle;
                    this.originalPrice = goodsInfo.originalPrice;
                    this.discountPrice = goodsInfo.discountPrice;
                    this.salesVolume = goodsInfo.salesVolume;
                    let sku = JSON.parse(goodsInfo.sku);
                    // tree
                    let tree = [];
                    for (let i in sku) {
                        let indexOf = i.indexOf("-");
                        let obj = {};
                        obj.k = i.substring(0, indexOf);
                        obj.k_s = "s" + i.substring(indexOf + 1);
                        let treeV = [];
                        sku[i].forEach((v) => {
                            let skuIndexOf = v.indexOf("-");
                            let skuObj = {};
                            skuObj.id = v.substring(skuIndexOf + 1);
                            skuObj.name = v.substring(0, skuIndexOf);
                            treeV.push(skuObj);
                        });
                        obj.v = treeV;
                        tree.push(obj);
                    }
                    this.skuData.sku.tree = tree;
                    // list
                    let list = [];
                    goodsSpecs.forEach((v) => {
                        let obj = {};
                        obj.id = v.id;
                        obj.price = v.price;
                        obj.stock_num = v.stock;
                        let specs = JSON.parse(v.specs);
                        for (let i in specs) {
                            let indexOf = i.indexOf("-");
                            obj["s" + i.substring(indexOf + 1)] = specs[
                                i
                            ].substring(0, indexOf);
                        }
                        list.push(obj);
                    });
                    this.skuData.sku.list = list;
                    this.skuData.sku.price =
                        this.discountPrice > 0
                            ? this.discountPrice
                            : this.originalPrice;
                    this.skuData.sku.stock_num = goodsInfo.stock;
                    this.skuData.sku.none_sku = false;
                    this.skuData.sku.hide_stock = false;
                    this.skuData.goods = {
                        title: this.mainTitle,
                        picture: this.cover[0],
                    };
                    console.log(this.skuData);
                })
                .catch((err) => {
                    this.$toast(err.message);
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