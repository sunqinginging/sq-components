module.exports = {
  plugins: [
    require("autoprefixer")({
      overrideBrowserslist: ["> 1%", "last 2 versions"], // 兼容主流浏览器
    }),
    require("postcss-each-variables"),
    require("postcss-nested"),
    require("postcss-each")({
      plugins: {
        beforeEach: [require("postcss-for"), require("postcss-color-mix")],
      },
    }),
  ],
};
