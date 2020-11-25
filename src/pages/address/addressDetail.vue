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

export default {
    data() {
        return {
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
            if (this.address.length == 0) {
                this.$toast("请输入详细地址");
                return false;
            }
        },
        del() {
            this.$dialog
                .confirm({
                    title: "确认删除？",
                })
                .then(() => {})
                .catch(() => {});
        },
    },
};
</script>

<style lang="scss" scoped>
@import "../../static/css/common.scss";
@import "./addressDetail.scss";
</style>