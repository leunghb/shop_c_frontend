<template>
    <div class="orderDetail fullscreen">
        <Back :headerTitle="info.orderStatusText"></Back>

        <div class="countdown" v-if="info.orderStatus < 2 && countdown != 0">
            <span>订单于</span>
            <van-count-down
                :time="countdown"
                format="HH 时 mm 分 ss 秒"
                @finish="countdownFinish"
            />
            <span>后自动{{ info.orderStatus == 0 ? "取消" : "关闭" }}</span>
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
            <div
                class="refunds"
                v-text="info.orderStatus == 1 ? '退货退款' : ''"
            ></div>
            <div class="comment">评论</div>
        </van-submit-bar>
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
        };
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
                    let dataa = res.data;
                    if (dataa.code == 0) {
                        let data = dataa.data;
                        console.log(data);
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
                        return false;
                    }
                    this.$toast(data.message);
                })
                .catch((err) => {
                    this.$toast(err.message);
                });
        },
        countdownFinish() {
            if (this.info.orderStatus > 1) return false;
            let params = this.$qs.stringify({
                orderId: this.info.orderId,
            });
            post(
                this.info.orderStatus == 0 ? api.cancelOrder : api.closeOrder,
                params
            )
                .then((res) => {
                    let data = res.data;
                    if (data.code == 0) {
                        this.$router.go(0);
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
    },
};
</script>

<style scoped lang="scss">
@import "../../static/css/common.scss";
@import "./orderDetail.scss";
</style>