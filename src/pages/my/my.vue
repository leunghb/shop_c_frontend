<template>
    <div class="my fullscreen">
        <div class="header">
            <img
                @click="updateAvatar"
                class="avatar"
                :src="avatar != null ? avatar : defaultAvatar"
                alt=""
                srcset=""
            />
            <input
                ref="avatarInput"
                v-show="false"
                type="file"
                @change="selAvatar($event)"
            />
            <div class="name" v-text="name != null ? name : account"></div>
            <van-icon class="arrow" name="arrow" />
        </div>
    </div>
</template>

<script>
import { api, get, post } from "../../utils/httpApi";

export default {
    data() {
        return {
            name: "",
            account: "",
            avatar: "",
            defaultAvatar: require("../../assets/default-avatar.png"),
        };
    },
    created() {
        this.getUserInfo();
    },
    methods: {
        getUserInfo() {
            get(api.getUserInfo)
                .then((res) => {
                    let data = res.data.data;
                    this.name = data.name;
                    this.account = data.account;
                    this.avatar = api.baseUrl + data.avatar;
                })
                .catch((err) => {
                    this.$toast(err.messgae);
                });
        },
        selAvatar(e) {
            let files = e.target.files[0];
            var params = new FormData();
            params.append("file", files);
            params.append("type", 0);
            let config = {
                headers: { "Content-Type": "multipart/form-data" },
            };
            post(api.uploadSinglePicture, params, config)
                .then((res) => {
                    let data = res.data;
                    if (data.code == 0) {
                        this.putUserAvatarOrName(data.data, this.name);
                        return false;
                    }
                    this.$toast("头像上传失败");
                })
                .catch((err) => {
                    this.$toast(err.messgae);
                });
        },
        updateAvatar() {
            this.$refs.avatarInput.click();
        },
        putUserAvatarOrName(avatar, name) {
            let params = this.$qs.stringify({
                avatar: avatar,
                name: name,
            });
            post(api.putUserAvatarOrName, params)
                .then((res) => {
                    let data = res.data;
                    if (data.code == 0) {
                        this.$toast("头像更新成功");
                        this.avatar = api.baseUrl + avatar;
                        return false;
                    }
                    this.$toast("头像更新失败");
                })
                .catch((err) => {
                    this.$toast(err.messgae);
                });
        },
    },
};
</script>

<style lang="scss" scoped>
@import "../../static/css/common.scss";
@import "./my.scss";
</style>