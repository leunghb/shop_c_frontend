<template>
    <div class="navBar">
        <div
            :class="['item', $route.path == item.path ? 'active' : '']"
            v-for="(item, index) in navs"
            :key="index"
            @click="switchTab(item.path)"
        >
            <i :class="['iconfont', item.iconfont]"></i>
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
        };
    },
    created() {},
    methods: {
        switchTab(path) {
            this.$router.push({
                path: path,
            });
        },
    },
};
</script>

<style lang="scss" scoped>
@import "../../static/css/iconfont.css";
@import "./navBar.scss";
</style>