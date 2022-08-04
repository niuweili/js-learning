// 1. map转为数组

// const myMap = new Map()
// myMap.set(true, 7)
// myMap.set({ foo: 3 }, ['abc'])

// console.log([...myMap]) // [ [ true, 7 ], [ { foo: 3 }, [ 'abc' ] ] ]

// 2. 数组转为Map
// const myMap = new Map([
//     [true, 7],
//     [{ foo: 3 }, ['abc']]
// ])
// console.log(myMap) // Map(2) { true => 7, { foo: 3 } => [ 'abc' ] }


// 3.Map转为对象

function strMapToObj(strMap) {
    let obj = Object.create({});
    for (let [k, v] of strMap) {
        obj[k] = v
    }
    return obj
}

// const myMap = new Map([
//     ['no', false],
//     ['yes', true]
// ])

// console.log(strMapToObj(myMap)) // { no: false, yes: true }

// 4.对象转Map
// 方法1：转换函数
// const obj = {
//     'yes': true,
//     'no': false
// }

function objToMap(obj) {
    let strMap = new Map();
    for (k in obj) {
        strMap.set(k, obj[k])
    }
    return strMap
}

// console.log(objToMap(obj)) // Map(2) { 'yes' => true, 'no' => false }

// 方法2：通过Object.entries()
// console.log(Object.entries(obj)) // [ [ 'yes', true ], [ 'no', false ] ]
// console.log(new Map(Object.entries(obj)))

// 5. Map转JSON

// 5.1 Map的key是字符串形式
// function srtMapToJson(strMap) {
//     return JSON.stringify(strMapToObj(strMap))
// }

// const myMap = new Map()
// myMap.set('yes', true)
// myMap.set('no', false)
// console.log(srtMapToJson(myMap)) // {"yes":true,"no":false}

// 5.2 Map的key是非字符串（可以转换为数组JSON）
// function srtMapToArrayJson(strMap) {
//     return JSON.stringify([...strMap])
// }
// const myMap = new Map()
// myMap.set(true, 7)
// myMap.set({ foo: 4 }, ['abc'])

// console.log(srtMapToArrayJson(myMap)) // [[true,7],[{"foo":4},["abc"]]]


// 6. JSON转Map

// 6.1 普通JSON转为Map
const json = {
    yes: true,
    no: false
}
function strJsonToMap(jsonStr) {
    return objToMap(JSON.parse(jsonStr))
}

console.log(strJsonToMap(JSON.stringify(json))) // Map(2) { 'yes' => true, 'no' => false }


// 6.2 数组JSON转Map
function jsonToMap(jsonStr) {
    return new Map(JSON.parse(jsonStr))
}
const arrJson = [[true, 7], [{ "foo": 4 }, ["abc"]]]

console.log(jsonToMap(JSON.stringify(arrJson))) // Map(2) { true => 7, { foo: 4 } => [ 'abc' ] }