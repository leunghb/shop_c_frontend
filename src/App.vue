<template>
    <div id="app">
        <router-view />
        <navBar v-if="showNavBar"></navBar>
    </div>
</template>

<script>
import navBar from "./components/navBar/navBar";
export default {
    name: "App",
    components: { navBar },
    data() {
        return {
            showNavBar: true,
        };
    },
    watch: {
        $route(newVal, oldVal) {
            let path = this.$route.path;
            this.showNavBar =
                path != "/" && path != "/Login" && path != "/Register";
        },
    },
};
</script>

<style>
</style>
