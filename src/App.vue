<template>
    <div id="app">
        <router-view />
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
