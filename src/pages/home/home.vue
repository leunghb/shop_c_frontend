<template>
    <div class="home">
        <div :class="['header', headerBgWhite ? 'headerBgWhite' : '']">
            <div class="searchBtn" @click="toSearch()">
                <van-icon class="icon" name="search" />
                搜索
            </div>
        </div>

        <div class="hotBgImg">
            <img
                src="https://ylsqfile-dev.zhiyanglao.cn/be1b16e551b893ee3d38.jpg"
                alt=""
            />
        </div>
        <div class="hot">
            <van-swipe
                class="swipe"
                :autoplay="5000"
                indicator-color="white"
                @change="swipeChange()"
            >
                <van-swipe-item>
                    <img
                        src="https://ylsqfile-dev.zhiyanglao.cn/be1b16e551b893ee3d38.jpg"
                        alt=""
                    />
                </van-swipe-item>
                <van-swipe-item
                    ><img
                        src="https://ylsqfile-dev.zhiyanglao.cn/be1b16e551b893ee3d38.jpg"
                        alt=""
                /></van-swipe-item>
                <van-swipe-item
                    ><img
                        src="https://ylsqfile-dev.zhiyanglao.cn/be1b16e551b893ee3d38.jpg"
                        alt=""
                /></van-swipe-item>
            </van-swipe>
        </div>

        <van-sticky :offset-top="'38px'">
            <div class="classify">
                <div
                    class="item"
                    v-for="item in classify"
                    :key="item.id"
                    @click="chooseClassify(item.id)"
                >
                    <img class="iconfont" :src="item.icon" alt="" />
                    <div class="label" v-text="item.label"></div>
                </div>
            </div>
        </van-sticky>

        <van-pull-refresh
            class="list"
            v-model="refreshing"
            @refresh="onRefresh"
        >
            <van-list
                class="innerList"
                v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad"
            >
                <van-cell class="item" v-for="item in list" :key="item.id">
                    <img class="cover" :src="item.cover" alt="" />
                    <div class="info">
                        <div
                            class="title singleLineOmission"
                            v-text="item.mainTitle"
                        ></div>
                        <div class="price">
                            <div
                                :class="[
                                    'originalPrice',
                                    item.discountPrice > 0 ? 'lineThrough' : '',
                                ]"
                            >
                                <span>￥</span
                                ><span v-text="item.originalPrice"></span>
                            </div>
                            <div
                                class="discountPrice"
                                v-if="item.discountPrice > 0"
                            >
                                <span>￥</span
                                ><span v-text="item.discountPrice"></span>
                            </div>
                        </div>
                    </div>
                </van-cell>
            </van-list>
        </van-pull-refresh>
    </div>
</template>

<script>
import { api, get, post } from "../../utils/httpApi";
import { getCookie } from "../../utils/common";

export default {
    data() {
        return {
            classify: [
                {
                    id: 340,
                    icon: require("../../assets/classify-01.png"),
                    label: "零食",
                    color: "",
                },
                {
                    id: 110,
                    icon: require("../../assets/classify-02.png"),
                    label: "水果",
                },
                {
                    id: 3,
                    icon: require("../../assets/classify-03.png"),
                    label: "熟食",
                },
                {
                    id: 354,
                    icon: require("../../assets/classify-04.png"),
                    label: "全部",
                },
            ],
            list: [],
            page: 0,
            limit: 10,
            loading: false,
            finished: false,
            refreshing: false,
            headerBgWhite: false,
        };
    },
    created() {},
    methods: {
        getGoods() {
            let params = this.$qs.stringify({
                limit: this.limit,
                page: this.page,
            });
            post(api.getGoods, params)
                .then((res) => {
                    let data = res.data;
                    if (data.code == 0) {
                        data.data.forEach((v) => {
                            v.cover = api.baseUrl + v.cover.split(",")[0];
                            this.list.push(v);
                        });
                        if (
                            this.list.length < this.limit ||
                            this.list.length % this.limit != 0
                        ) {
                            this.finished = true;
                        }
                        this.loading = false;
                    }
                })
                .catch((err) => {
                    this.$toast(err);
                });
        },
        toSearch() {
            this.$router.push({
                path: "/Search",
            });
        },
        swipeChange() {
            //每一页轮播结束后触发
        },
        chooseClassify(id) {},
        onLoad() {
            console.log("===onLoad===");
            ++this.page;
            setTimeout(() => {
                if (this.refreshing) {
                    this.list = [];
                    this.refreshing = false;
                }
                this.getGoods();
            }, 1000);
        },
        onRefresh() {
            console.log("=====onRefresh====");
            this.finished = false;
            this.loading = true;
            this.page = 0;
            this.onLoad();
        },
        scrollHandle(e) {
            let top = e.srcElement.scrollingElement.scrollTop;
            this.headerBgWhite = top >= 130;
        },
        scrollTop() {
            document.documentElement.scrollTop = 0;
        },
    },
    mounted() {
        window.addEventListener("scroll", this.scrollHandle);
    },
};
</script>

<style lang="scss" scoped>
@import "../../static/css/iconfont.css";
@import "../../static/css/common.scss";
@import "./home.scss";
</style>