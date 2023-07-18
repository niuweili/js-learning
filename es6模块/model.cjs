let a = 1;
let obj = {
    name: 'CommonJs'
}
function setA() {
    a++;
    obj.name = 'set CommonJS'
}

// 1.可通过在exports上挂载的方式导出
// exports.a = 3

// 2.使用module.exports导出一个object
module.exports = {
    a,
    obj,
    setA
}