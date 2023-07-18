let a = 1;
function setA() {
    a++
}

let foo = 'foo'
setTimeout(() => {
    foo = 'baz'
}, 500)

// 同时支持两种格式的模块
import cjsModel from './model.cjs'
export const obj = cjsModel.obj

export {
    a,
    foo,
    setA,
};