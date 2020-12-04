<template>
    <div class="orderDetail fullscreen">
        <Back :headerTitle="'订单详情'"></Back>
    </div>
</template>

<script>
import Back from "../../components/backToPrevious/backToPrevious";
import { api, post } from "../../utils/httpApi";

export default {
    data() {
        return {};
    },
    components: {
        Back,
    },
    created() {
        this.getOrderDetail();
    },
    methods: {
        getOrderDetail() {
            let orderId = this.$route.query.orderId;
            let params = this.$qs.stringify({
                orderId: orderId,
            });
            post(api.getOrderDetail, params)
                .then((res) => {
                    let data = res.data;
                    console.log(data);
                })
                .catch((err) => {
                    this.$toast(err.message);
                });
        },
    },
};
</script>

<style scoped lang="scss">
@import "../../static/css/common.scss";
@import "./orderDetail.scss";
</style>