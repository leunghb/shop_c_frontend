<template>
    <div class="addressDetail">
        <Back></Back>

        <van-field v-model.trim="name" label="姓名" placeholder="请输入姓名" />
        <van-field
            v-model.trim="tel"
            type="tel"
            label="手机号"
            placeholder="请输入手机号"
        />
        <van-field
            v-model.trim="address"
            type="text"
            label="详细地址"
            placeholder="请输入详细地址"
        />
        <van-cell center title="默认">
            <template #right-icon>
                <van-switch v-model="isDefault" size="24" />
            </template>
        </van-cell>
        <div class="save" @click="save()">保存</div>
        <div class="del" @click="del()" v-if="type == 1">删除</div>
    </div>
</template>

<script>
import Back from "../../components/backToPrevious/backToPrevious";
import { checkPhone } from "../../utils/common";
import { api, post } from "../../utils/httpApi";

export default {
    data() {
        return {
            id: null,
            name: "",
            tel: "",
            address: "",
            isDefault: false,
            isDefaultBackUp: false,
            type: null,
        };
    },
    components: { Back },
    created() {
        let query = this.$route.query;
        let type = query.type;
        if (type == 1) {
            //编辑
            let info = JSON.parse(query.info);
            this.id = info.item.id;
            this.name = info.item.name;
            this.tel = info.item.tel;
            this.address = info.item.address;
            this.isDefault = info.item.isDefault;
            this.isDefaultBackUp = info.item.isDefaultBackUp;
        }
        this.type = type;
    },
    methods: {
        save() {
            if (this.name.length == 0) {
                this.$toast("请输入姓名");
                return false;
            }
            if (this.tel.length == 0) {
                this.$toast("请输入手机号");
                return false;
            }
            if (checkPhone(this.tel)) {
                this.$toast("请输入正确的手机号");
                return false;
            }
            if (this.address.length == 0) {
                this.$toast("请输入详细地址");
                return false;
            }
            let params = this.$qs.stringify({
                name: this.name,
                tel: this.tel,
                address: this.address,
                isDefault: this.isDefault ? 1 : 0,
                type: this.type,
                id: this.id,
            });
            post(api.addOrPutAddress, params)
                .then((res) => {
                    let data = res.data;
                    if (data.code == 0) {
                        this.$toast(this.type == 0 ? "添加成功" : "修改成功");
                        let time = setTimeout(() => {
                            this.$router.go(-1);
                            clearTimeout(time);
                        }, 1500);
                        return false;
                    }
                    this.$toast(data.message);
                })
                .catch((err) => {
                    this.$toast(err.message);
                });
        },
        del() {
            this.$dialog
                .confirm({
                    title: "确认删除？",
                })
                .then(() => {
                    let params = this.$qs.stringify({
                        id: this.id,
                    });
                    post(api.delAddress, params)
                        .then((res) => {
                            let data = res.data;
                            if (data.code == 0) {
                                this.$toast("删除成功");
                                let time = setTimeout(() => {
                                    this.$router.go(-1);
                                    clearTimeout(time);
                                }, 1500);
                                return false;
                            }
                            this.$toast(data.message);
                        })
                        .catch((err) => {
                            this.$toast(err.message);
                        });
                })
                .catch(() => {});
        },
    },
};
</script>

<style lang="scss" scoped>
@import "../../static/css/common.scss";
@import "./addressDetail.scss";
</style>