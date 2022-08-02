const obj = {
    name: 'lihua',
    age: 22,
    address: {
        province: "山西",
        city: "长治"
    },
    fn: function () {
        return this === objProxy
    }
}

// 1.监听对象值的操作
const objProxy = new Proxy(obj, {
    get: function (target, key) {
        console.log(`触发了get ${key}:`, target[key])
        // 与object.definProperty不同的是，这里并不会再次执行get，引起内存泄漏的问题
        return target[key]
    },
    set: function (target, key, val) {
        console.log(`触发了set ${key},新值为${val}`)
        target[key] = val
    }
})

// objProxy.name = 'xiaoming' // 成功触发set
// console.log(objProxy.name) // 可以触发get
// objProxy.address.city = '北京'   // 深层对象，与definProperty一样不能触发set，只可以触发address的get
// console.log(objProxy.address.city) // 可以触发get
// objProxy.height = '123' // 新添加的属性，可以触发set

// // 执行了set
// objProxy.name = 'xiaoming'

// // 代理会将objProxy的操作转发到js原生对象上
// console.log(obj.name, objProxy.name)  // xiaoming, xiaoming


// 2.proxy代理数组

// const target = [
//     'data',
//     {
//         name: 'lihua',
//         age: 18,
//         address: {
//             province: "北京",
//             city: "北京"
//         },
//     },
//     {
//         name: 'xiaoming',
//         age: 22,
//         address: {
//             province: "山西",
//             city: "长治"
//         },
//     },
// ]

// const handler = {
//     get: function (target, key) {
//         console.log(`触发了get ${key}`)
//         return target[key]
//     },
//     set: function (target, key, value) {
//         console.log(`触发了set ${key},新的值为${value}`)
//         target[key] = value
//     }
// }
// const proxy = new Proxy(target, handler)

// proxy[1].name  // 深层对象可以触发第1项的get
// proxy[1].name = 'luna'  // 深层对象不可以触发set，只触发了第1项的get

// proxy[0] = 'proxy' // 第一层可以正常触发set

// proxy[3] = 9999  // 新添加的项可以正常触发set
// console.log(proxy[3]) // 新添加的项可以正常触发get


// 3.this指向的问题

// 3.1 目标对象内部的this会自动改变为proxy代理对象
// const target = {
//     m: function () {
//         console.log(this === proxy)
//     }
// }
// const proxy = new Proxy(target, {})

// target.m() // false
// proxy.m()  // true

// 导致的问题：目标对象原有的一些方法访问不到
// const date = new Date();
// const dateHandler = {
//     get(target, key, receiver) {
//         // 解决this指向问题
//         if (key === 'getDate') {
//             return target.getDate.bind(target)
//         }
//         return target[key];
//     },
// }
// const dateProxy = new Proxy(date, dateHandler)
// console.log(dateProxy.getDate()) // TypeError: this is not a Date object.


// 3.2 proxy拦截函数内部的this，指向的是hanlder对象

// 4.revceiver 表示Proxy 或者继承 Proxy 的对象

// const parent = {
//     get value() {
//         return '19Qingfeng';
//     },
//     age: 18
// };

// const handler = {
//     // 不要将 revceiver 和 get 陷阱中的 this 弄混了，陷阱中的 this 关键字表示的是代理的 handler 对象。
//     get(target, key, receiver) {
//         console.log(this === handler)       // true
//         console.log(receiver === proxy);
//         console.log(receiver === obj)
//         return target[key];
//     },
// }

// const proxy = new Proxy(parent, handler);

// proxy.age // 此时的receiver为proxy

// const obj = {
//     name: 'wang.haoyu',
// };

// // 设置obj继承与parent的代理对象proxy
// Object.setPrototypeOf(obj, proxy);

// obj.value   // 此时的receiver为obj














