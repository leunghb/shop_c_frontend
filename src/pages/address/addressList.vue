<template>
    <div class="addressList fullscreen">
        <Back :headerTitle="'我的地址'"></Back>
        <div class="list">
            <van-address-list
                v-model="chosenAddressId"
                :list="list"
                default-tag-text="默认"
                @add="addAddress"
                @edit="editAddress"
            />
        </div>
    </div>
</template>

<script>
import Back from "../../components/backToPrevious/backToPrevious";
import { api, get } from "../../utils/httpApi";

export default {
    data() {
        return {
            chosenAddressId: "1",
            list: [],
        };
    },
    components: {
        Back,
    },
    created() {
        this.getAddressList();
    },
    methods: {
        getAddressList() {
            get(api.getAddressList)
                .then((res) => {
                    let data = res.data.data;
                    data.forEach((v) => {
                        v.isDefault = v.isDefault == 1 ? true : false;
                    });
                    this.list = data;
                })
                .catch((err) => {
                    this.$toast(err.message);
                });
        },
        addAddress() {
            if (this.list.length == 6) {
                this.$toast("最多添加六个地址");
                return false;
            }
            this.$router.push({
                path: "/AddressDetail",
                query: {
                    type: 0,
                },
            });
        },
        editAddress(item, index) {
            let info = JSON.stringify({
                item: item,
            });
            this.$router.push({
                path: "/AddressDetail",
                query: {
                    info: info,
                    type: 1,
                },
            });
        },
    },
};
</script>

<style lang="scss" scoped>
@import "../../static/css/common.scss";
@import "./addressList.scss";
</style>