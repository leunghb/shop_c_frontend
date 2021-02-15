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
                v-for="(item, index) in list"
                :key="item.id"
                @click="toOrderDetail(item.orderId, index)"
            >
                <div class="time" v-text="'下单：' + item.time"></div>
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
import { orderStatusText, padNumber } from "../../utils/common";
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
                    name: "已收货",
                    orderStatus: 2,
                },
                {
                    name: "已完成",
                    orderStatus: 8,
                },
                {
                    name: "退货/退款中",
                    orderStatus: 3,
                },
                {
                    name: "已退货/退款",
                    orderStatus: 4,
                },
            ],
            list: [],
            isLoad: false,
        };
    },
    components: { Back },
    created() {
        this.getOrderList(-1);
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
                    let list = data.data.list;
                    list.forEach((v) => {
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
                        v.orderStatusText = orderStatusText(v.orderStatus);
                        v.info.forEach((infoV) => {
                            infoV.cover = api.baseUrl + infoV.cover;
                            infoV.skuCover = infoV.cover;
                        });
                    });
                    this.list = list;
                }
                this.isLoad = true;
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
    beforeRouteEnter(to, from, next) {
        if (to.name == "Order" && from.name == "My") {
            to.meta.isNeetRefresh = true;
        }
        next();
    },
    activated() {
        let changeOrderListOrderStatus = JSON.parse(
            localStorage.getItem("changeOrderListOrderStatus")
        );
        localStorage.removeItem("changeOrderListOrderStatus");
        if (
            changeOrderListOrderStatus != null &&
            this.list != undefined &&
            this.list.length != 0
        ) {
            let index = changeOrderListOrderStatus.index;
            let orderStatus = changeOrderListOrderStatus.orderStatus;
            this.list[index].orderStatus = orderStatus;
            this.list[index].orderStatusText = orderStatusText(orderStatus);
        }

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