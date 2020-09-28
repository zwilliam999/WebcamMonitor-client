import './assets/css/main.css'
import './assets/css/toast.css'

import Vue from 'vue';
import App from './App.vue'
import router from './router'
import store from './store'

import jQuery from "jquery"
import  sb from "./assets/js/sb-ui"

window.sb = sb;
window.$ = jQuery;
window.jQuery = jQuery;
import breakpoints from './assets/js/breakpoints';
import browser from './assets/js/browser'

window.breakpoints = breakpoints;
window.browser = browser;
import util from './assets/js/util'

Vue.config.productionTip = false;
import {Api} from './api/api'
new Vue({
    router,
    data: {
        api: null,
    },
    store,
    created() {
        util($);
        this.api = Api.getInstance(sb);
    },
    render: h => h(App)
}).$mount('#app');
