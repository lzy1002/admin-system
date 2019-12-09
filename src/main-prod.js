import Vue from 'vue';
// import element from "./plugins/element.js";
import App from './App.vue';
import router from './router';

import "./common/stylus/index.styl";

// 引入并注册树形表格
import treeTable from "vue-table-with-tree-grid";
Vue.component("tree-table", treeTable);

// 引入并注册富文本编辑器
import VueQuillEditor from 'vue-quill-editor';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
Vue.use(VueQuillEditor, /* { default global options } */);


Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
