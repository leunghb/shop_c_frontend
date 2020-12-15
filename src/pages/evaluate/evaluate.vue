<template>
    <div class="evaluate fullscreen">
        <Back :headerTitle="'评价'"></Back>

        <div class="goodsInfo" v-text="goodsName+'（'+goodsSkuText+'）'"></div>


        <van-field class="rate" name="rate" label="评分">
            <template #input>
                <van-rate v-model="rate" :size="20" allow-half void-icon="star" void-color="#eee"
                          color="#3391c9" :readonly="isReadonly"/>
            </template>
        </van-field>
        <van-field
                class="comment"
                v-model="comment"
                rows="1"
                autosize
                label="评论"
                type="textarea"
                maxlength="200"
                placeholder="请输入评论"
                :show-word-limit="showWordLimit"
        />

        <div class="submit" @click="submit" v-if="!isReadonly" v-cloak>提交</div>
    </div>
</template>

<script>
    import Back from "../../components/backToPrevious/backToPrevious";
    import {api, post} from "../../utils/httpApi";

    export default {
        name: "evaluate",
        components: {Back},
        data() {
            return {
                goodsId: null,
                orderId: null,
                goodsName: null,
                goodsSkuText: null,
                goodsSpecsId: null,

                rate: 0,
                isReadonly: false,

                comment: null,
                showWordLimit: true
            }
        },
        created() {
            let query = this.$route.query;
            this.goodsId = query.goodsId;
            this.orderId = query.orderId;
            this.goodsName = query.goodsName;
            this.goodsSkuText = query.goodsSkuText;
            this.goodsSpecsId = parseInt(query.goodsSpecsId);
            this.selEvaluate();
        },
        methods: {
            selEvaluate() {
                let params = this.$qs.stringify({
                    orderId: this.orderId,
                    goodsId: this.goodsId,
                    goodsSpecsId: this.goodsSpecsId
                })
                post(api.selEvaluate, params).then(res => {
                    let data = res.data;
                    if (data.code == 0) {
                        this.isReadonly = true;
                        this.showWordLimit = false;
                        this.rate = data.data[0].rate / 2;
                        this.comment = data.data[0].comment.length > 0 ? data.data[0].comment : "暂无评论";
                        return false;
                    }
                }).catch(err => {
                })
            },
            submit() {
                if (this.rate == 0) {
                    this.$toast("请先评分");
                    return false;
                }
                let params = this.$qs.stringify({
                    orderId: this.orderId,
                    goodsId: this.goodsId,
                    goodsSpecsId: this.goodsSpecsId,
                    rate: this.rate * 2,
                    comment: this.comment
                })
                post(api.addEvaluate, params).then(res => {
                    let data = res.data;
                    if (data.code == 0) {
                        this.$toast("评价成功");
                        let time = setTimeout(() => {
                            this.$router.go(-1);
                        }, 1200)
                        return false;
                    }
                    this.$toast(data.message);
                }).catch(err => {
                    this.$toast(err.message);
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../../static/css/common.scss";
    @import "./evaluate.scss";
</style>