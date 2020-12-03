<template>
    <div class="pay">
        <Back :headerTitle="'支付'"></Back>

        <div class="payType">
            <div class="item" v-for="item in list" :key="item.id">
                <div class="label" v-text="item.label"></div>
                <span
                    class="userBalance"
                    v-if="item.id == 0"
                    v-text="'（￥' + userBalance + '）'"
                ></span>
                <div class="checked"></div>
            </div>
        </div>

        <div class="submit" @click="submit">
            <span v-show="!duringThePayment">确认支付</span>
            <van-loading color="#fff" v-show="duringThePayment"
                >支付中</van-loading
            >
        </div>
    </div>
</template>

<script>
import Back from "../../components/backToPrevious/backToPrevious";
import { api, get, post } from "../../utils/httpApi";

export default {
    data() {
        return {
            list: [
                {
                    id: 0,
                    label: "余额",
                },
            ],
            duringThePayment: false,
            userBalance: 0,
        };
    },
    components: { Back },
    created() {
        this.getUserBalance();
    },
    methods: {
        getUserBalance() {
            get(api.getUserBalance).then((res) => {
                this.userBalance = res.data;
            });
        },
        submit() {
            this.duringThePayment = true;
            let orderId = this.$route.query.orderId;
            let params = this.$qs.stringify({
                orderId: orderId,
            });
            post(api.pay, params)
                .then((res) => {
                    let data = res.data;
                    if (data.code == 0) {
                        this.$toast("支付成功");
                        this.getUserBalance();
                        let time = setTimeout(() => {
                            this.$router.go(
                                localStorage.getItem("paySuccessBackLevel")
                            );
                            clearTimeout(time);
                        }, 1200);
                        return false;
                    }
                    this.duringThePayment = false;
                })
                .catch((err) => {
                    this.duringThePayment = false;
                    this.$toast(err.message);
                });
        },
    },
};
</script>

<style lang="scss" scoped>
@import "./pay.scss";
</style>