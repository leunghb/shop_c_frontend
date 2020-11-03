<template>
    <div class="login fullscreen">
        <img class="loginIcon" src="../../assets/login-icon.png" alt />

        <input
            class="account"
            type="text"
            placeholder="邮箱"
            v-model="account"
            onkeyup="this.value=this.value.replace(/^\s+|\s+$/g,'')"
        />
        <input class="password" type="text" placeholder="密码" v-model="password" />

        <div :class="['submit', canSubmit ? 'canSubmit' : '']" @click="login()">登录</div>

        <div class="forgetPwd" @click="forgetPwd()">忘记密码?</div>
        <div class="register" @click="register()">注册</div>
    </div>
</template>

<script>
import { isEmail } from "../../utils/verify";
import { api, post } from "../../utils/httpApi";

export default {
    data() {
        return {
            account: "",
            password: "",
            canSubmit: false,
        };
    },
    methods: {
        login() {
            const ACCOUNT = this.account,
                PASSWORD = this.password;
            if (ACCOUNT.length == 0) {
                this.$toast("请输入邮箱");
                return false;
            }
            if (!isEmail(ACCOUNT)) {
                this.$toast("邮箱格式错误");
                return false;
            }
            if (PASSWORD.length == 0) {
                this.$toast("请输入密码");
                return false;
            }
            let params = this.$qs.stringify({
                account: ACCOUNT,
                password: PASSWORD,
            });
            post(api.login, params)
                .then((res) => {
                    console.log(res);
                })
                .catch((err) => {
                    console.log(err);
                });
        },
    },
    watch: {
        account(newVal, oldVal) {
            this.canSubmit =
                this.account.length > 0 && this.password.length > 0;
        },
        password(newVal, oldVal) {
            this.canSubmit =
                this.account.length > 0 && this.password.length > 0;
        },
    },
};
</script>

<style lang="scss" scoped>
@import "../../static/css/common.scss";
@import "./login.scss";
</style>