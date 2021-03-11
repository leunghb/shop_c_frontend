import Vue from 'vue'
import Router from 'vue-router'

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
};

Vue.use(Router)

export default new Router({
    // mode: 'history',
    routes: [
        {
            path: '*',
            redirect: '/',
            meta: {}
        }, {
            path: '/Login',
            name: 'Login',
            component: () => import('@/pages/login/login'),
            meta: {
                keepAlive: false,
            }
        }, {
            path: '/RegisterOrForgetPwd',
            name: 'RegisterOrForgetPwd',
            component: () => import('@/pages/registerOrForgetPwd/registerOrForgetPwd'),
            meta: {
                keepAlive: false,
            }
        }, {
            path: '/',
            name: 'Main',
            component: () => import('@/pages/main/main'),
            children: [
                {
                    path: '/',
                    name: 'Home',
                    component: () => import('@/pages/home/home'),
                    meta: {
                        keepAlive: true,
                    }
                }, {
                    path: '/Cart',
                    name: 'Cart',
                    component: () => import('@/pages/cart/cart'),
                    meta: {
                        keepAlive: false,
                    }
                }, {
                    path: '/My',
                    name: 'My',
                    component: () => import('@/pages/my/my'),
                    meta: {
                        keepAlive: true,
                    }
                }
            ]
        }, {
            path: '/Error',
            name: 'Error',
            component: () => import('@/pages/error/error'),
            meta: {
                keepAlive: false,
            }
        }, {
            path: '/Search',
            name: 'Search',
            component: () => import('@/pages/search/search'),
            meta: {
                keepAlive: false,
            }
        }, {
            path: '/GoodsDetail',
            name: 'GoodsDetail',
            component: () => import('@/pages/goodsDetail/goodsDetail'),
            meta: {
                keepAlive: false,
            }
        }, {
            path: '/AddressList',
            name: 'AddressList',
            component: () => import('@/pages/address/addressList'),
            meta: {
                keepAlive: false,
            }
        }, {
            path: '/AddressDetail',
            name: 'AddressDetail',
            component: () => import('@/pages/address/addressDetail'),
            meta: {
                keepAlive: false,
            }
        }, {
            path: '/ConfirmOrder',
            name: 'ConfirmOrder',
            component: () => import('@/pages/confirmOrder/confirmOrder'),
            meta: {
                keepAlive: false,
            }
        }, {
            path: '/Pay',
            name: 'Pay',
            component: () => import('@/pages/pay/pay'),
            meta: {
                keepAlive: false,
            }
        }, {
            path: '/Balance',
            name: 'Balance',
            component: () => import('@/pages/balance/balance'),
            meta: {
                keepAlive: false,
            }
        }, {
            path: '/Order',
            name: 'Order',
            component: () => import('@/pages/order/order'),
            meta: {
                keepAlive: true,
            }
        }, {
            path: '/OrderDetail',
            name: 'OrderDetail',
            component: () => import('@/pages/order/orderDetail'),
            meta: {
                keepAlive: false,
            }
        }, {
            path: '/Refunds',
            name: 'Refunds',
            component: () => import('@/pages/order/refunds'),
            meta: {
                keepAlive: false,
            }
        }, {
            path: '/Evaluate',
            name: 'Evaluate',
            component: () => import('@/pages/evaluate/evaluate'),
            meta: {
                keepAlive: false,
            }
        }, {
            path: '/GoodsEvaluate',
            name: 'GoodsEvaluate',
            component: () => import('@/pages/evaluate/goodsEvaluate'),
            meta: {
                keepAlive: false,
            }
        }, {
            path: '/Collect',
            name: 'Collect',
            component: () => import('@/pages/collect/collect'),
            meta: {
                keepAlive: false,
            }
        }
    ]
})
