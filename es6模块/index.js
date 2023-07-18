// import 不可以引入commonJs模块，会报错
// import cjs from './model.cjs'
// 正确方式
// const cjs = require('./model.cjs');

// require引入是值的拷贝，后续的修改不会影响到输出的a
// 但是obj是引用类型，内部obj的变化会反应到外部输出的obj
// const { a, setA, obj } = require('./model.cjs');
// console.log(a, obj.name) // 1 CommonJs
// setA()
// console.log(a, obj.name) // 1 set CommonJS

// js引擎对脚本静态分析的时候，遇到模块加载命令import，会生成一个只读引用，等到脚本执行时，再根据这个只读引用，去模块里面取值
// 所以原始值变化了，外部的值也会跟着变化
// import { a, setA } from './model.mjs'
// console.log(a) // 1
// setA()
// console.log(a) // 2

// esm是动态引用，不会缓存值
// import { foo } from './model.mjs'
// console.log(foo) // 'foo'
// setTimeout(() => {
//     console.log(foo) // 'baz'
// }, 500)

// 将cjs模块以import方式引入
import { obj } from './model.mjs'
console.log(obj)  // { name: 'CommonJs' }

// 以CommonJS方式引入
// (async () => {
//     const obj = (await import('./model.mjs')).obj
//     console.log(obj) // { name: 'CommonJs' }
// })()