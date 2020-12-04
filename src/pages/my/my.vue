<template>
    <div class="my fullscreen">
        <div class="header">
            <img
                @click="updateAvatar"
                class="avatar"
                :src="avatar != '' ? avatar : defaultAvatar"
                alt=""
                srcset=""
            />
            <input
                ref="avatarInput"
                v-show="false"
                type="file"
                @change="selAvatar($event)"
            />
            <div
                class="name"
                v-text="name != '' ? name : account"
                @click="showChangeNamePopup = true"
            ></div>
            <van-popup class="changeNamePopup" v-model="showChangeNamePopup">
                <input
                    type="text"
                    placeholder="请输入名称"
                    v-model="newName"
                    onkeyup="this.value=this.value.replace(/^\s+|\s+$/g,'')"
                    maxlength="6"
                />
                <div class="changeNameBtn" @click="changeName">确认修改</div>
            </van-popup>
        </div>

        <div class="menu">
            <div class="item" @click="toPage('Balance')">
                <i class="iconfont iconyue"></i>
                <div class="label">余额</div>
                <van-icon name="arrow" />
            </div>
            <div class="item" @click="toPage('Order')">
                <i class="iconfont icondingdanyichenggong"></i>
                <div class="label">订单</div>
                <van-icon name="arrow" />
            </div>
            <div class="item" @click="toPage('Collect')">
                <i class="iconfont iconshoucang"></i>
                <div class="label">收藏</div>
                <van-icon name="arrow" />
            </div>
            <div class="item" @click="toPage('Comment')">
                <i class="iconfont iconpingjiaguanli"></i>
                <div class="label">评论</div>
                <van-icon name="arrow" />
            </div>
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

            showChangeNamePopup: false,
            newName: "",
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
                    this.avatar =
                        data.avatar != "" ? api.baseUrl + data.avatar : "";
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
                        this.$toast("更新成功");
                        this.avatar = api.baseUrl + avatar;
                        this.name = name;
                        this.showChangeNamePopup = false;
                        return false;
                    }
                    this.$toast("更新失败");
                })
                .catch((err) => {
                    this.$toast(err.messgae);
                });
        },
        changeName() {
            let avatar = this.avatar.replace(api.baseUrl, ""),
                name = this.newName;
            this.putUserAvatarOrName(avatar, name);
        },
        toPage(page) {
            this.$router.push({
                path: "/" + page,
            });
        },
    },
};
</script>

<style lang="scss" scoped>
@import "../../static/css/common.scss";
@import "../../static/css/iconfont.css";
@import "./my.scss";
</style>