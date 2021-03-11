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
import { api, get } from "./utils/httpApi";

export default {
    name: "App",
    created() {
        const ENV = process.env.NODE_ENV;
        if (ENV == "production" && platformLimit()) {
            // this.$router.push({
            //     path: "/Error",
            //     query: {
            //         errorTitle: "请在手机打开",
            //     },
            // });
        }

        get(api.getUserInfo)
            .then((res) => {
                if (res.data.code != 0) {
                    localStorage.clear();
                    this.$router.replace({
                        path: "/Login",
                    });
                }
            })
            .catch((err) => {});
    },
};
</script>

<style>
</style>
