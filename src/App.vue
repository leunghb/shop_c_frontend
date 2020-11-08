<template>
    <div id="app">
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
</template>

<script>
import { platformLimit } from "./utils/common";

export default {
    name: "App",
    created() {
        const ENV = process.env.NODE_ENV;
        if (ENV == "production" && platformLimit()) {
            this.$router.push({
                path: "/Error",
                query: {
                    errorTitle: "请在手机打开",
                },
            });
        }
    },
};
</script>

<style>
</style>
