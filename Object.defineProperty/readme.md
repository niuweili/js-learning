### 1.object.defineProperty 方法

https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty

> object.defineProperty(obj, prop, descriptor)

- obj: 要添加属性的对象
- prop: 要定义或修改的属性的名称或 [Symbol]
- descriptor: 要定义或修改的属性的描述符

#### 1.1 descriptor


- configurable： 键值为 true 时，该属性的描述符才能够被改变，同时该属性也能从对应的对象上被删除（默认为false）

- enumerable： 键值为 true 时，该属性才会出现在对象的枚举属性中（循环时打印不出来）（默认为false）

- value：该属性对应的值。可以是任何有效的 JavaScript 值（数值，对象，函数等）（默认为undefined）

- writable：是否可以被改变（默认false）

- get：属性的getter函数，当访问该属性时，会调用此函数，执行时不传入任何参数，但是会传入 this 对象（由于继承关系，这里的this并不一定是定义该属性的对象）。该函数的返回值会被用作属性的值（默认为undefined）

- set：属性的setter函数，当属性值被修改时，会调用此函数，该方法接受一个参数（也就是被赋予的新值），会传入赋值时的 this 对象（默认为undefined）


> 如果一个描述符同时拥有 value 或 writable 和 get 或 set 键，则会产生一个异常

> TypeError: Invalid property descriptor. Cannot both specify accessors and a value or writable attribute