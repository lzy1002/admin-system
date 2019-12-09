const prodPlugins = [];
if(process.env.NODE_ENV === "production"){  // 通过process.env.NODE_ENV可以拿到当前编译模式  development：项目开发阶段 production：项目打包阶段
  prodPlugins.push("transform-remove-console");  // 只有当项目是打包阶段才会使用的插件  也就是说 开发时不需要去掉打印 而打包生成时会去掉打印
}

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [  //此为element-ui按需导入的配置
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ],
    ...prodPlugins,
    "@babel/plugin-syntax-dynamic-import"
  ]
};
