<template>
    <div class="goodsEvaluate">
        <Back></Back>

        <van-tabs class="tabs" v-model="active" @change="getGoodsEvaluateList">
            <van-tab title="全部"></van-tab>
            <van-tab title="好评"></van-tab>
            <van-tab title="中评"></van-tab>
            <van-tab title="差评"></van-tab>
        </van-tabs>

        <div class="list">
            <div class="item" v-for="item in list" :key="item.id">
                <img class="avatar" :src="item.avatar" alt="" />
                <div class="name singleLineOmission" v-text="item.name"></div>
                <van-rate
                    class="rate"
                    v-model="item.rate / 2"
                    :size="12"
                    allow-half
                    void-color="#888787"
                    color="#3391c9"
                />
                <div class="clearBoth"></div>
                <div
                    class="comment"
                    v-if="item.comment"
                    v-text="item.comment"
                ></div>
            </div>
        </div>
    </div>
</template>

<script>
import Back from "../../components/backToPrevious/backToPrevious";
import { api, post } from "../../utils/httpApi";

export default {
    name: "goodsEvaluate",
    components: { Back },
    data() {
        return {
            active: 0,
            list: [],
        };
    },
    created() {
        this.getGoodsEvaluateList();
    },
    methods: {
        getGoodsEvaluateList() {
            this.list = [];
            let params = this.$qs.stringify({
                goodsId: this.$route.query.goodsId,
                type: this.active == 0 ? null : this.active,
            });
            post(api.getGoodsEvaluateList, params)
                .then((res) => {
                    let data = res.data;
                    if (data.code == 0) {
                        let list = [];
                        data.data.forEach((v) => {
                            v.avatar = api.baseUrl + v.avatar;
                            list.push(v);
                        });
                        this.list = list;
                        return false;
                    }
                    this.$toast("暂无评论");
                })
                .catch((err) => {
                    this.$toast(err.message);
                });
        },
    },
};
</script>

<style scoped lang="scss">
@import "../../static/css/common";
@import "./goodsEvaluate";
</style>