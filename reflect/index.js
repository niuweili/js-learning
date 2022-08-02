// 1. Reflect.get(target, name, receiver)
// 1.1 查找并返回target的name属性，如果没有该属性，返回undeined
// 1.2 如果name属性部署了get函数，则读取函数的this绑定receiver
// 1.3 如果第一个参数不是对象，Reflect.get方法会报错

// const obj = {
//     name: 'lihua',
//     age: 18,
//     get desc() {
//         return this.name + this.age
//     }
// }

// const receiverObj = {
//     name: 'luna',
//     age: 33
// }

// console.log(Reflect.get(obj, 'name')) // lihua
// console.log(Reflect.get(obj, 'age')) // undefined

// console.log(Reflect.get(obj, 'desc', receiverObj))  // luna 33

// console.log(Reflect.get(1, 'get')) // TypeError: Reflect.get called on non-object

// 2.Reflect.set(target, name, value, receiver)

// 2.1 设置target对象的name等于value
// 2.2 如果name属性设置了赋值函数，则赋值函数的this绑定receiver

// const obj = {
//     name: 'lihua',
//     age: 18,
//     set setAge(value) {
//         return this.age = value
//     }
// }

// const receiverObj = {
//     name: 'luna',
//     age: 33
// }

// Reflect.set(obj, 'age', 22)
// console.log(obj.age) // 22

// Reflect.set(obj, 'age', 1, receiverObj)
// console.log(obj.age) // 18
// console.log(receiverObj.age) // 1

// 2.3 需要注意！如果Proxy对象和Reflect对象联合使用，Proxy拦截赋值操作，Reflect完成赋值行为，而且传入了receiver，那么Reflect.set方法会触发Proxy.defineProperty拦截

// const obj = {
//     name: 'lihua'
// }

// const handler = {
//     set: function (target, key, value, receiver) {
//         console.log(`触发了set ${key},新的值为${value}`)
//         return Reflect.set(target, key, value, receiver)
//     },
//     defineProperty: function (target, key, attr) {
//         console.log(`触发了defineProperty ${key}, attr`, attr)
//         Reflect.defineProperty(target, key, attr)
//     }
// }
// const proxy = new Proxy(obj, handler)
// proxy.name = 'xiaoming'

// console.log(proxy.name)
// console.log(obj.name)


// 3. Reflect.has(obj, name)
// 静态方法 Reflect.has() 作用与 in 操作符作用相同

// const obj = {
//     name: 'lihua'
// }
// // 旧写法
// console.log('name' in obj) 
// // 新写法
// console.log(Reflect.has(obj, 'name')) // true
// console.log(Reflect.has(obj, 'age')) // false


// 4.Reflect.deleteProperty(obj, name)
// Reflect.deleteProperty() 与 delete 操作符作用相同

// const obj = {
//     name: 'lihua',
//     age: 18
// }
// 旧写法
// delete obj.age
// 新写法
// Reflect.deleteProperty(obj, 'age')

// console.log(obj)


// 5. Reflect.construct(target, args)
// Reflect.construc() 等同于new target(...args)，这提供了一种不使用new来调用构造函数的方法

// function Person(age) {
//     this.age = age
// }
// // 旧写法
// const person = new Person(18)
// console.log(person.age) // 18

// // 新写法, 第二个参数为数组
// const person = Reflect.construct(Person, [18])
// console.log(person.age) // 18


// 6.Reflect.getPrototypeOf(obj)
// Reflect.getPrototypeOf()方法用于读取对象的__proto__属性，对应Object.getPrototypeof(obj)
// function Person(age) {
//     this.age = age
// }
// const person = new Person(18)

// console.log(Object.getPrototypeOf(person) === Person.prototype)  // true
// console.log(Reflect.getPrototypeOf(person) === Person.prototype) // true

// 7.Reflect.setPrototypeOf(obj, newProto) 

// Reflect.setPrototypeOf() 方法用于设置目标对象的原型（prototype），对应Object.setPrototype(obj, newProto)，返回一个布尔值，表示是否设置成功

// const obj = {}

// Object.setPrototypeOf(obj, Array.prototype)
// Reflect.setPrototypeOf(obj, Array.prototype)

// console.log(obj.length) // 0

// console.log(Reflect.setPrototypeOf({}, null)) // true
// console.log(Reflect.setPrototypeOf(Object.freeze({}), null)) // false


// 如果第一个参数不是对象，Object.setPrototypeOf会返回第一个参数本身，而Reflect.setPrototypeOf会报错。

// console.log(Object.setPrototypeOf(1, {})) // 1
// Reflect.setPrototypeOf(1, {}) // TypeError: Reflect.setPrototypeOf called on non-object

