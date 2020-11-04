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
            path: '/',
            name: 'Start',
            component: () => import('@/pages/start/start')
        }, {
            path: '/Login',
            name: 'Login',
            component: () => import('@/pages/login/login')
        }, {
            path: '/Home',
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
        }, {
            path: '/Register',
            name: 'Register',
            component: () => import('@/pages/register/register')
        }
    ]
})
