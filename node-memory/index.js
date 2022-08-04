const os = require('os')
const totalM = os.totalmem
const freeM = os.freemem

// 浏览器
// window.performance

// node API
// const memory = process.memoryUsage();

// {
//     rss: 20762624, // 所有内存占用，包括指令区和堆栈
//     heapTotal: 5005312, // 堆内存总占用
//     heapUsed: 3195408, // 已经使用的堆内存
//     external: 1080631, // 额外内存(可以扩展)
//     arrayBuffers: 9898
// }


function getMemory() {
    const memory = process.memoryUsage();
    const format = function (bytes) {
        return `${(bytes / 1024 / 1024).toFixed(2)}MB`
    }
    // console.log(`totalM:${format(totalM)}/freeM:${format(freeM)}`)
    console.log(`totalHeap:${format(memory.heapTotal)}/heapUsed:${format(memory.heapUsed)}`)
}

// 1.因为使用的是全局变量，所以无法被垃圾回收机制回收
// let count = 0
// function useMem() {
//     const size = 20 * 1024 * 1024
//     const arr = new Array(size)
//     count++
//     console.log(count)
//     return arr
// }

// let totalList = []
// for (let i = 0; i < 15; i++) {
//     getMemory()
//     totalList.push(useMem())
// }


// console.log('success')

// 老生代的内存限制
// max-old-space-size = 2048(MB)
// 新生代的内存限制
// max-new-space-size = 102400(KB)

// node --max-old-space-size=4096 ./node-memory/index.js

// 2.优化
const size = 20 * 1024 * 1024
const totalList = []

function fn(){
    const arr1 = new Array(size)
    const arr2 = new Array(size)
    const arr3 = new Array(size)
    const arr4 = new Array(size)
    const arr5 = new Array(size)
}

fn(); // fn执行完毕后，会把5个数组标记为垃圾，不会立马清除

for (let i = 0; i < 13; i++) {
    // for循环执行时，发现内存不够，会进行整理清除，清除掉fn中的垃圾
    totalList.push(new Array(size))
    getMemory()
}

console.log('success')
