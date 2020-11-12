<template>
    <div class="home">
        <div :class="['header', headerBgWhite ? 'headerBgWhite' : '']">
            <div class="searchBtn" @click="toSearch()">
                <van-icon class="icon" name="search" />搜索
            </div>
        </div>

        <div class="hotBgImg">
            <img :src="activeHotGoodsCover" v-lazy="activeHotGoodsCover" alt />
        </div>
        <div class="hot">
            <van-swipe
                class="swipe"
                :autoplay="5000"
                indicator-color="white"
                @change="swipeChange"
            >
                <van-swipe-item v-for="item in hotList" :key="item.id">
                    <img :src="item.cover" v-lazy="item.cover" alt />
                </van-swipe-item>
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
                    <img class="icon" :src="item.icon" alt />
                    <div class="label" v-text="item.title"></div>
                </div>
            </div>
        </van-sticky>
        <van-overlay
            class="allClassify"
            :show="showAllClassify"
            :z-index="10000"
            @click="showAllClassify = false"
        >
            <div class="wrapper" @click.stop>
                <div class="inner">
                    <div
                        :class="[
                            'item',
                            activeClassifyId == item.id ? 'active' : '',
                        ]"
                        v-for="(item, index) in allClassify"
                        @click="selectClassify(item.id, index)"
                        :key="item.id"
                    >
                        <img class="icon" :src="item.icon" alt="" />
                        <div class="title" v-text="item.title"></div>
                    </div>
                </div>
            </div>
        </van-overlay>

        <van-pull-refresh
            v-if="classify.length > 0"
            class="list"
            v-model="refreshing"
            @refresh="onRefresh"
        >
            <van-list
                class="innerList"
                v-model="loading"
                :finished="finished"
                error-text="请求失败，点击重新加载"
                :finished-text="
                    list.length > 0 ? finishedTextOver : finishedTextNull
                "
                @load="onLoad"
            >
                <van-cell class="item" v-for="item in list" :key="item.id">
                    <img
                        class="cover"
                        :src="item.cover"
                        v-lazy="item.cover"
                        alt
                    />
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
                                <span>￥</span>
                                <span v-text="item.originalPrice"></span>
                            </div>
                            <div
                                class="discountPrice"
                                v-if="item.discountPrice > 0"
                            >
                                <span>￥</span>
                                <span v-text="item.discountPrice"></span>
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
import { getCookie, getMutipSort, getSort } from "../../utils/common";

export default {
    data() {
        return {
            //分类
            classify: [],
            currentClassifyId: null,
            allClassify: [],
            activeClassifyId: null,
            //列表
            list: [],
            page: 0,
            limit: 10,
            loading: false,
            finished: false,
            refreshing: false,
            headerBgWhite: false,
            finishedTextOver: "就这些货了 ┑(￣Д ￣)┍",
            finishedTextNull: "没货了 ╮(๑•́ ₃•̀๑)╭",
            //热门（销量前三）
            hotList: [],
            activeHotGoodsCover: "",
            //所有分类
            showAllClassify: false,
        };
    },
    created() {
        this.getHotGoods();
        this.getGoodsType();
    },
    methods: {
        // 获取销量前三商品
        getHotGoods() {
            get(api.getHotGoods)
                .then((res) => {
                    let data = res.data.data;
                    data.forEach((v) => {
                        v.cover = api.baseUrl + v.cover;
                    });
                    this.hotList = data;
                    this.activeHotGoodsCover = this.hotList[0].cover;
                })
                .catch((err) => {
                    this.$toast(err);
                });
        },
        //每一页轮播结束后触发
        swipeChange(index) {
            this.activeHotGoodsCover = this.hotList[index].cover;
        },
        //获取商品分类
        getGoodsType() {
            post(api.getGoodsType)
                .then((res) => {
                    let data = res.data;
                    let classify = data.data;
                    classify.forEach((v) => {
                        v.icon = api.baseUrl + v.icon;
                    });
                    let prioritySort = getSort((a, b) => {
                        return a.priority > b.priority;
                    });
                    let createdAtSort = getSort((a, b) => {
                        return a.createdAt > b.createdAt;
                    });
                    let arrSort = [prioritySort, createdAtSort];
                    classify = classify.sort(getMutipSort(arrSort));
                    this.allClassify = classify;
                    classify = classify.slice(0, 3);
                    classify.push({
                        id: -1,
                        icon: require("../../assets/classify-04.png"),
                        title: "全部",
                    });
                    this.currentClassifyId = classify[0].id;
                    this.activeClassifyId = this.currentClassifyId;
                    this.classify = classify;
                })
                .catch((err) => {
                    this.$toast(err);
                });
        },
        //获取商品列表
        getGoods() {
            let params = this.$qs.stringify({
                limit: this.limit,
                page: this.page,
                goodsTypeId: this.currentClassifyId,
                soldOut: 0,
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
        //搜索
        toSearch() {
            this.$router.push({
                path: "/Search",
            });
        },
        // 切换商品分类
        chooseClassify(id) {
            if (this.currentClassifyId == id) return false;
            if (id == -1) {
                this.showAllClassify = true;
                return false;
            }
            this.currentClassifyId = id;
            this.activeClassifyId = id;
            this.list = [];
            this.onRefresh();
        },
        onLoad() {
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
            this.finished = false;
            this.loading = true;
            this.page = 0;
            this.onLoad();
        },
        selectClassify(classifyId, index) {
            if (index >= 3 && this.activeClassifyId == classifyId) {
                this.classify[3].title= "全部";
                this.currentClassifyId = this.classify[0].id;
                this.activeClassifyId = null;
                this.list = [];
                this.onRefresh();
                this.showAllClassify =false;
                this.activeClassifyId = this.classify[0].id;
                return false;
            }
            this.classify[3].title = "全部";
            this.activeClassifyId = classifyId;
            this.showAllClassify = false;
            if (index < 3 && this.currentClassifyId != this.activeClassifyId) {
                this.currentClassifyId = this.activeClassifyId;
                this.list = [];
                this.onRefresh();
                return false;
            }
            let title = this.classify[3].title;
            this.classify[3].title =
                title + "/" + this.allClassify[index].title;
            this.currentClassifyId = this.activeClassifyId;
            this.list = [];
            this.onRefresh();
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