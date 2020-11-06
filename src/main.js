// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'lib-flexible/flexible'
import './utils/httpApi'
import qs from 'qs'
import { Toast, Icon, Swipe, SwipeItem, List, Cell, PullRefresh, Sticky } from 'vant'

Vue.use(Toast).use(Icon).use(Swipe).use(SwipeItem).use(List).use(Cell).use(PullRefresh).use(Sticky)
Vue.prototype.$qs = qs

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: {
        App
    },
    template: '<App/>'
})
