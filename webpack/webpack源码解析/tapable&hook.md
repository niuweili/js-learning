webpack的本质就是基于事件流的一个编程范例，一系列的插件运行，每个插件会监听Compiler和Compilation的事件节点

webpack核心的对象Compiler和Compilation都是基于tapable的

## 1. tapable是什么？

tapable是类似于nodeJs中的EventEmitter发布订阅的模块

tapable主要控制钩子函数的发布订阅，控制着webpack的插件系统

tapable暴露了很多Hook（钩子）类，为插件提供挂载的钩子

## 2. Hook（钩子）

每个钩子代表一个关键的事件节点，一般编写插件时也是需要监听钩子函数，用来在不同的阶段来做不同的事情

- SyncHook：同步钩子
- SyncBailHook：同步熔断钩子（遇到return直接返回）
- SyncWaterfallHook：同步流水钩子（执行的结果可以传递给下一个插件）
- SyncLoopHook：同步循环钩子（监听函数返回true表示继续循环，返回undefined表示结束循环）
- AsyncParallelHook：异步并发钩子
- AsyncParallelBailHook：异步并发熔断钩子
- AsyncSeriesHook：异步串行钩子
- AsyncSeriesBailHook：异步串行熔断钩子
- AsyncSeriesWaterfallHook：异步串行流水钩子

### 2.1 使用Hook

```
const { SyncHook } = require('tapable')

const hook = new SyncHook(['arg1', 'arg2', 'arg3'])

// 绑定事件
hook.tap('hook', (arg1, arg2, arg3) => {
    console.log(arg1, arg2, arg3) // ==> 1, 2, 3
})
// 执行事件
hook.call(1, 2, 3)
```

1. 每个Hook都是类，需要用关键字new方法获得所需要的钩子

    * new Hook时接收options参数是一个数组，**重要的是数组中对应的字符串个数**

    * 其实 new Hook 时还接受第二个参数 name ，它是一个 string。这里文档上并没有你可以先忽略这个参数

2. 通过tap函数监听对应的事件

    * 第一个参数是一个字符串，它没有任何实际意义仅仅是一个标识位而已

    * 第二个参数表示本次注册的函数，在调用时会执行这个函数

3. 最后就是通过 call 方法传入对应的参数，调用注册在 hook 内部的事件函数进行执行

    * 同时在 call 方法执行时，会将 call 方法传入的参数传递给每一个注册的事件函数作为实参进行调用

在 Tapable 中所有Hook可以分为同步、异步两种类型

![alt](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3744ee0e150641f0b29e4476577bb67a~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

同步和异步的钩子也需要区分不同的注册和绑定方法
|  | Async* | Sync* |
| --- | --- | --- |
| 绑定 | tapAsync/tapPromise/tap | tap |
| 执行 | callAsync/callPromise | call |

