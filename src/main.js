// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'lib-flexible/flexible'
import './utils/httpApi'
import qs from 'qs'
import { Toast, Icon, Swipe, SwipeItem, List, Cell, PullRefresh, Sticky, Lazyload, Sidebar, SidebarItem, Overlay, Search, Sku, Popup, Stepper, AddressList, Field, Switch, Dialog, SubmitBar, Checkbox, SwipeCell, Card, Button, CheckboxGroup, Loading, Tab, Tabs, CountDown, ActionSheet } from 'vant'
import globalVariable from './utils/globalVariable'

Vue.use(Toast).use(Icon).use(Swipe).use(SwipeItem).use(List).use(Cell).use(PullRefresh).use(Sticky).use(Lazyload).use(Sidebar).use(SidebarItem).use(Overlay).use(Search).use(Sku).use(Popup).use(Stepper).use(AddressList).use(Field).use(Switch).use(Dialog).use(SubmitBar).use(Checkbox).use(SwipeCell).use(Card).use(Button).use(CheckboxGroup).use(Loading).use(Tab).use(Tabs).use(CountDown).use(ActionSheet);
Vue.prototype.$qs = qs
Vue.prototype.$globalVariable = globalVariable;

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
    let href = window.location.href;
    if (href.indexOf("GoodsDetail") == -1 &&
        href.indexOf("ConfirmOrder") == -1 &&
        href.indexOf("AddressList") == -1 &&
        href.indexOf("OrderDetail") == -1)
        localStorage.removeItem("temporaryAddress");
    next();
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: {
        App
    },
    template: '<App/>'
})
