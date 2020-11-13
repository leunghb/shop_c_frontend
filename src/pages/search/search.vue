<template>
    <div class="search">
        <div class="header">
            <van-icon class="backIcon" name="arrow-left" @click="back()" />
            <van-search
                class="search"
                v-model="searchValue"
                show-action
                placeholder="请输入搜索商品名称"
                @search="search"
                @clear="clear"
                onkeyup="this.value=this.value.replace(/^\s+|\s+$/g,'')"
            >
                <template #action>
                    <div @click="search">搜索</div>
                </template>
            </van-search>
        </div>

        <van-list
            class="list"
            v-model="loading"
            :finished="finished"
            :finished-text="finishedText"
            @load="onLoad"
        >
            <van-cell class="item" v-for="item in list" :key="item.id">
                <img class="cover" :src="item.cover" v-lazy="item.cover" alt />
                <div
                    class="mainTitle multipleLinesOmitted"
                    v-text="item.mainTitle"
                ></div>
                <div class="price">
                    <div
                        :class="[
                            'originalPrice',
                            item.discountPrice > 0 ? 'lineThrough' : '',
                        ]"
                        v-text="'￥' + item.originalPrice"
                    >
                        ￥112.00
                    </div>
                    <div
                        class="discountPrice"
                        v-if="item.discountPrice > 0"
                        v-text="'￥' + item.discountPrice"
                    >
                        ￥11.11
                    </div>
                </div>
            </van-cell>
        </van-list>
    </div>
</template>

<script>
import { post, api } from "../../utils/httpApi";

export default {
    data() {
        return {
            searchValue: "",
            // 列表
            list: [],
            loading: false,
            finished: false,
            finishedText: "",
            page: 0,
            limit: 10,
        };
    },
    methods: {
        search() {
            this.finished = false;
            this.page = 0;
            this.list = [];
            this.onLoad();
        },
        clear() {
            this.finished = false;
            this.loading = false;
            this.page = 0;
            this.list = [];
        },
        onLoad() {
            if (this.searchValue.length == 0) {
                this.finishedText = "";
                this.finished = true;
                return false;
            }
            ++this.page;
            let params = this.$qs.stringify({
                limit: this.limit,
                page: this.page,
                goodsTypeId: this.currentClassifyId,
                soldOut: 0,
                mainTitle: this.searchValue,
            });
            post(api.getGoods, params)
                .then((res) => {
                    let data = res.data;
                    console.log(data);
                    if (data.data.length == 0) {
                        this.finishedText = "换个商品吧 _(:з」∠)_";
                        this.finished = true;
                        return false;
                    }
                    if (data.code == 0) {
                        data.data.forEach((v) => {
                            v.cover = api.baseUrl + v.cover.split(",")[0];
                            this.list.push(v);
                        });
                        this.loading = false;
                        if (
                            this.list.length < this.limit ||
                            this.list.length % this.limit != 0
                        ) {
                            this.finished = true;
                            this.finishedText = "这是全部了 (..•˘_˘•..)";
                        }
                    }
                })
                .catch((err) => {
                    this.$toast(err);
                });
        },
        back() {
            this.$router.go(-1);
        },
    },
};
</script>

<style lang="scss" scoped>
@import "./search.scss";
@import "../../static/css/common.scss";
</style>