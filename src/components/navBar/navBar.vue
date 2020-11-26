<template>
    <div class="navBar">
        <div
            :class="['item', $route.path == item.path ? 'active' : '']"
            v-for="(item, index) in navs"
            :key="index"
            @click="switchTab(item.path, index)"
        >
            <i
                :class="['iconfont', item.iconfont]"
                v-show="index == 0 && !canBackToTop"
            ></i>
            <van-icon
                class="backToTop"
                name="arrow-up"
                v-show="index == 0 && canBackToTop"
            />
            <i :class="['iconfont', item.iconfont]" v-if="index != 0"></i>
            <div class="label" v-text="item.label"></div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            navs: [
                {
                    label: "首页",
                    path: "/",
                    iconfont: "iconshangcheng",
                },
                {
                    label: "购物车",
                    path: "/Cart",
                    iconfont: "icongouwucheshangcheng-xianxing",
                },
                {
                    label: "我的",
                    path: "/My",
                    iconfont: "iconbiaoqianA01_wode-80",
                },
            ],
            canBackToTop: false,
        };
    },
    created() {},
    methods: {
        switchTab(path, index) {
            if (index == 0) {
                this.$emit("homePageScrollTop", true);
            }
            this.$router.push({
                path: path,
            });
        },
        scrollHandle(e) {
            let top = e.srcElement.scrollingElement.scrollTop;
            this.canBackToTop = top >= 300;
        },
    },
    mounted() {
        window.addEventListener("scroll", this.scrollHandle);
    },
};
</script>

<style lang="scss" scoped>
@import "../../static/css/iconfont.css";
@import "./navBar.scss";
</style>