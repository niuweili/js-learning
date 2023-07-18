# es6 模块引入

- commomJS
  - 引入：使用 require 引入
  - 导出：module.exports = { }
  - 后缀：.cjs
- ESM
  - 引入：import xxx from xxx
  - 导出：export/default export
  - 后缀：.mjs

## 差异

- CommonJs：输出值的拷贝，运行时加载，同步加载模块（模块运行后内部值的变化不会影响到外部的值）
- ESM：输出值的引用，编译时输出接口，异步加载（内部值的变化会影响外部的值）

## NodeJS

如果需要在 node 中引入 esm 模块，需要将文件后缀改为.mjs，或通过修改 package.json 中 type 为 module

## package.json

#### main

```
{
  "type": "module",
  "main": "./src/index.js"
}
```
上面的代码指定的入口文件为./src/index.js，它的格式为esm模块，如果没有type字段，index.js会被解析为CommonJS模块

#### exports

exports字段的优先级高于main字段。它有多种用法

1. 条件加载

下面代码中，别名.的require条件指定require()命令的入口文件（即 CommonJS 的入口），default条件指定其他情况的入口（即 ES6 的入口）

```
{
  "type": "module",
  "exports": {
    ".": {
      "require": "./main.cjs",
      "default": "./main.js"
    }
  }
}
```

2. 子目录别名

```
// ./node_modules/es-module-package/package.json
{
  "exports": {
    "./submodule": "./src/submodule.js"
    "./features/": "./src/features/"
  }
}
```
```
// 加载 ./node_modules/es-module-package/src/submodule.js
import submodule from 'es-module-package/submodule';

// 加载 ./node_modules/es-module-package/src/features/x.js
import feature from 'es-module-package/features/x.js';
```

3. main 的别名

exports字段只有支持 ES6 的 Node.js 才认识
> 老版本的 Node.js （不支持 ES6 模块）的入口文件是main-legacy.cjs，新版本的 Node.js 的入口文件是main-modern.cjs
```
{
  "exports": {
    ".": "./main.js"
  }
}

// 等同于
{
  "exports": "./main.js"
}
```



