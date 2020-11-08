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
                <van-cell class="item" v-for="item in list" :key="item">
                    <img class="cover" src="" alt="" />
                    <div class="info">
                        <div class="title singleLineOmission">
                            标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题
                        </div>
                        <div class="price">
                            <div class="originalPrice">
                                <span>￥</span><span>11.00</span>
                            </div>
                        </div>
                    </div>
                </van-cell>
            </van-list>
        </van-pull-refresh>
    </div>
</template>

<script>
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
            loading: false,
            finished: false,
            refreshing: false,
            headerBgWhite: false,
        };
    },
    created() {
        document.documentElement.scrollTop = 300;
    },
    methods: {
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
            setTimeout(() => {
                if (this.refreshing) {
                    this.list = [];
                    this.refreshing = false;
                }

                for (let i = 0; i < 11; i++) {
                    this.list.push(this.list.length + 1);
                }
                this.loading = false;

                if (this.list.length >= 40) {
                    this.finished = true;
                }
            }, 1000);
        },
        onRefresh() {
            // 清空列表数据
            this.finished = false;
            // 重新加载数据
            // 将 loading 设置为 true，表示处于加载状态
            this.loading = true;
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