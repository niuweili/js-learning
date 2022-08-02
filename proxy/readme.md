## proxy

Proxy 可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。

Proxy 这个词的原意是代理，用在这里表示由它来“代理”某些操作，可以译为“代理器”。

https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy

### 1.语法

```
const p = new Proxy(target, handler)
```


### 2.Proxy.revocable()方法

Proxy.revocable() 方法可以用来创建一个可撤销的代理对象。


https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/revocable
 
```
Proxy.revocable(target, handler)
```
#### 2.1 返回值

返回一个包含了代理对象本身和它的撤销方法的可撤销的 proxy 对象

该方法的返回值是一个对象，其结构为： {"proxy": proxy, "revoke": revoke}，其中：

- proxy：表示新生成的代理对象本身，和用一般方式创建的代理对象没有不同，只是它可以被撤销掉

- revoke：撤销方法，调用的时候不需要加任何参数，就可以撤销掉和它一起生成的那个代理对象。

```
const revocable = Proxy.revocable({}, {
    get: function (target, key) {
        return `[[${key}]]`
    }
})

const proxy = revocable.proxy;
proxy.foo;

revocable.revoke();

console.log(proxy.foo)      // TypeError: Cannot perform 'get' on a proxy that has been revoked
proxy.foo = 1               // TypeError: Cannot perform 'set' on a proxy that has been revoked
delete proxy.foo            // TypeError: Cannot perform 'deleteProperty' on a proxy that has been revoked
console.log(typeof proxy)   // object, 因为typeof 不属于可代理操作
```

### 3.handler.set()

#### 3.1 返回值

set() 方法应当返回一个布尔值。

返回 true 代表属性设置成功。
在严格模式下，如果 set() 方法返回 false，那么会抛出一个 TypeError 异常。
