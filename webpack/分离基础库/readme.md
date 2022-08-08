### webpack基础库存分离

- 思路：将react、react-dom 或 vue 基础包通过cdn引入，不打入bundle中

1. 使用 [html-webpack-externals-plugin](https://www.npmjs.com/package/html-webpack-externals-plugin)，引入vue的cdn资源

```
new HtmlWebpackExternalsPlugin({
  externals: [
    {
      module: 'vue',
      entry: 'https://unpkg.com/vue@3.2.36/dist/vue.global.js',
      global: 'Vue'
    },
  ],
})
```

2. 使用webpack4内置的，[splitChunksPlugin](https://webpack.docschina.org/plugins/split-chunks-plugin)将vue单独打包到vendors.js中 
>从 webpack v4 开始，移除了 CommonsChunkPlugin，取而代之的是 optimization.splitChunks

```
 optimization: {
    splitChunks: {
        minSize: 0, // 被引用的文件大小
        cacheGroups: {
            // vue资源抽离
            vendors: {
                test: /vue/,
                name: 'vendors',
                chunks: 'all',
            },
        },
    },
},
```

chunks参数说明

* async 异步引入的库
* initial 同步引入的库
* all 所有的库