<template>
    <div class="main">
        <keep-alive>
            <router-view ref="page"></router-view>
        </keep-alive>
        <navBar></navBar>
    </div>
</template>

<script>
import navBar from "../../components/navBar/navBar";

export default {
    components: { navBar },
    data() {
        return {};
    },
    created() {
        const isLogin = document.cookie.includes("SHOPSESSIONID");
        if (!isLogin) this.$router.push({ path: "/Login" });
    },
    methods: {},
};
</script>

<style>
</style>