// 如果第一个参数是undefined或null，Object.setPrototypeOf和Reflect.setPrototypeOf都会报错。

// Object.setPrototypeOf(null, {}) // TypeError: Object.setPrototypeOf called on null or undefined
// Reflect.setPrototypeOf(null, {}) // TypeError: Reflect.setPrototypeOf called on non-object


// 8.Reflect.apply(func, thisArg, args)
// Reflect.apply()等同于Function.prototype.apply.call(func, thisArg, args)，用于绑定this对象后执行给定函数
// TODO:补充call apply相关


// 9.Reflect.defineProperty(target, propertyKey, attributes)
// Reflect.defineProperty方法基本等同于Object.defineProperty，用来为对象定义属性。未来，后者会被逐渐废除，请从现在开始就使用Reflect.defineProperty代替它

// function myDate() {}

// Object.defineProperty(myDate, 'now', {
//     value: () => Date.now()
// })

// Reflect.defineProperty(myDate, 'now', {
//     value: () => Date.now()
// })

// console.log(myDate.now())

// 可以与Proxy.defineProperty配合使用
// const p = new Proxy({}, {
//     defineProperty(target, prop, descriptor) {
//         console.log(descriptor);
//         return Reflect.defineProperty(target, prop, descriptor);
//     }
// });

// p.foo = 'bar'; // { value: "bar", writable: true, enumerable: true, configurable: true}

// console.log(p.foo) // "bar"

// 上述代码中Proxy.defineProperty对属性赋值设置了拦截，然后使用Reflect.defineProperty完成了赋值

// 10. Reflect.getOwnPropertyDescriptor(target, propertyKey)
// Reflect.getOwnPropertyDescriptor基本等同于Object.getOwnPropertyDescriptor，方法返回指定对象上一个自有属性对应的属性描述符。（自有属性指的是直接赋予该对象的属性，不需要从原型链上进行查找的属性），将来会替代掉后者
// const obj = {
//     foo: 'obj.foo'
// }
// console.log(Object.getOwnPropertyDescriptor(obj, 'foo'))
// console.log(Reflect.getOwnPropertyDescriptor(obj, 'foo'))
// {
//     value: 'obj.foo',
//     writable: true,
//     enumerable: true,
//     configurable: true
// }


// 11. Reflect.isExtensible (target)
// Reflect.isExtensible方法对应Object.isExtensible，返回一个布尔值，表示当前对象是否可扩展。
// const obj = {};
// // 旧写法
// Object.isExtensible(obj) // true

// // 新写法
// Reflect.isExtensible(obj) // true


// 12. Reflect.preventExtensions(target)
// Reflect.preventExtensions对应Object.preventExtensions方法，用于让一个对象变为不可扩展。它返回一个布尔值，表示是否操作成功

var myObject = {};

// 旧写法
console.log(Object.preventExtensions(myObject)) // {}

// 新写法
console.log(Reflect.preventExtensions(myObject)) // true


// 13. Reflect.ownKeys (target)
// Reflect.ownKeys方法用于返回对象的所有属性，基本等同于Object.getOwnPropertyNames与Object.getOwnPropertySymbols之和。

var myObject = {
    foo: 1,
    bar: 2,
    [Symbol.for('baz')]: 3,
    [Symbol.for('bing')]: 4,
};

// 旧写法
Object.getOwnPropertyNames(myObject) // ['foo', 'bar']

Object.getOwnPropertySymbols(myObject) //[Symbol(baz), Symbol(bing)]

// 新写法
Reflect.ownKeys(myObject) // ['foo', 'bar', Symbol(baz), Symbol(bing)]


// 使用proxy实现观察者模式
// 观察者模式（Observer mode）指的是函数自动观察数据对象，一旦对象有变化，函数就会自动执行。

// 创建观察者队列
const queuedObservers = new Set();
// 将观察者放在队列中
const observer = fn => queuedObservers.add(fn);
// 创建代理对象
const observable = obj => new Proxy(obj, { set });
function set(target, key, value, receiver) {
    const result = Reflect.set(target, key, value, receiver);
    // 通过拦截set操作，自动执行所有观察者
    queuedObservers.forEach(observer => observer(target));
    return result;
}

const person = observable({
    name: 'lihua',
    age: 1
})

function logFn(obj) {
    console.log(`${obj.name}, ${obj.age}`)
}
// 向队列中添加对应的观察者函数
observer(logFn)

// set函数执行，触发观察者队列中对应的console.log
person.name = 'xiaoming'
// 输出 xiaoming, 1