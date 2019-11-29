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
    ]
  ]
};
