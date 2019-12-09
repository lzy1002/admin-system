module.exports = {
  chainWebpack(config){  // 通过该配置函数 分别配置开发或打包时的入口文件
    config.when(process.env.NODE_ENV === "development", config => {
      config.entry("app").clear().add("./src/main-dev.js");

      config.plugin("html").tap((args) => {
        args[0].isProd = false;
        return args;
      })
    });

    config.when(process.env.NODE_ENV === "production", config => {
      config.entry("app").clear().add("./src/main-prod.js");

      config.set("externals", {
        vue: "Vue",
        "vue-router": "VueRouter",
        axios: "axios",
        lodash: "_",
        echarts: "echarts",
        nprogress: "NProgress",
        "vue-quill-editor": "VueQuillEditor"
      });

      config.plugin("html").tap((args) => {
        args[0].isProd = true;
        return args;
      })
    })
  }
};
