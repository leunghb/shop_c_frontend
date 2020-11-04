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
            time: 1,
        };
    },
    created() {
        let that = this;
        let timer = setInterval(() => {
            if (that.time > 0) {
                --that.time;
            } else {
                clearTimeout(timer);
                if (document.cookie.includes("SHOPSESSIONID")) {
                    this.switchTab("/Home", 0);
                    return false;
                }
                this.$router.push({
                    path: "/Login",
                });
            }
        }, 1000);
    },
    methods: {
        switchTab(path, index) {
            this.currentNavIndex = index;
            console.log("====");
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