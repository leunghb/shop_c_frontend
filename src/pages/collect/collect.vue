<template>
    <div class="collect fullscreen">
        <Back :headerTitle="'收藏'"></Back>

        <div class="list">
            <van-card
                    v-for="item in list"
                    :price="item.discountPrice>0?item.discountPrice.toFixed(2):item.originalPrice.toFixed(2)"
                    :origin-price="item.discountPrice > 0 ?item.originalPrice.toFixed(2):null"
                    :title="item.mainTitle"
                    :thumb="item.cover"
                    :key="item.goodsId"
                    @click="toGoodsDetail(item.goodsId)"
            >
                <template #tags>
                    <van-tag plain type="danger" v-text="'收藏时间：'+item.collectTime"></van-tag>
                </template>
            </van-card>
        </div>
    </div>
</template>

<script>
    import {api, get} from "../../utils/httpApi";
    import {formatDate} from "../../utils/common";
    import Back from "../../components/backToPrevious/backToPrevious";

    export default {
        name: "collect",
        components: {Back},
        data() {
            return {
                list: []
            }
        },
        created() {
            this.getUserGoodsCollectList();
        },
        methods: {
            getUserGoodsCollectList() {
                get(api.getUserGoodsCollectList).then(res => {
                    let data = res.data;
                    if (data.code == 0) {
                        let list = [];
                        data.data.forEach(v => {
                            v.cover = api.baseUrl + v.cover.split(",")[0];
                            v.collectTime = formatDate(v.createdAt);
                            list.push(v);
                        })
                        this.list = list;
                        console.log(list);
                    }
                })
            },
            toGoodsDetail(goodsId) {
                this.$router.push({
                    path: "/GoodsDetail",
                    query: {
                        goodsId: goodsId,
                    },
                });
            },
        }
    }
</script>

<style scoped lang="scss">
    @import "../../static/css/common";
    @import "./collect";
</style>