<template>
    <div class="refunds fullscreen">
        <Back :headerTitle="headerTitle"></Back>

        <div class="orderId" v-text="'订单编号：'+orderId"></div>

        <van-field
                class="cause"
                readonly
                clickable
                label="原因"
                :value="cause"
                placeholder="选择原因"
                @click="showPicker = true"
        />
        <van-popup v-model="showPicker" round position="bottom"
                   v-if="orderStatus == 1 || orderStatus == 2">
            <van-picker
                    show-toolbar
                    :columns="columns"
                    @cancel="showPicker = false"
                    @confirm="onConfirm"
            />
        </van-popup>
        <van-field
                class="description"
                :readonly="!(orderStatus == 1 || orderStatus == 2)"
                v-model="description"
                rows="2"
                autosize
                label="补充"
                type="textarea"
                maxlength="50"
                placeholder="请输入补充原因"
                show-word-limit
                onkeyup="this.value=this.value.replace(/^\s+|\s+$/g,'')"
        />
        <van-field name="uploader" label="图片">
            <template #input>
                <van-uploader v-model="uploader" multiple :max-count="3"
                              :disabled="!(orderStatus == 1 || orderStatus == 2)"/>
            </template>
        </van-field>
        <div class="submit">提交</div>
    </div>
</template>

<script>
    import Back from "../../components/backToPrevious/backToPrevious";

    export default {
        data() {
            return {
                headerTitle: "",

                orderStatus: null,
                orderId: null,

                cause: '',
                showPicker: false,
                columnsA: ["未收到货", "不想要了 / 拍错了", "其他"],
                columnsB: ["收到商品破损", "商品错发漏发", "收到商品与描述不符", "商品质量问题", "不想要了 / 拍错了", "其他"],
                description: null,
                uploader: []
            };
        },
        components: {
            Back,
        },
        created() {
            let query = this.$route.query;
            this.orderStatus = parseInt(query.orderStatus);
            this.orderId = query.orderId;
            switch (this.orderStatus) {
                case 1:
                    this.headerTitle = "申请退款";
                    break;
                case 2:
                    this.headerTitle = "申请退货退款";
                    break;
            }
        },
        methods: {
            onConfirm(val) {
                this.cause = val;
                console.log(this.cause);
                this.showPicker = false;
            },
        },
        computed: {
            columns() {
                if (this.orderStatus == 1) {
                    return this.columnsA;
                } else if (this.orderStatus == 2) {
                    return this.columnsB;
                }
            }
        }
    };
</script>

<style scoped lang="scss">
    @import "../../static/css/common.scss";
    @import "./refunds.scss";
</style>