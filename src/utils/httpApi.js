import axios from 'axios';
import { getCookie } from "../utils/common"

axios.defaults.withCredentials = true; //让ajax携带cookie
axios.defaults.timeout = 30000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
// 请求拦截
axios.interceptors.request.use(config => {
    config.headers.token = getCookie("SHOPSESSIONID");
    // 在发送请求之前做些什么 验证token之类的
    return config;
}, error => {
    return Promise.error(error);
});
// 响应拦截
axios.interceptors.response.use(response => {
    return response;
}, error => {
    return Promise.reject(error);
});

const ENV = process.env.NODE_ENV;
let url;

if (ENV == "development") {
    url = "http://127.0.0.1:8001/api";
}
if (ENV == "production") {
    url = process.env.PROD_API_URL;
}
let user = "/user/", goods = "/goods/", cart = "/cart/", order = "/order/", upload = "/upload/";
export const api = {
    baseUrl: url,
    // 用户
    getAllUser: url + user + "getAllUser", //所有用户
    getUserByAccount: url + user + "getUserByAccount", //通过账号获取用户
    getUserInfo: url + user + "getUserInfo", //获取用户信息
    sendVerifyCode: url + user + "sendVerifyCode", //发送验证码
    register: url + user + "register", //注册
    login: url + user + "login", //登录
    forgetPwd: url + user + "updatePwd",//修改密码
    getUserBalanceRecord: url + user + "getUserBalanceRecord", //用户余额使用记录
    getUserBalance: url + user + "getUserBalance", //获取用户余额
    getAddressList: url + user + "getAddressList", //获取用户地址列表
    getAddress: url + user + "getAddress", //获取单个地址
    addOrPutAddress: url + user + "addOrPutAddress", //添加或更新用户地址
    delAddress: url + user + "delAddress", //删除地址
    putUserAvatarOrName: url + user + "putUserAvatarOrName", //更新用户头像

    // 商品
    getGoodsType: url + goods + "getGoodsType", //商品分类
    getGoodsList: url + goods + "getGoodsList", //商品列表
    getHotGoods: url + goods + "getHotGoods", //销量前几商品
    getGoodsDetail: url + goods + "getGoodsDetail", //商品详情
    addOrDelCollectGoods: url + goods + "addOrDelCollectGoods", //添加收藏或删除商品
    hasCollectGoods: url + goods + "hasCollectGoods", //商品是否收藏

    // 购物车
    addGoodsToCart: url + cart + "addGoodsToCart", //添加商品到购物车
    getCartList: url + cart + "getCartList", //购物车列表
    delCartOneGoods: url + cart + "delCartOneGoods", //购物车删除视频商品

    // 订单
    addOrder: url + order + "addOrder", //生成订单
    getOrderList: url + order + "getOrderList", //订单列表
    getOrderDetail: url + order + "getOrderDetail", //订单详情
    pay: url + order + "pay", //支付
    cancelOrder: url + order + "putOrderStatus/cancelOrder", //取消订单
    closeOrder: url + order + "putOrderStatus/closeOrder", //关闭订单

    // 上传
    uploadSinglePicture: url + upload + "uploadSinglePicture", //上传单张图片
}

export function get(url, params) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: params,
        }).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        });
    });
}

export function post(url, params) {
    return new Promise((resolve, reject) => {
        axios.post(url, params).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        });
    });
}

export function put(url, params) {
    return new Promise((resolve, reject) => {
        axios.put(url, params).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        });
    });
}

export function del(url, params) {
    return new Promise((resolve, reject) => {
        axios.delete(url, params).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        });
    });
}