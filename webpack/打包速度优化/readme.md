## 1.多进程多实例打包

- [happyPack](https://www.npmjs.com/package/happypack)

每次webpack解析一个模块，happyPack会将它的依赖分配给wordker线程中

webpack3.0中使用较多，由于后续不再进行维护，webpack4官方原生提供了thread-loader来替代happyPack


- [thread-loader](https://webpack.docschina.org/loaders/thread-loader/#root)

与happyPack原理相同，每次webpack解析一个模块，thread-loader会将它的依赖分配给wordker线程中



## 2.多进程多实例并行压缩

1. [parallel-uglify-plugin](https://www.npmjs.com/package/webpack-parallel-uglify-plugin)

2. [uglifyjs-webpack-plugin](https://www.npmjs.com/package/uglifyjs-webpack-plugin) 开启parallel参数

3. [terser-webpack-plugin](https://www.npmjs.com/package/terser-webpack-plugin) 支持压缩es6的语法


## 3.分包

- 使用[html-webpack-externals-plugin](https://www.npmjs.com/package/html-webpack-externals-plugin)进行分包需要指定基础包的cdn资源，而且会打包出很多的script标签

- 使用[splitChunksPlugin](https://webpack.docschina.org/plugins/split-chunks-plugin)的话，webpack也还是会对分离出来的模块进行解析

所以需要进一步分包：预编译资源模块（使用空间换时间）

#### 3.1 DLL


其实就是先将node_modules中不经常变更的模块提前打包出来，存放在硬盘空间中，后面再进行打包时，直接从缓存中读取直接用dll打包出来的代码，这样打包时间自然就缩短

比如：将vue、vue-router、vuex基础包和业务基础包打包成一个文件

1.使用[DDLplugin](https://webpack.docschina.org/plugins/dll-plugin/)进行分包

2.使用[DllReferencePlugin](https://webpack.docschina.org/plugins/dll-plugin/#dllreferenceplugin)引用manifest.json中分离出来的包


> 但是[Vue](https://github.com/vuejs/vue-cli/issues/1205)和[React](https://github.com/facebook/create-react-app/pull/2710)官方在webpack4中都不再使用dll了，因为webpack4有着比dll更好的打包性能，加入dll对整体打包时间的优化也可以说忽略不计


#### 3.2 比DLL更优秀的plugin

在[AutoDllPlugin](https://www.npmjs.com/package/autodll-webpack-plugin)中推荐了webpack5内部使用的[hard-source-webpack-plugin](https://github.com/mzgoddard/hard-source-webpack-plugin)

```
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

module.exports = {
  // ......
  plugins: [
    new HardSourceWebpackPlugin() // <- 直接加入这行代码就行
  ]
}
```
<!-- TODO:  -->
#### 3.3 webpack5.0 持久化缓存
