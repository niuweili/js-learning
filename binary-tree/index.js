// 二叉搜索树（BST）：二叉树的一种，只允许在左侧节点存储比父节点小的值，往右侧节点存储比父节点大（或相等）的值
// 基类
function BinarySearchTree() {
    let Node = function (key) {
        this.key = key
        this.left = null
        this.right = null
    }
    let root = null
}

