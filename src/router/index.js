import Vue from 'vue'
import Router from 'vue-router'

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
};

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '*',
            redirect: '/',
            meta: {}
        }, {
            path: '/Login',
            name: 'Login',
            component: () => import('@/pages/login/login')
        }, {
            path: '/RegisterOrForgetPwd',
            name: 'RegisterOrForgetPwd',
            component: () => import('@/pages/registerOrForgetPwd/registerOrForgetPwd')
        }, {
            path: '/',
            name: 'Main',
            component: () => import('@/pages/main/main'),
            children: [
                {
                    path: '/',
                    name: 'Home',
                    component: () => import('@/pages/home/home')
                }, {
                    path: '/Cart',
                    name: 'Cart',
                    component: () => import('@/pages/cart/cart')
                }, {
                    path: '/My',
                    name: 'My',
                    component: () => import('@/pages/my/my')
                }
            ]
        }, {
            path: '/Error',
            name: 'Error',
            component: () => import('@/pages/error/error')
        }
    ]
})
