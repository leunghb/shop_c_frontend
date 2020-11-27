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
                        :num="item.number"
                        :price="item.price.toFixed(2)"
                        :desc="item.skuDesc"
                        :title="item.mainTitle"
                        class="goods-card card"
                        :thumb="item.cover"
                    />
                    <template #right>
                        <van-button
                            square
                            text="删除"
                            type="danger"
                            class="delete-button"
                        />
                    </template>
                </van-swipe-cell>
            </van-cell>
        </van-list>

        <van-submit-bar
            class="submitBar"
            :price="3050"
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
        onSubmit() {},
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
    },
};
</script>

<style lang="scss" scoped>
@import "../../static/css/common.scss";
@import "./cart.scss";
</style>