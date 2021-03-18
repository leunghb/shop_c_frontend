<template>
    <div class="cart fullscreen">
        <van-list
            class="list"
            v-model="loading"
            :finished="finished"
            :finished-text="finishedText"
            @load="onLoad"
        >
            <van-cell
                :class="[item.stock == 0 ? 'disabled' : '']"
                v-for="(item, index) in list"
                :key="item.id"
            >
                <van-swipe-cell>
                    <van-checkbox
                        class="checkbox"
                        name="item"
                        v-model="item.checked"
                        @click="singleCheck(index)"
                        :disabled="item.stock == 0"
                    ></van-checkbox>
                    <van-card
                        :price="item.price.toFixed(2)"
                        :desc="item.skuDesc"
                        :title="item.mainTitle"
                        class="goods-card card"
                        :thumb="item.cover"
                    />
                    <van-stepper
                        v-if="item.stock > 0"
                        class="number"
                        v-model="item.number"
                        min="1"
                        :max="item.stock"
                        integer
                    />
                    <div v-else class="noneStock">暂无库存</div>
                    <template #right>
                        <van-button
                            square
                            text="删除"
                            type="danger"
                            class="delete-button"
                            @click="del(index, item)"
                        />
                    </template>
                </van-swipe-cell>
            </van-cell>
        </van-list>

        <van-submit-bar
            class="submitBar"
            :price="totalPrice * 100"
            button-text="提交订单"
            @submit="onSubmit"
        >
            <van-checkbox v-model="allChecked" @click="checkAll"
                >全选</van-checkbox
            >
        </van-submit-bar>
    </div>
</template>

<script>
import { post, api } from "../../utils/httpApi";

export default {
    data() {
        return {
            list: [],
            loading: false,
            finished: false,
            page: 0,
            limit: 10,
            finishedText: "没有更多了",

            allChecked: false,
            listCheckedStatus: [],

            totalPrice: 0,
        };
    },
    created() {
        localStorage.setItem("paySuccessBackLevel", -2);
    },
    methods: {
        scrollTop() {},
        onLoad() {
            ++this.page;
            let params = this.$qs.stringify({
                limit: this.limit,
                page: this.page,
            });
            // cart.number == 0 不返回
            post(api.getCartList, params)
                .then((res) => {
                    let data = res.data;
                    if (data.data.length == 0) {
                        this.finished = true;
                        this.finishedText = "购物车空空如也";
                        return false;
                    }
                    if (data.code == 0) {
                        let arr = [];
                        data.data.forEach((v) => {
                            v.checked = v.stock == 0 ? null : false;
                            v.cover = api.baseUrl + v.cover.split(",")[0];
                            arr.push(v);
                            this.listCheckedStatus.push(
                                v.stock == 0 ? null : false
                            );
                        });
                        this.list = arr;
                        this.loading = false;
                        if (
                            this.list.length < this.limit ||
                            this.list.length % this.limit != 0
                        ) {
                            this.finished = true;
                        }
                        if (this.list.length < this.limit && this.page == 1) {
                            this.finishedText = "";
                        }
                    }
                })
                .catch((err) => {
                    this.$toast(err.message);
                });
        },
        onSubmit() {
            let list = [];
            this.list.forEach((v) => {
                if (v.checked) {
                    let obj = {
                        cartId: v.cartId,
                        goodsId: v.goodsId,
                        cover: v.cover,
                        mainTitle: v.mainTitle,
                        selectedSkuText: v.skuDesc,
                        skuStock: v.stock,
                        skuPrice: v.price,
                        skuCover: v.cover,
                        numberOfpurchases: v.number,
                        goodsSpecsId: v.goodsSpecsId,
                    };
                    list.push(obj);
                }
            });
            if (list.length == 0) {
                this.$toast("未选择商品");
                return false;
            }
            this.$router.push({
                path: "/ConfirmOrder",
                query: {
                    data: JSON.stringify(list),
                    type: 1, //购物车下单
                },
            });
        },
        checkAll() {
            let hasUnselected = this.listCheckedStatus.includes(false);
            this.list.forEach((v, k) => {
                if (v.checked != null) {
                    v.checked = hasUnselected ? true : false;
                    this.$set(this.listCheckedStatus, k, v.checked);
                }
            });
            if (!this.listCheckedStatus.includes(false)) {
                this.allChecked = true;
            }
        },
        singleCheck(index) {
            if (this.list[index].stock == 0) return false;
            this.$set(
                this.listCheckedStatus,
                index,
                !this.listCheckedStatus[index]
            );
            if (!this.listCheckedStatus.includes(false)) {
                this.allChecked = true;
            }
            if (!this.listCheckedStatus.includes(true)) {
                this.allChecked = false;
            }
        },
        del(index, item) {
            this.$dialog
                .confirm({
                    title: "确认删除？",
                })
                .then(() => {
                    let params = this.$qs.stringify({
                        cartId: item.cartId,
                    });
                    this.$toast.loading({
                        message: "删除订单中...",
                        duration: 0,
                    });
                    post(api.delCartOneGoods, params)
                        .then((res) => {
                            let data = res.data;
                            if (data.code == 0) {
                                this.$toast.clear();
                                this.list.splice(index, 1);
                                this.$toast("删除成功");
                                return false;
                            }
                            this.$toast.clear();
                            this.$toast(data.message);
                        })
                        .catch((err) => {
                            this.$toast.clear();
                            this.$toast(err.message);
                        });
                })
                .catch(() => {});
        },
    },
    watch: {
        list: {
            handler(newV, oldV) {
                this.totalPrice = 0;
                this.list.forEach((v) => {
                    if (v.checked) {
                        this.totalPrice += v.price * v.number;
                    }
                });
            },
            deep: true,
        },
    },
};
</script>

<style lang="scss" scoped>
@import "../../static/css/common.scss";
@import "./cart.scss";
</style>