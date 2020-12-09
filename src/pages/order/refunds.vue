<template>
    <div class="refunds">
        <Back></Back>
    </div>
</template>

<script>
import Back from "../../components/backToPrevious/backToPrevious";

export default {
    data() {
        return {};
    },
    components: {
        Back,
    },
    created() {},
};
</script>

<style scoped lang="scss">
@import "../../static/css/common.scss";
@import "./refunds.scss";
</style>