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
        <van-field name="uploader" label="图片" v-if="orderStatus == 2 || orderStatus == 5 || orderStatus == 7">
            <template #input>
                <van-uploader v-model="uploader" multiple :max-count="3" :max-size="500 * 1024" @oversize="onOversize"
                              :disabled="!(orderStatus == 1 || orderStatus == 2)"/>
            </template>
        </van-field>

        <div class="submit" @click="submit" v-if="orderStatus == 1 || orderStatus == 2">提交</div>
        <div class="submit" @click="cancel" v-else>取消</div>
    </div>
</template>

<script>
    import Back from "../../components/backToPrevious/backToPrevious";
    import {api, post} from "../../utils/httpApi";

    export default {
        data() {
            return {
                headerTitle: "",

                info: {},

                orderStatus: null,
                orderId: null,
                type: null,

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
                case 4:
                    this.headerTitle = "申请退款";
                    this.type = 0;
                    break;
                case 2:
                case 5:
                    this.headerTitle = "申请退货退款";
                    this.type = 1;
                    break;
            }
            this.getRefunds();
            this.getOrderDetail();
        },
        methods: {
            onConfirm(val) {
                this.cause = val;
                this.showPicker = false;
            },
            getRefunds() {
                let params = this.$qs.stringify({
                    orderId: this.orderId
                })
                post(api.getRefunds, params).then(res => {
                    let data = res.data;
                    if (data.code == 0) {
                        let info = data.data;
                        this.info = info;
                        this.cause = info.cause;
                        this.description = info.description;
                        this.headerTitle += "中";
                        let image = info.image.split(",");
                        image.forEach(v => {
                            this.uploader.push({url: api.baseUrl + v})
                        })
                    }
                }).catch(err => {
                    this.$toast(err.message);
                })
            },
            getOrderDetail() {
                let params = this.$qs.stringify({
                    orderId: this.orderId,
                });
                post(api.getOrderDetail, params)
                    .then((res) => {
                        let data = res.data;
                        if (data.code == 0) {
                            this.orderStatus = data.data.orderStatus;
                            if (this.orderStatus != 1 && this.orderStatus != 2) document.querySelector(".van-field__word-limit").style.display = "none";
                        }
                    })
                    .catch((err) => {
                        this.$toast(err.message);
                    });
            },
            submit() {
                if (this.cause.length == 0) {
                    this.$toast("请选择原因");
                    return false;
                }
                let params = new FormData();
                params.append("orderId", this.orderId);
                params.append("type", this.type);
                params.append("cause", this.cause);
                if (this.description.length > 0) {
                    params.append("description", this.description);
                }
                this.uploader.forEach(v => {
                    params.append("file", v.file);
                    params.append("fileType", 1);
                })
                post(api.addRefunds, params).then(res => {
                    let data = res.data;
                    if (data.code == 0) {
                        this.$toast("申请成功");
                        let time = setTimeout(() => {
                            this.$router.go(-1);
                            clearTimeout(time);
                        }, 1200)
                        return false;
                    }
                    this.$toast("申请失败");
                }).catch(err => {
                    this.$toast(err.message);
                })
            },
            cancel() {
                let title = this.headerTitle + (this.orderStatus == 4 ? "取消将直接完成收货" : "取消将直接关闭订单");
                this.$dialog.confirm({
                    title: title,
                })
                    .then(() => {
                        let params = this.$qs.stringify({
                            orderId: this.orderId,
                            refundsType: this.type
                        })
                        post(api.cancelRefunds, params).then(res => {
                            let data = res.data;
                            if (data.code == 0) {
                                this.$toast("取消成功");
                                let time = setTimeout(() => {
                                    this.$router.go(-1);
                                    clearTimeout(time);
                                }, 1200)
                                return false;
                            }
                            this.$toast("取消失败");
                        }).catch(err => {
                            this.$toast(err.message);
                        })
                    })
                    .catch(() => {
                    });
            },
            onOversize(file) {
                this.$toast('文件大小不能超过 500kb');
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