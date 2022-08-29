## 1. 多进程多实例打包

- [happyPack](https://www.npmjs.com/package/happypack)

每次webpack解析一个模块，happyPack会将它的依赖分配给wordker线程中

webpack3.0中使用较多，由于后续不再进行维护，webpack4官方原生提供了thread-loader来替代happyPack


- [thread-loader](https://webpack.docschina.org/loaders/thread-loader/#root)

与happyPack原理相同，每次webpack解析一个模块，thread-loader会将它的依赖分配给wordker线程中



## 2. 多进程多实例并行压缩

1. [parallel-uglify-plugin](https://www.npmjs.com/package/webpack-parallel-uglify-plugin)

2. [uglifyjs-webpack-plugin](https://www.npmjs.com/package/uglifyjs-webpack-plugin) 开启parallel参数

3. [terser-webpack-plugin](https://www.npmjs.com/package/terser-webpack-plugin) 支持压缩es6的语法


## 3. 分包

- 使用[html-webpack-externals-plugin](https://www.npmjs.com/package/html-webpack-externals-plugin)进行分包需要指定基础包的cdn资源，而且会打包出很多的script标签

- 使用[splitChunksPlugin](https://webpack.docschina.org/plugins/split-chunks-plugin)的话，webpack也还是会对分离出来的模块进行解析

所以需要进一步分包：预编译资源模块（使用空间换时间）

### 3.1 DLL

其实就是先将node_modules中不经常变更的模块提前打包出来，存放在硬盘空间中，后面再进行打包时，直接从缓存中读取直接用dll打包出来的代码，这样打包时间自然就缩短

比如：将vue、vue-router、vuex基础包和业务基础包打包成一个文件

1. 使用[DDLplugin](https://webpack.docschina.org/plugins/dll-plugin/)进行分包
```
const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        library: [
            'vue'
        ]
    },
    mode: "production",
    output: {
        filename: '[name]_[chunkhash].dll.js',
        path: path.join(__dirname, 'dll'),
        library: '[name]_[fullhash]',
    },
    plugins: [
        new webpack.DllPlugin({
            name: '[name]_[fullhash]',
            path: path.join(__dirname, 'dll/[name].json'),
        })
    ]
}
```

2. 使用[DllReferencePlugin](https://webpack.docschina.org/plugins/dll-plugin/#dllreferenceplugin)引用manifest.json中分离出来的包
```
plugins:[
  new webpack.DllReferencePlugin({
        manifest: require('./dll/library.json'),
    })
]
```

3. 通过[AddAssetHtmlPlugin](https://www.npmjs.com/package/add-asset-html-webpack-plugin)在html中添加需要链接的dll文件

```
plugins:[
   new AddAssetHtmlPlugin({
        glob: path.resolve(__dirname, './dll/*.dll.js'),
    })
]
```

### 3.2 AutoDllPlugin更简洁的配置

在[AutoDllPlugin](https://www.npmjs.com/package/autodll-webpack-plugin)中推荐了webpack5内部使用的
```
const path = require('path');
const AutoDllPlugin = require('autodll-webpack-plugin');

module.exports = {
  // ......
  plugins: [
        new AutoDllPlugin({
            inject: true, // 设为 true 就把 DLL bundles 插到 index.html 里
            filename: '[name].dll.js',
            context: path.resolve(__dirname, '../'), // AutoDllPlugin 的 context 必须和 package.json 的同级目录，要不然会链接失败
            entry: {
                react: [
                    'react',
                    'react-dom'
                ]
            }
        })
  ]
}
```

> 但是[Vue](https://github.com/vuejs/vue-cli/issues/1205)和[React](https://github.com/facebook/create-react-app/pull/2710)官方在webpack4中都不再使用dll了，因为 Webpack 4 的打包性能足够好的，dll 没有在 Vue ClI 里继续维护的必要了。加入dll对整体打包时间的优化也可以说忽略不计


## 4. 缓存

充分利用缓存可以提升二次构建速度

- 通过babel-loader，在代码转换时开启缓存，在下一次代码转换时直接读取缓存内容
- terser-webpack-plugin，在代码压缩阶段开始缓存
- 使用cache-loader或者[hard-source-webpack-plugin](https://github.com/mzgoddard/hard-source-webpack-plugin)，在模块转换阶段开启缓存


```
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

module.exports = {
  // ......
  plugins: [
    new HardSourceWebpackPlugin()
  ]
}
```

但HardSourceWebpackPlugin在webpack5中不兼容，webpack5中开启[cache](https://webpack.docschina.org/configuration/cache/#root)可以大幅度提升第二次编译的速度

### 4.1 webpack5.0 持久化缓存
<!-- TODO:补充  -->


## 5. 缩小构建目标

webpack使用loader去解析的时候并不是所有的文件都需要进行处理的，import的第三方包一般是没有必要去转换的
### 5.1 减少构建模块

```
module: {
    rules: [
        {
            test: /\.js$/,
            use: [
                'babel-loader',
            ],
            exclude: ['node_modules'] // node_modules
        },
    ]
```

### 5.2 减少文件搜索范围

- webpack与node的模块查找类似，默认会先从当前路径查找，如果没找到会依次到父目录中查找，通过[resolve.modules](https://webpack.docschina.org/configuration/resolve/#resolvemodules)可以直接指定node_modules的路径，减少模块搜索层级


- [resolve.mainFields](https://webpack.docschina.org/configuration/resolve/#resolvemainfields)引入第三包时根据package.json的[此规范](https://github.com/defunctzombie/package-browser-field-spec)下的配置查找指定的入口文件
> 如果没有找到对应的文件会查找根目录下的index.js，如果根目录下没有index.js，会继续查找lib/index.js

- 合理设置引入时解析的文件后缀[resolve.extensions](https://webpack.docschina.org/configuration/resolve/#resolveextensions)

> webpack默认解析.js和.json文件，如果extensions设置得文件越多，那么解析时耗时越慢，可以只设置必要的几个文件，减少webpack查找文件时的耗时

- 使用[resolve.alias](https://webpack.docschina.org/configuration/resolve/#resolvealias)设置import时的别名

<!-- TODO: vue设置了alias后反而速度更慢 -->
```
module.exports = {
  //...
  resolve: {
    alias: {
      'vue': path.resolve(__dirname, './node_modules/vue/index.js'),
    },
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    mainFields: ['browser', 'module', 'main'],
    extensions: ['.js'],
  },
};
```

## 6. 图片压缩

使用image-webpack-loader对图片体积进行压缩

```
 module: {
    rules: [
        {
            test: /\.(png|jpg|gif|jpeg)$/,
            // asset 资源类型可以根据指定的图片大小来判断是否需要将图片转化为 base64
            type: 'asset',
            parser: {
                dataUrlCondition: {
                    maxSize: 10 * 1024 // 限制于 10kb
                },
            },
            generator: {
                filename: function (chunkData) {
                    const dirName = chunkData.runtime
                    return `${dirName}/img/[name]_[hash:8][ext]`
                }
            },
            // 图片压缩的配置
            use: [
                {

                    loader: 'image-webpack-loader',
                    options: {
                        mozjpeg: {
                            progressive: true
                        },
                        // optipng.enabled: false will disable optipng
                        optipng: {
                            enabled: false
                        },
                        pngquant: {
                            quality: [0.65, 0.9],
                            speed: 4
                        },
                        gifsicle: {
                            interlaced: false
                        },
                        // the webp option will enable WEBP
                        webp: {
                            quality: 75
                        }
                    }
                }
            ]
        },
    ]
}
```


## 7. 使用动态polyfill

- babel-polyfill

优点：React官方推荐

缺点：包体积200k+，难以单独抽离Map、Set

- babel-plugin-transform-runtime

优点：能只polyfill用到的类或方法，相对体积较小

缺点：不能polyfill原型上的方法，不适用于业务项目的复杂开发环境且所有用户都需要加载

- 自己维护Map、Set的polyfill（[es6-shim](https://github.com/paulmillr/es6-shim/)）

优点：定制化高，体积小

缺点：重复造轮子，维护成本高且所有用户都需要加载

- polyfill service

优点：只给用户返回需要的polyfill，社区维护

缺点：有些浏览器会魔改UA，会导致判断时会有问题（对于这种情况可以判断执行失败时，动态把所有的polyfill加载回来，做为兜底）

根据UA支持动态的返回当前浏览器不支持的es6语法

```
<script src="https://polyfill.io/v3/polyfill.min.js?version=3.111.0"></script>
```
