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

        <van-overlay class="sku" :show="showSku" @click="showSku = false">
            <div class="wrapper" @click.stop>
                <img class="cover" src="" alt="" />
                <div class="price"><span>￥</span><span>11.00</span></div>
                <div class="stock">剩余111件</div>
                <div class="selected">已选</div>
                <div class="clearBoth"></div>
                {{ selectedSku }}
                <div></div>
                {{ selectedSkuIndex }}
                <div
                    class="attr"
                    v-for="(attrKeyItem, attrKeyIndex) in sku"
                    :key="attrKeyItem.id"
                >
                    <div class="attrKey" v-text="attrKeyItem.name"></div>
                    <span
                        :class="[
                            'attrValue',
                            attrValueIndex == selectedSkuIndex[attrKeyIndex]
                                ? 'active'
                                : '',
                            !attrValueItem.selectable ? 'disable' : '',
                        ]"
                        v-for="(attrValueItem,
                        attrValueIndex) in attrKeyItem.attrValue"
                        :key="attrValueItem.id"
                        @click="
                            selectSku(
                                attrKeyIndex,
                                attrValueIndex,
                                attrKeyItem.id,
                                attrValueItem.id
                            )
                        "
                    >
                        <img
                            v-if="attrValueItem.cover"
                            :src="attrValueItem.cover"
                            alt=""
                        />
                        <span
                            class="name"
                            v-text="
                                attrValueItem.name +
                                attrKeyItem.id +
                                '===' +
                                attrValueItem.id
                            "
                        ></span>
                    </span>
                </div>
            </div>
        </van-overlay>

        <div class="footer">
            <div class="buy" @click="showSku = true">购买</div>
            <div class="cart" @click="showSku = true">加入购物车</div>
        </div>
    </div>
</template>

<script>
import Back from "../../components/backToPrevious/backToPrevious";
import { post, api } from "../../utils/httpApi";
import { arrayIntersect, arrayRemoveItem } from "../../utils/common";

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

            showSku: true,
            sku: [],
            selectedSku: [], //已选规格
            selectedSkuIndex: [],
            selectablePlan: [], //可选规格方案
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
        //商品详情数据
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
                    for (let i in sku) {
                        let attrKeyIndexOf = i.indexOf(",");
                        let attrKeyObj = {};
                        attrKeyObj.name = i.substring(0, attrKeyIndexOf);
                        attrKeyObj.id = i.substring(attrKeyIndexOf + 1);
                        attrKeyObj.attrValue = [];
                        sku[i].forEach((v) => {
                            let attrValueIndexOf = v.indexOf(",");
                            let attrValueLastIndexOf = v.lastIndexOf(",");
                            let attrValueObj = {};
                            attrValueObj.name = v.substring(
                                0,
                                attrValueIndexOf
                            );
                            attrValueObj.selectable = true; //是否可选
                            if (attrValueIndexOf == attrValueLastIndexOf) {
                                //无图
                                attrValueObj.id = v.substring(
                                    attrValueIndexOf + 1
                                );
                            } else {
                                attrValueObj.id = v.substring(
                                    attrValueIndexOf + 1,
                                    attrValueLastIndexOf
                                );
                                attrValueObj.cover =
                                    api.baseUrl +
                                    v.substring(attrValueLastIndexOf + 1);
                            }
                            attrValueObj.keyValue =
                                attrKeyObj.id + "-" + attrValueObj.id;
                            attrKeyObj.attrValue.push(attrValueObj);
                        });
                        this.sku.push(attrKeyObj);
                    }
                    this.selectedSku = new Array(this.sku.length).fill(null);
                    this.selectedSkuIndex = new Array(this.sku.length).fill(
                        null
                    );
                    goodsSpecs.forEach((v) => {
                        v.specs = v.specs.split(",");
                        this.selectablePlan.push(v);
                    });
                })
                .catch((err) => {
                    this.$toast(err.message);
                });
        },
        //选中规格
        selectSku(
            attrKeyIndex,
            attrValueIndex,
            attrKeyItemId,
            attrValueItemId
        ) {
            console.log("===");
            if (this.selectedSkuIndex[attrKeyIndex] == attrValueIndex) {
                attrKeyItemId = null;
                attrValueItemId = null;
                attrValueIndex = null;
            }
            this.$set(
                this.selectedSku,
                attrKeyIndex,
                attrKeyItemId == null
                    ? null
                    : attrKeyItemId + "-" + attrValueItemId
            );
            let selectedSku = this.selectedSku.slice(0);
            arrayRemoveItem(selectedSku, null);
            this.$set(this.selectedSkuIndex, attrKeyIndex, attrValueIndex);
            let selectablePlan = [];
            this.selectablePlan.forEach((planV) => {
                let specs = planV.specs;
                if (
                    arrayIntersect(specs, this.selectedSku).length ==
                    selectedSku.length
                ) {
                    // 求可选方案，已选规格与可选规格交集（已选规格数目 == 交集长度）
                    selectablePlan.push(specs);
                }
            });
            console.log(selectablePlan);
            console.log("selectablePlan=======");
            this.selectedSku.forEach((selectedSkuV, selectedSkuK) => {
                if (selectedSkuV == null) {
                    this.sku[selectedSkuK].attrValue.forEach(
                        (skuAttrValueV) => {
                            selectablePlan.forEach((planV) => {
                                if (
                                    skuAttrValueV.keyValue ==
                                    planV[selectedSkuK]
                                ) {
                                    console.log("1111");
                                    return;
                                }
                            });
                        }
                    );
                }
            });
        },
    },
};
</script>

<style lang="scss" scoped>
@import "./goodsDetail.scss";
@import "../../static/css/common.scss";
</style>