<template>
    <div class="order fullscreen">
        <Back :headerTitle="'订单'"></Back>
        <van-tabs
            class="tabs"
            :ellipsis="false"
            v-model="currentTab"
            @click="selTab"
        >
            <van-tab
                v-for="(item, index) in tabs"
                :title="item.name"
                :key="index"
            >
            </van-tab>
        </van-tabs>

        <div class="list">
            <div
                class="item"
                v-for="item in list"
                :key="item.id"
                @click="toOrderDetail(item.orderId)"
            >
                <div class="time" v-text="item.time"></div>
                <div class="orderStatus" v-text="item.orderStatusText"></div>
                <div class="clearBoth"></div>
                <img
                    :src="infoItem.cover"
                    alt=""
                    v-for="(infoItem, infoIndex) in item.info"
                    :key="infoIndex"
                />
            </div>
        </div>

        <div class="none" v-if="list.length == 0 && isLoad" v-cloak>
            暂无订单
        </div>
    </div>
</template>

<script>
import Back from "../../components/backToPrevious/backToPrevious";
import { padNumber } from "../../utils/common";
import { post, api } from "../../utils/httpApi";

export default {
    data() {
        return {
            currentTab: 0,
            tabs: [
                {
                    name: "全部",
                    orderStatus: null,
                },
                {
                    name: "未支付",
                    orderStatus: 0,
                },
                {
                    name: "已支付",
                    orderStatus: 1,
                },
                {
                    name: "已完成",
                    orderStatus: 2,
                },
            ],
            list: [],
            isLoad: false,
            orderStatusText: ["未支付", "已支付", "交易完成", "已取消"],
        };
    },
    components: { Back },
    created() {
        this.getOrderList();
    },
    methods: {
        selTab(name) {
            this.getOrderList(this.tabs[name].orderStatus);
        },
        getOrderList(orderStatus) {
            this.list = [];
            this.isLoad = false;
            let params = this.$qs.stringify({
                orderStatus: orderStatus,
            });
            post(api.getOrderList, params).then((res) => {
                let data = res.data;
                if (data.code == 0) {
                    data.data.forEach((v) => {
                        let time = new Date(v.createdAt);
                        v.time =
                            time.getFullYear() +
                            "." +
                            padNumber(time.getMonth(), 2) +
                            "." +
                            padNumber(time.getDate(), 2) +
                            " " +
                            padNumber(time.getHours(), 2) +
                            ":" +
                            padNumber(time.getMinutes(), 2) +
                            ":" +
                            padNumber(time.getSeconds(), 2);
                        v.info = JSON.parse(v.info);
                        v.orderStatusText = this.orderStatusText[v.orderStatus];
                        v.info.forEach((infoV) => {
                            infoV.cover = api.baseUrl + infoV.cover;
                            infoV.skuCover = infoV.cover;
                        });
                    });
                    this.list = data.data;
                }
                this.isLoad = true;
            });
        },
        toOrderDetail(orderId) {
            this.$router.push({
                path: "/OrderDetail",
                query: {
                    orderId: orderId,
                },
            });
        },
    },
    beforeRouteEnter(to, from, next) {
        if (to.name == "Order" && from.name == "My") {
            to.meta.isNeetRefresh = true;
        }
        next();
    },
    activated() {
        if (this.$route.meta.isNeetRefresh) {
            this.currentTab = 0;
            this.list = [];
            this.getOrderList();
        }
    },
    beforeRouteLeave(to, from, next) {
        from.meta.isNeetRefresh = false;
        if (to.name == "My") {
            this.isLoad = false;
        }
        next();
    },
};
</script>

<style scoped lang="scss">
@import "../../static/css/common.scss";
@import "./order.scss";
</style>