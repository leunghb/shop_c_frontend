<template>
    <div class="register fullscreen">
        <Back></Back>

        <img
            class="registerIcon"
            :style="type == 1 ? 'width:35vw;' : ''"
            :src="type == 0 ? registerIcon : forgetPwdIcon"
            alt
        />

        <input
            class="account"
            type="text"
            placeholder="邮箱"
            v-model="account"
            onkeyup="this.value=this.value.replace(/^\s+|\s+$/g,'')"
        />
        <input
            class="code"
            type="text"
            placeholder="验证码"
            v-model="code"
            onkeyup="this.value=this.value.replace(/^\s+|\s+$/g,'')"
            maxlength="6"
        />
        <div class="getCode" @click="getCode()" v-text="getCodeStatus"></div>
        <input
            class="password"
            type="text"
            placeholder="密码"
            v-model="password"
        />
        <input
            class="password"
            type="text"
            placeholder="重复密码"
            v-model="repeatPassword"
        />

        <div
            class="submit"
            @click="register()"
            v-text="type == 0 ? '注册' : '修改'"
        ></div>
    </div>
</template>

<script>
import { isEmail } from "../../utils/common";
import Back from "../../components/backToPrevious/backToPrevious";
import { post, api } from "../../utils/httpApi";

export default {
    data() {
        return {
            account: "",
            code: "",
            effectiveTime: 10, //默认6分钟
            password: "",
            repeatPassword: "",
            getCodeStatus: "发送验证码",
            canGetCode: true,
            type: null,
            forgetPwdIcon: require("../../assets/forget-pwd-icon.png"),
            registerIcon: require("../../assets/register-icon.png"),
        };
    },
    components: { Back },
    created() {
        this.type = this.$route.query.type; //0-注册 1-忘记密码
    },
    methods: {
        getCode() {
            const ACCOUNT = this.account;
            if (ACCOUNT.length == 0) {
                this.$toast("请输入邮箱");
                return false;
            }
            if (!isEmail(ACCOUNT)) {
                this.$toast("邮箱格式错误");
                return false;
            }
            if (!this.canGetCode) return false;

            new Promise((resolve) => {
                const params = this.$qs.stringify({
                    account: ACCOUNT,
                });
                post(api.getUserByAccount, params)
                    .then((res) => {
                        let data = res.data;
                        if (this.type == 0) {
                            if (data.code == 0) {
                                this.$toast("当前邮箱已注册");
                                return false;
                            }
                            resolve();
                        } else {
                            if (data.code == 0) {
                                resolve();
                            }
                        }
                    })
                    .catch((err) => {});
            }).then(() => {
                const params = this.$qs.stringify({
                    account: ACCOUNT,
                    effectiveTime: this.effectiveTime,
                });
                post(api.sendVerifyCode, params)
                    .then((res) => {
                        let data = res.data;
                        this.$toast(data.message);
                        if (data.code == 0) {
                            this.canGetCode = false;
                            let time = 60;
                            this.getCodeStatus = time + "s";
                            let timer = setInterval(() => {
                                if (time > 1) {
                                    --time;
                                    this.getCodeStatus = time + "s";
                                } else {
                                    this.getCodeStatus = "发送验证码";
                                    this.canGetCode = true;
                                    clearInterval(timer);
                                }
                            }, 1000);
                        }
                    })
                    .catch((err) => {
                        this.$toast(err.message);
                    });
            });
        },
        register() {
            const ACCOUNT = this.account,
                CODE = this.code,
                PASSWORD = this.password,
                REPEATPASSWORD = this.repeatPassword;
            if (ACCOUNT.length == 0) {
                this.$toast("请输入邮箱");
                return false;
            }
            if (!isEmail(ACCOUNT)) {
                this.$toast("邮箱格式错误");
                return false;
            }
            if (CODE.length == 0) {
                this.$toast("请输入验证码");
                return false;
            }
            if (PASSWORD.length == 0) {
                this.$toast("请输入密码");
                return false;
            }
            if (PASSWORD != REPEATPASSWORD) {
                this.$toast("两次密码不一致");
                return false;
            }
            let params = this.$qs.stringify({
                account: ACCOUNT,
                password: PASSWORD,
                code: CODE,
            });
            post(this.type == 0 ? api.register : api.forgetPwd, params)
                .then((res) => {
                    let data = res.data;
                    this.$toast(data.message);
                    if (data.code == 0) {
                        this.$router.go(-1);
                    }
                })
                .catch((err) => {
                    this.$toast(err.message);
                });
        },
    },
};
</script>

<style lang="scss" scoped>
@import "../../static/css/common.scss";
@import "./registerOrForgetPwd.scss";
</style>