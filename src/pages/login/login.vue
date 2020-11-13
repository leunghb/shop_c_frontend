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
        <input
            class="password"
            type="text"
            placeholder="密码"
            v-model="password"
        />

        <div class="submit" @click="login()">登录</div>

        <div class="forgetPwd" @click="forgetPwd()">忘记密码?</div>
        <div class="register" @click="register()">注册</div>
    </div>
</template>

<script>
import { isEmail } from "../../utils/common";
import { api, post } from "../../utils/httpApi";

export default {
    data() {
        return {
            account: "",
            password: "",
        };
    },
    created() {},
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
                    let data = res.data;
                    if (data.code == 0) {
                        this.$toast({ message: "正在登录...", duration: 1400 });
                        let timer = setTimeout(() => {
                            document.cookie = "SHOPSESSIONID=" + data.data;
                            document.cookie = "account=" + ACCOUNT;
                            this.$router.push({
                                path: "/",
                            });
                            clearTimeout(timer);
                        }, 1500);
                        return false;
                    }
                    this.$toast(data.message);
                })
                .catch((err) => {
                    alert(err)
                    this.$toast(err);
                });
        },
        forgetPwd() {
            this.router(1);
        },
        register() {
            this.router(0);
        },
        router(type) {
            this.$router.push({
                path: "/RegisterOrForgetPwd",
                query: {
                    type: type,
                },
            });
        },
    },
};
</script>

<style lang="scss" scoped>
@import "../../static/css/common.scss";
@import "./login.scss";
</style>