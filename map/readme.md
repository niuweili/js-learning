## Map

### 1. Map

JS中的Object是键值对的组合，传统上只能用字符串作为键

Map结构类似于对象，但是可以用键的范围不只限制于字符串，Map的键可以是任何类型的值（包括对象）

Map实例的属性

- Map.prototype.size：返回一个Map对象的成员数量

Map实例的方法

分为五个操作方法：
- Map.prototype.set(key, value)：设置键名key对应的键值为value，然后返回整个 Map 结构
- Map.prototype.get(key)：读取key对应的键值，如果找不到key，返回undefined
- Map.prototype.has(key)：返回一个布尔值，表示某个键是否在当前 Map 对象之中
- Map.prototype.delete(key)：删除某个键，返回true。如果删除失败，返回false
- Map.prototype.clear()：clear方法清除所有成员，没有返回值

四个遍历方法

- Map.prototype.keys()：返回键名的遍历器
- Map.prototype.values()：返回键值的遍历器
- Map.prototype.entries()：返回所有成员的遍历器
- Map.prototype.forEach()：遍历 Map 的所有成员


### 2. WeakMap

WeakMap与Map的区别有两点

1. Weak只接收对象做为键名（null）除外，如果传入其它类型做为键值会报错

```
const map = new WeakMap();
map.set(1, 2) // TypeError: 1 is not an object!
map.set(Symbol(), 2) // TypeError: Invalid value used as weak map key
map.set(null, 2) // TypeError: Invalid value used as weak map key
```

2. WeakMap的键名所指向的对象，不计入垃圾回收机制

    它的键名所引用的对象都是弱引用，即垃圾回收机制不将该引用考虑在内。因此，只要所引用的对象的其他引用都被清除，垃圾回收机制就会释放该对象所占用的内存。也就是说，一旦不再需要，WeakMap 里面的键名对象和所对应的键值对会自动消失，不用手动删除引用

```
const e1 = document.getElementById('foo')
const e2 = document.getElementById('bar')
const arr = [
    e1, 'foo'
    e2, 'bar'
]

// 传统方式：当不需要e1和e2时，需要手动删除引用
arr[0] = null
arr[1] = null


// 这里使用WeakMap，对e1和e2都是弱引用，当dom元素被清除时，对应的WeakMap的记录就会被清除
const vm = new WeakMap()
vm.set(e1, 'foo')
vm.set(e2, 'bar')
```

需要注意的是，WeakMap只是对于键名进行弱引用，键值依然是正常引用关系

```
const key = { key: 1 }
let value = { foo: 1 }

const wm = new WeakMap()
wm.set(key, value)
value = null

console.log(wm.get(key)) // { foo: 1 }
```


* node演示垃圾回收过程

    首先运行 node --expose-gc （--expose-gc表示允许手动执行垃圾回收）

```
node --expose-gc
```

```
> global.gc() // 手动执行一次垃圾回收
undefined

> process.memoryUsage() // 查看内存占用情况
{
  rss: 22716416,
  heapTotal: 4907008,
  heapUsed: 2623536, // 此时占用为2.5MB左右
  external: 1512455,
  arrayBuffers: 9415
}

> let wm = new WeakMap()
undefined

> let key = new Array(5 * 1024 * 1024)
undefined

> wm.set(key, 1)
WeakMap { <items unknown> }

> global.gc()
undefined

> process.memoryUsage()
{
  rss: 67018752,
  heapTotal: 46907392,
  heapUsed: 44908080,  // 此时的内存使用情况达到了43MB左右
  external: 1520581,
  arrayBuffers: 9416
}

// 清除了key对于数组的引用，并未添加wm的键名对于数组的引用
> key = null 
null

> global.gc()
undefined

> process.memoryUsage()
{
  rss: 25210880,
  heapTotal: 4960256,
  heapUsed: 2912552,  // 内存降到2.5MB左右
  external: 1520581,
  arrayBuffers: 9416
}
```