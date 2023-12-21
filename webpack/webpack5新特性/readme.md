## webpack5 新特性

### 最小 node.js 版本：10.13.0

之前 webpack 的版本对 node.js 依赖为 6.x

### 功能清除：清理弃用的能力

在 webpack4 中被废弃的一些能力都被清除，要确保在 webpack4 环境中运行没有 warring 报错

require.includes 语法已废弃

require.includes 是 webpack 自己实现的一个功能，用来加载一个模块，但是并不马上执行，用来实现模块预加载

- 可以通过 Rule.parse.requireInclude 将行为改为允许、废弃或禁用

### 不再为 Node.js 模块引入 polyfill

之前的版本是：如果某个模块依赖 Node.js 里面的核心模块，那么这个模块被引入的时候会把 Node.js 整个 polyfill 顺带引入

build 后的 bundle.js 体积会减小许多

webpack5 会在 build 时判断环境，如果是浏览器环境，会借助`node-libs-browser`将一些 node 的 api 打包进去

### 长期缓存：确定的模块 id、chunk 和导出名称

chunkIds: "deterministic"
moduleIds: "deterministic"

webpack4中打包时的chunkId是递增的，如果文件发生变化，那打包后的文件名就会变化，缓存会失效

设置`chunkIds: "deterministice"`打包后的id会是不变的短数字id，3位数字

### 持久化缓存

webpack4缓存策略：

可以使用`cache-loader`将编译结果写入硬盘缓存，还可以使用`babel-loader`，设置`option.cacheDirectory`将`babel-loader`编译的结果写进磁盘

webpack5缓存策略：

- 默认开启缓存，缓存默认是在内存里，可以对cache进行设置
- 缓存淘汰策略：文件缓存存储在/node_modules/.cache/webpack，最大500MB，缓存时长两个星期，旧的缓存会被先淘汰

```
module.exports = {
    cache: {
        // 1.将缓存类型设置为文件系统
        type: 'filesystem',
        buildDependencies: {
            // 2. 将你的config添加为buildDependecy，以便在改变config时获得缓存失效
            config: [__filename],
            // 3. 如果你有其它的东西被构建依赖，你可以在这里添加它们
            // 注意：webpack、加载器和所有从你配置中引用的模块都会被自动添加
        }
    }
}

```

### 构建优化：嵌套的 tree-shaking 优化

```
// inner.js
export const a = 1;
export const b = 2;

// module.js
export import * as inner from './inner.js'

// index.js
export import * as module from './module.js'
console.log(module.inner.a)
```

### 代码生成：支持生成 ES6 代码

- webpack4只能生成es5的代码

- webpack5通过[output.environment](https://webpack.js.org/configuration/output/#outputenvironment)设置生成的代码中可以使用哪些es功能

### 开创性的特性：模块联邦

- remote：被依赖方，生产者
- host：依赖方，消费者

一个应用可能是host，也可以是remote，也可以同时是host和remote

[ModuleFederationPlugin](https://webpack.js.org/plugins/module-federation-plugin/)插件将多个应用结合起来


```
const {ModuleFederationPlugin} = require('webpack').container

```