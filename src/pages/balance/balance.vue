<template>
    <div class="balance fullscreen">
        <Back :headerTitle="'余额'"></Back>

        <div class="info">
            <img class="icon" src="../../assets/balance-icon.png" alt=""/>
            <div class="number" v-text="userBalance"></div>
        </div>

        <div class="list">
            <div class="item" v-for="(item, index) in list" :key="index"
                 @click="toPage(item.orderId, index, item.useType, item.time, item.useAmount)">
                <div class="useAmount" v-text="item.useAmount"></div>
                <van-icon name="arrow"/>
                <div class="time" v-text="item.time"></div>
            </div>
        </div>
    </div>
</template>

<script>
    import Back from "../../components/backToPrevious/backToPrevious";
    import {padNumber} from "../../utils/common";
    import {api, get} from "../../utils/httpApi";

    export default {
        data() {
            return {
                list: [],

                userBalance: 0,
            };
        },
        components: {Back},
        created() {
            this.getUserBalanceRecord();
            this.getUserBalance();
        },
        methods: {
            getUserBalanceRecord() {
                get(api.getUserBalanceRecord)
                    .then((res) => {
                        let data = res.data.data;
                        data.forEach((v) => {
                            let time = new Date(v.createdAt);
                            v.useAmount = v.useAmount.toFixed(2);
                            v.useAmount =
                                v.useType == 0
                                    ? "+￥" + v.useAmount
                                    : "-￥" + v.useAmount;
                            v.time =
                                time.getFullYear() +
                                "." +
                                padNumber(time.getMonth(), 2) +
                                "." +
                                padNumber(time.getDate(), 2) +
                                " " +
                                padNumber(time.getHours(), 2) +
                                ":" +
                                padNumber(time.getMinutes(), 2);
                        });
                        this.list = data;
                    })
                    .catch((err) => {
                        this.$toast(err.message);
                    });
            },
            getUserBalance() {
                get(api.getUserBalance).then((res) => {
                    this.userBalance = res.data;
                });
            },
            toPage(orderId, index, useType, time, useAmount) { //useType 0-充值  1-消费
                if (useType == 1) {
                    this.toOrderDetail(orderId, index);
                    return false;
                }
                this.$dialog.alert({
                    message: "于" + time + "充值" + useAmount.replace("+", ""),
                }).then(() => {
                    // on close
                });
            },
            toOrderDetail(orderId, index) {
                this.$router.push({
                    path: "/OrderDetail",
                    query: {
                        orderId: orderId,
                        index: index,
                    },
                });
            },
        },
    };
</script>

<style scoped lang="scss">
    @import "../../static/css/common.scss";
    @import "./balance.scss";
</style>