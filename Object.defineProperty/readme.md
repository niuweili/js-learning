### 1.object.defineProperty 方法

https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty

> object.defineProperty(obj, prop, descriptor)

- obj: 要添加属性的对象
- prop: 要定义或修改的属性的名称或 [Symbol]
- descriptor: 要定义或修改的属性的描述符

#### 1.1 descriptor


- configurable： configurable 特性表示对象的属性是否可以被删除，以及除 value 和 writable 特性外的其他特性是否可以被修改（默认为false）

- enumerable： 定义了对象的属性是否可以在 for...in 循环和 Object.keys() 中被枚举（默认为false）

- value：该属性对应的值。可以是任何有效的 JavaScript 值（数值，对象，函数等）（默认为undefined）

- writable：当 writable 属性设置为 false 时，该属性被称为“不可写的”，它不能被重新赋值（默认false）

- get：属性的getter函数，当访问该属性时，会调用此函数，执行时不传入任何参数，但是会传入 this 对象（由于继承关系，这里的this并不一定是定义该属性的对象）。该函数的返回值会被用作属性的值（默认为undefined）

- set：属性的setter函数，当属性值被修改时，会调用此函数，该方法接受一个参数（也就是被赋予的新值），会传入赋值时的 this 对象（默认为undefined）


> 如果一个描述符同时拥有 (value 或 writable) 和 (get 或 set ) 键，则会产生一个异常


```JavaScript
let obj = {}

// 在对象中添加一个存取描述符属性的示例
let aValue = 1;
Object.defineProperty(obj, 'a', {
    enumerable: true,
    configurable: true,
    get: function () {
        return aValue
    },
    set: function (val){
        aValue = val
    }
})

// 在对象中添加一个属性与数据描述符的示例
Object.defineProperty(obj, 'b', {
    value: 1,
    writable: true,
    enumerable: true,
    configurable: true
})

// 数据描述符和存取描述符不能混合使用
// 会抛出错误：TypeError: value appears only in data descriptors, get appears only in accessor descriptors
Object.defineProperty(obj, 'c', {
    value: 1,
    get: function () {
        return aValue
    }
})
```
