<template>
    <div class="balance fullscreen">
        <Back :headerTitle="'余额'"></Back>

        <div class="info">
            <img class="icon" src="../../assets/balance-icon.png" alt="" />
            <div class="number" v-text="userBalance"></div>
        </div>

        <div class="list">
            <div class="item" v-for="(item, index) in list" :key="index">
                <div class="useAmount" v-text="item.useAmount"></div>
                <van-icon name="arrow" />
                <div class="time" v-text="item.time"></div>
            </div>
        </div>
    </div>
</template>

<script>
import Back from "../../components/backToPrevious/backToPrevious";
import { padNumber } from "../../utils/common";
import { api, get } from "../../utils/httpApi";

export default {
    data() {
        return {
            list: [],

            userBalance: 0,
        };
    },
    components: { Back },
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
    },
};
</script>

<style scoped lang="scss">
@import "../../static/css/common.scss";
@import "./balance.scss";
</style>