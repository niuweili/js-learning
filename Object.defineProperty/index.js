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


// 2. 自定义getter和setter
function Person() {
    let age = 22;
    let stepList = []
    const name = 'lihua'

    Object.defineProperty(this, 'age', {
        get: function () {
            console.log('触发了get')
            return age
        },
        set: function (value) {
            age = value;
            stepList.push({ val: value })
        }
    })

    this.getStepList = function () {
        return stepList
    }
}

const person = new Person();
console.log('person.age', person.age)

person.age = 33;
person.age = 44;
// 输出[ { val: 33 }, { val: 44 } ]
console.log(person.getStepList())



// 3.深层嵌套对象无法被监听

// 遇到的问题：get里return obj[key]会执行get方法，引发内存泄漏
// for (const key in person) {
//     if (Object.hasOwnProperty.call(person, key)) {
//         Object.defineProperty(person, key, {
//             enumerable: true,
//             configurable: true,
//             get: function () {
//                 console.log('get');
//                 // ！这里会引起内存泄漏，因为每次return person[key]也执行了get
//                 // return person[key]

//             },
//             set: function (val) {
//                 console.log('set-->', val)
//                 obj[key] = val;
//             }
//         })
//     }
// }

// 解决方案：封装一个observer
function defineProperty(obj, key, val) {
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function () {
            console.log('get-->', key);
            return val

        },
        set: function (x) {
            console.log('set-->', x)
            val = x;
        }
    })
}

function observer(params) {
    for (const key in params) {
        defineProperty(params, key, params[key])
    }
}

const person = {
    name: 'lihua',
    age: 22,
    address: {
        province: "山西",
        city: "长治"
    }
}

observer(person)

// 正常触发set函数
person.age = 44

// set函数没有被触发（触发了address属性的get），深层对象监听需要递归
person.address.city = "太原"

// set函数会被触发
person.address = {
    province: '河北',
    city: '承德'
}

// 新增属性get和set都不会触发
person.height = 222;
console.log('person.height-->', person.height)



// 4.监听数组
// 深层数组跟对象一样只能监听到get方法

const arr = [1, 2, 3, 4, [5, [6, 7]]];

observer(arr);

// 执行了set方法
arr[0] = 444;

// 只会执行下标为4的get方法
arr[4][0] = 555


// 5.封装递归函数，深度监听对象/数组的变化

function deepDefineProperty(obj, key, val) {
    // 如果传入的是一个属性也是一个对象，继续监听
    if (typeof val === "object" || Array.isArray(val)) {
        deepObserver(val)
    }
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function () {
            console.log('get-->', key);
            return val

        },
        set: function (newVal) {
            console.log('set-->', newVal)
            if (typeof newVal === "object") {
                deepObserver(newVal)
            }
            if (val !== newVal) {
                val = newVal;
            }
        }
    })
}
const originProto = Array.prototype
// 创建新对象，原型指向 originProto，再扩展新的方法不会影响原型
const arrayProto = Object.create(originProto);
const methodList = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
]

methodList.forEach(method => {
    arrayProto[method] = function () {
        originProto[method].apply(this, arguments)
        console.log('监听赋值', arguments)
    }
})

function deepObserver(params) {
    //如果传入的不是一个对象，return
    if (typeof params !== "object" || params === null) {
        return
    }
    // 如果是数组，重写原型
    if (Array.isArray(params)) {
        params.__proto__ = arrayProto
        for (const key in params) {
            // 传入的数组可能是多纬度
            deepObserver(params[key])
        }
    } else {
        for (const key in params) {
            deepDefineProperty(params, key, params[key])
        }
    }
}

const deepObj = {
    a: 1,
    b: {
        c: {
            name: 'a-b-c'
        }
    }
}
deepObserver(deepObj)

// 执行了set方法并且走了b&c的get方法
deepObj.b.c.name = 'aaaaaa'


const deepArr = [1, 2, 3, 4];

deepObserver(deepArr)
// 在原型的方法上监听到了改变
deepArr.push([1111, [22222]])


// 6. 定义set方法，实现新增属性也可以监听
function set(obj, key, val) {
    deepDefineProperty(obj, key, val)
}

set(deepArr, [6], 66666)

// 可以执行set方法
deepArr[6] = 88
