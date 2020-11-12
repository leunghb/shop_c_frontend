<template>
    <div class="back">
        <van-icon class="backIcon" name="arrow-left" @click="back()" />
        <div class="title" v-text="headerTitle"></div>
    </div>
</template>

<script>
export default {
    name: "back",
    data() {
        return {};
    },
    props: ["headerTitle"],
    methods: {
        back() {
            this.$router.go(-1);
        },
    },
};
</script>

<style lang="scss" scoped>
.back {
    position: fixed;
    top: 0;
    width: 100%;
    height: 45px;
    line-height: 45px;
    text-align: center;
    .backIcon {
        position: absolute;
        left: 15px;
        height: 100%;
        font-size: 22px;
        line-height: 45px;
        color: #000;
    }
    .title {
        font-size: 18px;
        font-weight: 500;
        color: #000;
    }
}
</style>