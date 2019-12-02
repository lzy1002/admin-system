import Vue from 'vue';
import element from "./plugins/element.js";
import App from './App.vue';
import router from './router';

import "./common/stylus/index.styl";

import treeTable from "vue-table-with-tree-grid";
Vue.component("tree-table", treeTable);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
