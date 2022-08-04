## Set

### 1. Set

https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Set

Set本身是一个构造函数，用来生成Set数据结构，Set类似于数组，但是它的数值都是唯一的，没有重复的值。

1.1 Set的特殊值

- +0 与 -0 在存储判断唯一性的时候是恒等的，所以不重复
- undefined 与 undefined 是恒等的，所以不重复
- NaN 与 NaN 是不恒等的，但是在 Set 中认为 NaN 与 NaN 相等，所有只能存在一个，不重复

```
const s = new Set()
const arr = [2, 3, 3, 5, 2, 4, +0, -0, undefined, undefined, NaN, NaN]

arr.forEach(num => {
    s.add(num)
});
console.log(s)  // Set(7) { 2, 3, 5, 4, 0, undefined, NaN }
console.log(s.size) // 7

```

1.2 Set的属性和方法

Set结构的实例上有两个属性

- Set[Symbol.species];：访问器属性返回Set的构造函数

```
Set[Symbol.species]; // function Set()
console.log(Set[Symbol.species] === Set.prototype.constructor) // true
```
- Set.prototype.size：返回Set实例的成员总数。

Set实例的方法分为操作方法和遍历方法两种

4个操作方法：
- Set.prototype.add(value)：添加某个值，返回Set结构本身
- Set.prototype.delete(value)：删除某个值，返回一个布尔值，表示删除是否成功。
- Set.prototype.has(value)：返回一个布尔值，表示该值是否为Set的成员。
- Set.prototype.clear()：清除所有成员，没有返回值。

4个遍历方法：
- Set.prototype.keys()：返回键名的遍历器
- Set.prototype.values()：返回键值的遍历器
- Set.prototype.entries()：返回键值对的遍历器
- Set.prototype.forEach()：使用回调函数遍历每个成员

### 2. WeakSet

WeakSet 结构与 Set 类似，也是不重复的值的集合。但是，它与 Set 有两个区别，WeakSet 的成员只能是对象，而不能是其他类型的值。

```
const ws = new WeakSet();
ws.add(1) // TypeError: Invalid value used in weak set
ws.add(Symbol()) // TypeError: invalid value used in weak set
```

- 其次，WeakSet 中的对象都是弱引用，即垃圾回收机制不考虑 WeakSet 对该对象的引用，也就是说，如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在于 WeakSet 之中。

- 这是因为垃圾回收机制根据对象的可达性（reachability）来判断回收，如果对象还能被访问到，垃圾回收机制就不会释放这块内存。结束使用该值之后，有时会忘记取消引用，导致内存无法释放，进而可能会引发内存泄漏。WeakSet 里面的引用，都不计入垃圾回收机制，所以就不存在这个问题。因此，WeakSet 适合临时存放一组对象，以及存放跟对象绑定的信息。只要这些对象在外部消失，它在 WeakSet 里面的引用就会自动消失。

- 由于上面这个特点，WeakSet 的成员是不适合引用的，因为它会随时消失。另外，由于 WeakSet 内部有多少个成员，取决于垃圾回收机制有没有运行，运行前后很可能成员个数是不一样的，而垃圾回收机制何时运行是不可预测的，因此 ES6 规定 WeakSet 不可遍历。

- WeakSet没有size属性

所以WeakSet结构有三个方法

- WeakSet.prototype.add(value)：向 WeakSet 实例添加一个新成员。
- WeakSet.prototype.delete(value)：清除 WeakSet 实例的指定成员。
- WeakSet.prototype.has(value)：返回一个布尔值，表示某个值是否在 WeakSet 实例之中。
