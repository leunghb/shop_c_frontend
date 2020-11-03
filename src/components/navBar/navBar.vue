<template>
    <div class="navBar">
        <div
            class="item"
            v-for="(item, index) in navs"
            :key="index"
            @click="switchTab(item.path)"
        >
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
                },
                {
                    label: "购物车",
                    path: "/cart",
                },
                {
                    label: "我的",
                    path: "/my",
                },
            ],
            time: 1,
        };
    },
    created() {
        let that = this;
        let timer = setInterval(() => {
            if (that.time > 0) {
                that.time--;
            } else {
                clearTimeout(timer);
                if (document.cookie.includes("shopSessionId")) {
                    this.switchTab("/Home");
                    return false;
                }
                this.$router.push({
                    path: "/Login",
                });
            }
        }, 1000);
    },
    methods: {
        switchTab(path) {
            console.log(path);
            this.$router.push({
                path: path,
            });
        },
    },
};
</script>

<style lang="scss" scoped>
$navNum: 3;
.navBar {
    position: fixed;
    left: 0;
    bottom: 0;
    height: 48px;
    width: 100vw;
    border-top: 1px solid #eee;
    .item {
        display: inline-block;
        width: calc(100vw / #{$navNum});
        text-align: center;
        line-height: 48px;
    }
}
</style>