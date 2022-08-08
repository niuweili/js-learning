### scope hoisting

背景：构建后的代码会有大量的闭包，引入的每个模块就是一个闭包

#### 导致的问题

* 大量函数闭包代码导致文件体积过大（模块越多体积越大）

* 闭包过多会对内存造成压力

#### 模块转换分析

* 被webpack转换后的代码模块会带一层包裹

* import 会被转换为__webpack.require__

#### scope hoisting 原理

* 将所有模块的代码按照引用顺序放在一个函数作用域中，然后适当的重命名一些变量以防止变量名冲突

#### 使用scope hoisting

* mode 为 production默认开启

* 引入[ModuleConcatenationPlugin](https://webpack.docschina.org/plugins/module-concatenation-plugin/#root)

```
plugin:[
    new webpack.optimize.ModuleConcatenationPlugin();
]
```

> 使用时需要注意必须是es6的语法
