import App from './App.vue';
import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);
window.vueInstance = new Vue(App).$mount('#app');