// 1.基础使用
let obj = {};
// 监听obj.a
Object.defineProperty(obj, 'a', {
    // 定义obj.a的value=33
    value: 33,
    writable: true,
    enumerable: true,
    configurable: true
})

// 输出33
console.log('obj.a==', obj.a);

obj.a = 44;
// configurable: false writable: true   可以改变
// configurable: false writable: false  不可以改变
// configurable: true writable: false   不可以改变
// configurable: true writable: true    可以改变
console.log('obj.b-->', obj.a)

delete obj.a;
// configurable: true时输出undefined
console.log('delete后的obj.a', obj.a)

for (const key in obj) {
    // enumerable: false时无输出
    console.log('obj遍历出来的key', key)
}


// let person = {}
// let personName = 'lihua'

// // 在person上添加namp属性，值为personName
// Object.defineProperty(person, 'namp', {
//     get: function () {
//         console.log('触发了get方法')
//         return personName
//     },
//     set: function (val) {
//         console.log('触发了set方法')
//         personName = val
//     }
// })

// // 访问person.namp，触发了get方法
// console.log('person.namp:', person.namp)

// person.namp = 'luna';

// console.log('person.namp:', person.namp)

