<template>
    <div class="navBar">
        <div
            :class="['item', currentNavIndex == index ? 'active' : '']"
            v-for="(item, index) in navs"
            :key="index"
            @click="switchTab(item.path, index)"
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
                    path: "/home",
                    iconfont: "iconshangcheng",
                },
                {
                    label: "购物车",
                    path: "/cart",
                    iconfont: "icongouwucheshangcheng-xianxing",
                },
                {
                    label: "我的",
                    path: "/my",
                    iconfont: "iconbiaoqianA01_wode-80",
                },
            ],
            currentNavIndex: 0,
        };
    },
    created() {},
    methods: {
        switchTab(path, index) {
            this.$router.push({
                path: path,
            });
            this.currentNavIndex = index;
        },
    },
};
</script>

<style lang="scss" scoped>
@import "../../static/css/iconfont.css";
@import "./navBar.scss";
</style>