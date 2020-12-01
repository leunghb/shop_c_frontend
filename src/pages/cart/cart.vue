<template>
    <div class="cart fullscreen">
        <van-list
            class="list"
            v-model="loading"
            :finished="finished"
            :finished-text="finishedText"
            @load="onLoad"
        >
            <van-cell v-for="(item, index) in list" :key="item.id">
                <van-swipe-cell>
                    <van-checkbox
                        class="checkbox"
                        name="item"
                        v-model="item.checked"
                        @click="singleCheck(index)"
                    ></van-checkbox>
                    <van-card
                        :price="item.price.toFixed(2)"
                        :desc="item.skuDesc"
                        :title="item.mainTitle"
                        class="goods-card card"
                        :thumb="item.cover"
                    />
                    <van-stepper
                        class="number"
                        v-model="item.number"
                        min="1"
                        :max="item.stock"
                        integer
                    />
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
    created() {},
    methods: {
        scrollTop() {},
        onLoad() {
            ++this.page;
            let params = this.$qs.stringify({
                limit: this.limit,
                page: this.page,
            });
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
                            v.checked = false;
                            v.cover =
                                v.skuCover != "" ? v.skuCover : v.cover[0];
                            v.cover = api.baseUrl + v.cover;
                            arr.push(v);
                            this.listCheckedStatus.push(false);
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
            this.$router.push({
                path: "/OrderDetail",
                query: {
                    data: JSON.stringify(list),
                },
            });
        },
        checkAll() {
            let hasUnselected = this.listCheckedStatus.includes(false);
            this.list.forEach((v, k) => {
                v.checked = hasUnselected ? true : false;
                this.$set(this.listCheckedStatus, k, v.checked);
            });
            if (!this.listCheckedStatus.includes(false)) {
                this.allChecked = true;
            }
        },
        singleCheck(index) {
            this.$set(
                this.listCheckedStatus,
                index,
                !this.listCheckedStatus[index]
            );
            if (!this.listCheckedStatus.includes(false)) {
                this.allChecked = true;
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
                    post(api.delCartOneGoods, params)
                        .then((res) => {
                            let data = res.data;
                            if (data.code == 0) {
                                this.list.splice(index, 1);
                                this.$toast("删除成功");
                                return false;
                            }
                            this.$toast(data.message);
                        })
                        .catch((err) => {
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