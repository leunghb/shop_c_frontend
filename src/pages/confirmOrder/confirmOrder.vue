<template>
    <div class="confirmOrder fullscreen">
        <Back :headerTitle="'确认订单'"></Back>

        <van-address-list
            class="address"
            v-model="chosenAddressId"
            :list="address"
            default-tag-text="默认"
            @edit="selectAddress"
        />

        <div class="list">
            <van-card
                v-for="(item, index) in list"
                :key="index"
                :price="item.skuPrice.toFixed(2)"
                :num="item.numberOfpurchases"
                :desc="item.selectedSkuText"
                :title="item.mainTitle"
                :thumb="item.skuCover ? item.skuCover : item.cover"
            >
                <template #footer v-if="list.length > 1">
                    小计<span
                        v-text="item.skuPrice * item.numberOfpurchases"
                    ></span
                    >元
                </template>
            </van-card>
        </div>

        <van-submit-bar
            :price="totalPrice * 100"
            button-text="提交订单"
            @submit="onSubmit"
        />
    </div>
</template>

<script>
import Back from "../../components/backToPrevious/backToPrevious";
import { api, get, post } from "../../utils/httpApi";

export default {
    components: { Back },
    data() {
        return {
            chosenAddressId: "0",
            address: [],
            totalPrice: 0,
        };
    },
    created() {
        let data = JSON.parse(this.$route.query.data);
        data.forEach((v) => {
            this.totalPrice += Number(v.skuPrice) * Number(v.numberOfpurchases);
        });
        this.list = data;
        this.getAddressList();
    },
    methods: {
        getAddressList() {
            get(api.getAddressList)
                .then((res) => {
                    let data = res.data.data;
                    let temporaryAddress = JSON.parse(
                        localStorage.getItem("temporaryAddress")
                    );
                    this.address[0] =
                        temporaryAddress != null ? temporaryAddress : data[0];
                    this.chosenAddressId = this.address[0].id;
                })
                .catch((err) => {});
        },
        selectAddress() {
            this.$router.push({
                path: "/AddressList",
            });
        },
        onSubmit() {
            let list = this.list;
            list.forEach((v) => {
                v.skuCover = v.skuCover != null ? v.skuCover.replace(api.baseUrl, "") : v.cover.replace(api.baseUrl, "");
                v.cover = v.skuCover;
            });
            let params = this.$qs.stringify({
                addressId: this.address[0].id,
                totalPrice: this.totalPrice,
                info: JSON.stringify(list),
                type: this.$route.query.type,
            });
            post(api.addOrder, params)
                .then((res) => {
                    let data = res.data;
                    if (data.code == 0) {
                        this.$router.push({
                            path: "/Pay",
                            query: {
                                orderId: data.data.orderId,
                            },
                        });
                    }
                })
                .catch((err) => {
                    this.$toast(err.message);
                });
        },
    },
};
</script>

<style lang="scss" scoped>
@import "../../static/css/common.scss";
@import "./confirmOrder.scss";
</style>