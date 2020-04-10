import Vue from 'vue';
import App from './App.vue';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import GAuth from 'vue-google-oauth2'
const gauthOption = {
    clientId: '"666049061231-8ok5p9b67anl89i2ug961e2hsd1k3id0.apps.googleusercontent.com"'
}


Vue.use(GAuth, gauthOption)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
new Vue({
    el: "#app",
    render: (h) => h(App)
})