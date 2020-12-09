<template>
    <div class="orderDetail fullscreen">
        <Back :headerTitle="info.orderStatusText"></Back>

        <div
            class="countdown"
            v-if="info.orderStatus < 2 && countdown != 0"
            v-cloak
        >
            <span>订单于</span>
            <van-count-down
                :time="countdown"
                format="HH 时 mm 分 ss 秒"
                @finish="countdownFinish"
            />
            <span
                >后自动{{ info.orderStatus == 0 ? "取消" : "收货并关闭" }}</span
            >
        </div>

        <van-address-list
            :class="['address', info.orderStatus != 0 ? 'disabledAddress' : '']"
            v-model="chosenAddressId"
            :list="address"
            default-tag-text="默认"
            @edit="selectAddress"
        />

        <div class="list">
            <van-card
                v-for="(item, index) in goodsList"
                :key="index"
                :price="item.skuPrice.toFixed(2)"
                :num="item.numberOfpurchases"
                :desc="item.selectedSkuText"
                :title="item.mainTitle"
                :thumb="item.skuCover ? item.skuCover : item.cover"
            >
                <template #footer>
                    小计<span
                        v-text="item.skuPrice * item.numberOfpurchases"
                    ></span
                    >元
                </template>
            </van-card>
        </div>

        <van-submit-bar
            :price="totalPrice * 100"
            button-text="支付"
            @submit="onSubmit"
        >
            <i
                v-if="info.orderStatus != 3"
                class="operate iconfont iconfenlei"
                @click="showOperate = true"
            ></i>
        </van-submit-bar>

        <van-action-sheet
            class="operateSheet"
            :actions="_operateActions"
            v-model="showOperate"
            title="订单操作"
            @select="operateSelect"
        >
        </van-action-sheet>
    </div>
</template>

<script>
import Back from "../../components/backToPrevious/backToPrevious";
import { api, post } from "../../utils/httpApi";
import { orderStatusText } from "../../utils/common";

export default {
    data() {
        return {
            countdown: null,

            info: {},

            chosenAddressId: "0",
            address: [],

            goodsList: [],

            totalPrice: 0,

            showOperate: false,
            operateActions: [
                { name: "取消订单", id: 0 },
                { name: "确认收货", id: 1 },
                { name: "退款", id: 2 },
                { name: "退货退款", id: 3 },
                { name: "评价", id: 4 },
                { name: "退款详情", id: 5 },
                { name: "退货退款详情", id: 6 },
                { name: "评价详情", id: 7 },
            ],
        };
    },
    components: {
        Back,
    },
    created() {
        localStorage.setItem("paySuccessBackLevel", -1);
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
                    let dataa = res.data;
                    if (dataa.code == 0) {
                        let data = dataa.data;
                        data.orderStatusText =
                            "订单" + orderStatusText(data.orderStatus);
                        this.info = data;

                        let countdown = null;
                        if (data.orderStatus == 0) {
                            //未支付
                            countdown = new Date(data.createdAt);
                            countdown = countdown.setMinutes(
                                countdown.getMinutes() + data.paymentLimitTime
                            );
                        } else if (data.orderStatus == 1) {
                            //已支付
                            countdown = new Date(data.payTime);
                            countdown = countdown.setMinutes(
                                countdown.getMinutes() + data.closeLimitTime
                            );
                        }
                        if (data.orderStatus == 0 || data.orderStatus == 1) {
                            countdown = new Date(countdown).getTime();
                            this.countdown = countdown - new Date().getTime();
                        }
                        if (this.countdown == 0) {
                            this.countdownFinish();
                        }
                        let params = this.$qs.stringify({
                            id: this.info.addressId,
                        });
                        post(api.getAddress, params)
                            .then((res) => {
                                let data = res.data.data;
                                let temporaryAddress = JSON.parse(
                                    localStorage.getItem("temporaryAddress")
                                );
                                this.address[0] =
                                    temporaryAddress != null
                                        ? temporaryAddress
                                        : data;
                                this.chosenAddressId = this.address[0].id;
                            })
                            .catch((err) => {
                                this.$toast(err.message);
                            });

                        let goodsList = JSON.parse(data.info);
                        goodsList.forEach((v) => {
                            v.cover = api.baseUrl + v.cover;
                            v.skuCover = v.cover;
                            this.totalPrice +=
                                Number(v.skuPrice) *
                                Number(v.numberOfpurchases);
                        });
                        this.goodsList = goodsList;
                        this.$nextTick(() => {
                            if (this.info.orderStatus != 0)
                                document.querySelector(
                                    ".van-submit-bar__button"
                                ).style.display = "none";
                        });

                        this.changeOrderListOrderStatus();
                        return false;
                    }
                    this.$toast(data.message);
                })
                .catch((err) => {
                    this.$toast(err.message);
                });
        },
        countdownFinish() {
            let orderStatus = this.info.orderStatus;
            if (orderStatus > 1) return false;
            let params = this.$qs.stringify({
                orderId: this.info.orderId,
            });
            post(orderStatus == 0 ? api.cancelOrder : api.closeOrder, params)
                .then((res) => {
                    let data = res.data;
                    if (data.code == 0) {
                        this.info.orderStatus = orderStatus == 0 ? 3 : 2;
                        this.info.orderStatusText =
                            "订单" + orderStatusText(this.info.orderStatus);
                        this.changeOrderListOrderStatus();
                        return false;
                    }
                })
                .catch((err) => {
                    this.$toast(err.message);
                });
        },
        selectAddress() {
            if (this.info.orderStatus != 0) return false;
            this.$router.push({
                path: "/AddressList",
            });
        },
        onSubmit() {
            this.$router.push({
                path: "/Pay",
                query: {
                    orderId: this.info.orderId,
                    addressId: this.address[0].id,
                },
            });
        },
        changeOrderListOrderStatus() {
            let obj = {
                index: parseInt(this.$route.query.index),
                orderStatus: this.info.orderStatus,
            };
            localStorage.setItem(
                "changeOrderListOrderStatus",
                JSON.stringify(obj)
            );
        },
        operateSelect(actions, index) {
            let id = actions.id;
            if (id == 0 || id == 1) {
                this.countdownFinish();
            }
            if (id == 2 || id == 3 || id == 5 || id == 6) {
                this.$router.push({
                    path: "/Refunds",
                });
            }
            this.showOperate = false;
        },
    },
    computed: {
        _operateActions() {
            let operateActions = this.operateActions;
            let orderStatus = this.info.orderStatus;
            let arr = [];
            switch (orderStatus) {
                case 0:
                    arr.push(operateActions[0]);
                    break;
                case 1:
                    arr.push(operateActions[1]);
                    arr.push(operateActions[2]);
                    break;
                case 2:
                    arr.push(operateActions[3]);
                    break;
                case (4, 6):
                    arr.push(operateActions[5]);
                    break;
                case (5, 7):
                    arr.push(operateActions[6]);
                    break;
            }
            return arr;
        },
    },
};
</script>

<style scoped lang="scss">
@import "../../static/css/common.scss";
@import "./orderDetail.scss";
@import "../../static/css/iconfont.css";
</style>