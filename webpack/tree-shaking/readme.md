### tree shaking（摇树优化）

https://webpack.docschina.org/guides/tree-shaking/#root

概念：1个模块可能有多个方法，只要其中的某个方法使用到了，则整个文件都会被打到bundle里面去，tree shaking就是只把用到的方法打入bundle，没用到的方法会在uglify（webpack构建）阶段擦除掉

使用：

webpack默认支持，在 .babelrc 里设置 modules:false 即可

mode: production 的状态默认开启

> 必须es6的语法才支持，CJS的方法不支持（reuqire引入的js）

#### DCE（died code elimination）

* 代码不会被执行，不可到达的

```
if(false) {
    console.log('这段代码永远不会被执行')
}
```

* 代码执行的结果不会被用到

比如执行一个函数return了一个结果，但是并没有变量去接收return的结果

* 代码只会影响死变量（只写不读）

定义了一个变量，去改变变量，之后并没有读取变量

#### tree-shaking原理

利用了es6模块的特点

- import 或者 export 只能作为模块顶层的语句出现
- import 的模块名只能是字符串常量
- import 后的模块是 immutable（只读）的

reuqire 可以动态的引入，可以在不同情况灵活引用

tree-shaking 对模块代码静态分析，会对没有用的模块标记，然后在uglify阶段擦除


#### 问题记录

```
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

optimization: {
    usedExports: true,
    minimizer: [
        new CssMinimizerPlugin(),
    ],
}
```
CssMinimizerPlugin会关闭js的压缩，导致tree-shaking失效，需要引入TerserPlugin

```
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
+ const TerserPlugin = require("terser-webpack-plugin");

optimization: {
    usedExports: true,
    minimizer: [
        new CssMinimizerPlugin(),
+       new TerserPlugin() // 为了解决使用CssMinimizerPlugin后js文件无法被压缩
    ],
}
```

