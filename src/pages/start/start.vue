<template>
    <div class="start fullscreen"></div>
</template>

<script>
export default {
    data() {
        return {
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
};
</script>

<style lang="scss" scoped>
@import "../../static/css/common.scss";
.start {
    background-image: url("../../assets/start-bg.png");
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
}
</style>