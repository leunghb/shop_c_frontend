<template>
    <div class="goodsDetail fullscreen">
        <Back></Back>

        <van-swipe
            class="my-swipe cover"
            :autoplay="showSku ? 0 : 3000"
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
            <div class="subTitle" v-text="subTitle"></div>
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
            <div
                class="value"
                @click="showSku = true"
                v-text="allSelected ? selectedSkuText : '规格'"
            ></div>
        </div>
        <div class="address">
            <div class="label">地址</div>
            <van-icon name="arrow" />
            <div
                class="value"
                @click="toAddressList()"
                v-show="address"
                v-text="
                    address ? address.name + '—' + address.address : '暂无地址'
                "
                v-cloak
            ></div>
        </div>
        <div class="evaluate">
            <div class="label">评价</div>
            <van-icon name="arrow" />
            <div
                class="value"
                v-text="evaluateCount > 0 ? '+ ' + evaluateCount : '无评价'"
                @click="toGoodsEvaluate"
            ></div>
        </div>
        <div class="detail" v-if="detail">
            <div class="label">详情</div>
            <div v-html="detail"></div>
        </div>

        <van-overlay class="sku" :show="showSku" @click="showSku = false">
            <div class="wrapper" @click.stop>
                <div class="top">
                    <img
                        class="cover"
                        :src="skuCover != undefined ? skuCover : cover[0]"
                        alt=""
                    />
                    <div class="price">
                        <span>￥</span>
                        <span v-text="allSelected ? skuPrice : price"></span>
                    </div>
                    <div class="stock">
                        <span>剩余</span>
                        <span
                            v-text="allSelected ? skuStock : totalStock"
                        ></span>
                        <span>件</span>
                    </div>
                    <div
                        class="selected"
                        v-show="hasSelect"
                        v-text="
                            '已选 ' + selectedSkuText + ' x' + numberOfpurchases
                        "
                    ></div>
                    <div class="clearBoth"></div>
                </div>
                <div class="center">
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
                            v-for="(
                                attrValueItem, attrValueIndex
                            ) in attrKeyItem.attrValue"
                            :key="attrValueItem.id"
                            @click="
                                selectSku(
                                    attrKeyIndex,
                                    attrValueIndex,
                                    attrKeyItem.id,
                                    attrValueItem.id,
                                    attrValueItem.selectable,
                                    attrValueItem.cover
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
                                v-text="attrValueItem.name"
                            ></span>
                        </span>
                    </div>
                    <div class="numberOfpurchases">
                        <div class="label">购买数量</div>
                        <van-stepper
                            class="numberInput"
                            v-model="numberOfpurchases"
                            :min="minNumberOfpurchases"
                            :max="maxNumberOfpurchases"
                            integer
                        />
                    </div>
                </div>
                <div class="bottom">
                    <div class="cart" @click="addGoodsToCart()">
                        <span>加入购物车</span>
                        <span
                            class="checkmark"
                            v-show="showCartAnimation"
                        ></span>
                    </div>
                    <div class="buy" @click="buy()"><span>购买</span></div>
                </div>
            </div>
        </van-overlay>

        <div class="footer">
            <div class="left">
                <van-icon name="cart-o" @click="toCart" />
                <van-icon
                    :name="isCollect ? 'goods-collect' : 'goods-collect-o'"
                    @click="collectGoods"
                />
            </div>
            <div class="right" @click="showSku = true">
                <div class="cart">加入购物车</div>
                <div class="buy">购买</div>
            </div>
        </div>
    </div>
</template>

<script>
import Back from "../../components/backToPrevious/backToPrevious";
import { post, api, get } from "../../utils/httpApi";
import {
    arrayIntersect,
    arrayRemoveItem,
    isAllEqual,
    arrayEquals,
} from "../../utils/common";

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
            totalStock: 0,
            price: 0,
            evaluateCount: 0,

            showSku: false,
            sku: [],
            selectedSku: [], //已选规格
            selectedSkuIndex: [], //出现 xxx-0 则为该规格组不可选
            selectedSkuText: "",
            allSkuPlan: [], //所有规格方案
            currentSkuInfo: {},
            skuStock: 0, //规格单品库存
            skuPrice: 0,
            skuCover: null,

            numberOfpurchases: 1, //购买数量,
            minNumberOfpurchases: 1,
            maxNumberOfpurchases: null,

            address: {},

            showCartAnimation: false,

            isCollect: true,
        };
    },
    components: {
        Back,
    },
    created() {
        localStorage.setItem("paySuccessBackLevel", -2);
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
                    this.evaluateCount = data.data.evaluateCount;
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
                    this.totalStock = goodsInfo.stock;
                    this.maxNumberOfpurchases = goodsInfo.stock;
                    this.detail = goodsInfo.content.replace(
                        'src="/static',
                        'src="' + api.baseUrl + "/static"
                    );
                    this.price =
                        goodsInfo.discountPrice > 0
                            ? goodsInfo.discountPrice
                            : goodsInfo.originalPrice;
                    let sku =
                        goodsInfo.specList != undefined
                            ? JSON.parse(goodsInfo.specList)
                            : "";
                    if (goodsInfo.specList == undefined) {
                        this.skuPrice = this.price;
                        this.skuStock = this.totalStock;
                    }
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
                        this.allSkuPlan.push(v);
                    });
                    this.getAddressList();
                })
                .catch((err) => {
                    console.log(err);
                    this.$toast(err.message);
                });
            this.hasCollectGoods();
        },
        //选中规格
        selectSku(
            attrKeyIndex,
            attrValueIndex,
            attrKeyItemId,
            attrValueItemId,
            selectable,
            attrValueItemCover
        ) {
            if (!selectable) return false;

            if (attrValueItemCover != undefined) {
                this.skuCover = attrValueItemCover;
            }

            //前面已选择的规格组再次选择不同规格，重置后面的规格组
            for (let i = 0; i < this.selectedSku.length; i++) {
                let canSelect = false;
                this.sku[i].attrValue.forEach((v) => {
                    //判断前面未选择的规格组的项是否全部不能选择
                    if (v.selectable) {
                        canSelect = true;
                    }
                });
                if (!canSelect) {
                    this.selectedSku[i] = this.sku[i].id + "-0";
                }
                //规格组全部选项不能选择不计入判断 canSelect
                if (
                    this.selectedSku[i] == null &&
                    i < attrKeyIndex &&
                    canSelect
                ) {
                    this.$toast("请先选择" + this.sku[i].name);
                    return false;
                }
                if (i > attrKeyIndex) {
                    this.maxNumberOfpurchases = this.totalStock;
                    this.selectedSku[i] = null;
                }
            }
            this.selectedSkuIndex.forEach((v, k) => {
                if (k > attrKeyIndex) {
                    this.selectedSkuIndex[k] = null;
                }
            });

            if (this.selectedSkuIndex[attrKeyIndex] == attrValueIndex) {
                //已选择过
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
            this.selectedSkuText = "";
            this.selectedSkuIndex.forEach((v, k) => {
                if (v != null) {
                    this.selectedSkuText += this.sku[k].attrValue[v].name + ",";
                }
            });
            this.selectedSkuText = this.selectedSkuText.substring(
                0,
                this.selectedSkuText.length - 1
            );

            let allSkuPlan = [];
            this.allSkuPlan.forEach((planV) => {
                let specs = planV.specs;
                if (
                    arrayIntersect(specs, this.selectedSku).length ==
                    selectedSku.length
                ) {
                    // 求可选方案，已选规格与可选规格交集（已选规格数目 == 交集长度）
                    allSkuPlan.push(specs);
                }
            });

            this.selectedSku.forEach((selectedSkuV, selectedSkuK) => {
                //未选择的规格组
                if (selectedSkuV == null) {
                    this.sku[selectedSkuK].attrValue.forEach(
                        (skuAttrValueV, skuAttrValueK) => {
                            //已过滤可选规格方案
                            let arr = [];
                            allSkuPlan.forEach((planV) => {
                                arr.push(planV[selectedSkuK]);
                            });
                            //未选择的规格组的项是否在已过滤可选规格方案中，可选
                            if (arr.includes(skuAttrValueV.keyValue)) {
                                this.sku[selectedSkuK].attrValue[
                                    skuAttrValueK
                                ].selectable = true;
                            } else {
                                //置灰
                                this.sku[selectedSkuK].attrValue[
                                    skuAttrValueK
                                ].selectable = false;
                            }
                        }
                    );
                }
            });
            //选择过之后全部未选
            if (isAllEqual(this.selectedSku)) {
                this.skuCover = undefined;
                this.sku.forEach((v) => {
                    v.attrValue.forEach((_v) => {
                        _v.selectable = true;
                    });
                    this.maxNumberOfpurchases = this.totalStock;
                });
                return false;
            }
        },
        addGoodsToCart() {
            if (this.skuStock == 0) {
                this.$toast("暂无库存");
                return false;
            }
            let skuCover = this.skuCover.replace(api.baseUrl, "");
            let currentSkuInfo = this.currentSkuInfo;
            let params = this.$qs.stringify({
                goodsSpecsId: currentSkuInfo.id,
                goodsId: currentSkuInfo.goodsId,
                number: this.numberOfpurchases,
                skuDesc: this.selectedSkuText,
                skuCover: skuCover,
            });
            this.$toast.loading({
                message: "添加中...",
                duration: 0,
            });
            post(api.addGoodsToCart, params)
                .then((res) => {
                    let data = res.data;
                    if (data.code == 0) {
                        this.showCartAnimation = true;
                        let time = setTimeout(() => {
                            this.showCartAnimation = false;
                            this.$toast.clear();
                        }, 1200);
                        return false;
                    }
                    this.$toast.clear();
                    this.$toast(data.message);
                })
                .catch((err) => {
                    this.$toast.clear();
                    this.$toast(err.message);
                });
        },
        buy() {
            if (this.selectedSku.includes(null)) {
                this.$toast("请选择全部规格");
                return false;
            }
            if (this.skuStock == 0) {
                this.$toast("暂无库存");
                return false;
            }
            if (!this.address) {
                this.$toast("请添加地址");
                return false;
            }
            let list = [];
            let obj = {
                goodsId: this.goodsId,
                cover: this.cover[0],
                mainTitle: this.mainTitle,
                selectedSkuText: this.selectedSkuText,
                skuStock: this.skuStock,
                skuPrice: this.skuPrice,
                skuCover: this.skuCover,
                numberOfpurchases: this.numberOfpurchases,
                goodsSpecsId: this.currentSkuInfo.id,
            };
            list.push(obj);
            this.$router.push({
                path: "/ConfirmOrder",
                query: {
                    data: JSON.stringify(list),
                    type: 0, //直接下单
                },
            });
        },
        toAddressList() {
            this.$router.push({
                path: "/AddressList",
            });
        },
        getAddressList() {
            get(api.getAddressList)
                .then((res) => {
                    let data = res.data.data;
                    let temporaryAddress = JSON.parse(
                        localStorage.getItem("temporaryAddress")
                    );
                    this.address =
                        temporaryAddress != null ? temporaryAddress : data[0];
                })
                .catch((err) => {});
        },
        toCart() {
            this.$router.push({
                path: "/Cart",
            });
        },
        hasCollectGoods() {
            let params = this.$qs.stringify({
                goodsId: this.goodsId,
            });
            post(api.hasCollectGoods, params).then((res) => {
                let data = res.data;
                this.isCollect = data.code == 0;
            });
        },
        collectGoods() {
            let params = this.$qs.stringify({
                goodsId: this.goodsId,
            });
            post(api.addOrDelCollectGoods, params)
                .then((res) => {
                    let data = res.data;
                    if (data.code == 0) this.isCollect = !this.isCollect;
                })
                .catch((err) => {
                    this.$toast(err.message);
                });
        },
        toGoodsEvaluate() {
            this.$router.push({
                path: "/GoodsEvaluate",
                query: {
                    goodsId: this.goodsId,
                },
            });
        },
    },
    computed: {
        hasSelect() {
            //是否全部相等，初始为[null,null...]，false=>至少选择一个规格
            return !isAllEqual(this.selectedSku);
        },
        allSelected() {
            //是否全部选择（不包含无法选择的规格组，并且该下标值设为xxx-0,如：[1-1,2-0,3-2]）
            let allSelected = !this.selectedSku.includes(null); //true=>未全选
            if (allSelected) {
                this.allSkuPlan.forEach((v) => {
                    if (arrayEquals(this.selectedSku, v.specs)) {
                        this.currentSkuInfo = v;
                        this.skuStock = v.stock;
                        this.maxNumberOfpurchases = v.stock;
                        this.skuPrice = v.price;
                    }
                });
            }
            return allSelected;
        },
    },
};
</script>

<style lang="scss" scoped>
@import "./goodsDetail.scss";
@import "../../static/css/common.scss";
</style>