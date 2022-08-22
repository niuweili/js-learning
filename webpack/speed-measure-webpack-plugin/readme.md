### [speed-measure-webpack-plugin](https://www.npmjs.com/package/speed-measure-webpack-plugin)

webpack速度分析插件

* 分析打包总耗时

* 每个loader和插件执行耗时

```
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");

const smp = new SpeedMeasurePlugin();

const webpackConfig = smp.wrap(options);
```



### [webpack-bundle-analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer)

* 使用交互式可缩放树形图可视化 webpack 输出文件的大小

```
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin()
  ]
}
```