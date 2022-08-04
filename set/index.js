// 1. add
// const s = new Set()

// s.add(1).add(2).add(2)

// console.log(s)  // Set(2) { 1, 2 }

// 2. delete
// s.delete(2)

// console.log(s)  // Set(1) { 1 }

// 3. has
// console.log(s.has(2)) // false

// 4. clear
// s.clear()
// console.log(s) // Set(0) {}

// 5. keys

// keys方法、values方法、entries方法返回的都是遍历器对象([Set Iterator])。由于 Set 结构没有键名，只有键值（或者说键名和键值是同一个值），所以keys方法和values方法的行为完全一致。

const s = new Set(['red', 'green', 'green', 'blue'])

// console.log(s.keys()) // [Set Iterator] { 'red', 'green', 'blue' }

// for (const item of s.keys()) {
//     console.log(item)
//     // red
//     // green
//     // blue
// }

// 6. values

// console.log(s.values()) // [Set Iterator] { 'red', 'green', 'blue' }

// for (const item of s.values()) {
//     console.log(item)
//     // red
//     // green
//     // blue
// }

// 7. entries

// console.log(s.entries())
// [Set Entries] {
//     ['red', 'red'],
//     ['green', 'green'],
//     ['blue', 'blue']
// }


// for (const item of s.entries()) {
//     console.log(item)
//     // [ 'red', 'red' ]
//     // [ 'green', 'green' ]
//     // [ 'blue', 'blue' ]
// }

// Set结构的实例默认可便利，它的默认遍历器生成函数就是它的values方法
// console.log(Set.prototype[Symbol.iterator] === Set.prototype.values) // true
// 这就意味着可以省略values方法，直播用for...of遍历循环Set
// for (const item of s) {
//     console.log(item)
//     // red
//     // green
//     // blue
// }

// 8. forEach与数组的forEach一样，可以用于对每个成员执行某种操作
// Set 结构的键名就是键值（两者是同一个值），因此第一个参数与第二个参数的值永远都是一样的
// s.forEach((value, key) => console.log(value, key))
// red red
// green green
// blue blue


// 应用场景

const setA = new Set([1, 2, 3, 4])
const setB = new Set([5, 6, 3, 4])

// // 并集
// function union(setA, setB) {
//     const s = new Set(setA)
//     for (const item of setB) {
//         s.add(item)
//     }
//     return s
// }
// // 差集
// function difference(setA, setB) {
//     const s = new Set(setA)
//     for (const item of setB) {
//         if (s.has(item)) {
//             s.delete(item)
//         } else {
//             s.add(item)
//         }
//     }
//     return s
// }
// // 交集
// function intersect(setA, setB) {
//     const s = new Set()
//     for (const item of setB) {
//         if (setA.has(item)) {
//             s.add(item)
//         }
//     }
//     return s
// }

// console.log(difference(setA, setB)) // Set(4) { 1, 2, 5, 6 }
// console.log(intersect(setA, setB)) // Set(2) { 3, 4 }
// console.log(union(setA, setB)) // Set(6) { 1, 2, 3, 4, 5, 6 }


// 数组的map和filter也可以间接用于Set

// const union = new Set([...setA, ...setB])
// console.log(union) // Set(6) { 1, 2, 3, 4, 5, 6 }
// 交集
// const intersect = new Set([...setA].filter(item => setB.has(item))) 
// console.log(intersect) // Set(2) { 3, 4 }
// 差集
// const difference = new Set([...setA, ...setB].filter(item => !setB.has(item) || !setA.has(item)))
// console.log(difference) // Set(4) { 1, 2, 5, 6 }


// 数组去重
// console.log(Array.from(new Set([1, 2, 3, 4, 4, 4, 4, 5]))) // [ 1, 2, 3, 4, 5 ]
