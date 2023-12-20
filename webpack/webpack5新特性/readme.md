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

...

### 持久化缓存

...

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