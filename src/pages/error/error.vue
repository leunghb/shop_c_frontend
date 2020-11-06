<template>
    <div class="error">
        <div class="title" v-text="errorTitle"></div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            errorTitle: "",
        };
    },
    created() {
        this.errorTitle = this.$route.query.errorTitle;
    },
};
</script>

<style>
.error {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    font-size: 30px;
}
</style>