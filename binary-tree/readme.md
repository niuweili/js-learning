## 二叉树（binary tree）

二叉树是树形结构的一个重要类型，特点是每个结点只能有两棵子树，且有左右之分

* 二叉搜索树（BST）：二叉树的一种，只允许在左侧节点存储比父节点小的值，往右侧节点存储比父节点大（或相等）的值

* 完全二叉树（CBT）：拥有完整的左右节点的二叉树，或者所有节点都靠左或靠右

### 1. 遍历

#### 1.1 前序遍历

中->左->右

![alt](https://pic.leetcode-cn.com/Figures/binary_tree/preorder_traversal/Slide19.png)


#### 1.2 中序遍历

左->中->右

![alt](https://pic.leetcode-cn.com/Figures/binary_tree/inorder_traversal/Slide22.png)


#### 1.3 后序遍历

左->右->中

![alt](https://pic.leetcode-cn.com/Figures/binary_tree/postorder_traversal/Slide19.png)



#### 1.4 深度优先搜索

1.访问根节点

2.对根节点的children挨个进行遍历

#### 1.5 广度优先搜索

从一个根节点开始，首先访问节点本身，然后遍历它的相邻节点，其次遍历二级邻节、三级邻节点，以此类推

1.新建一个队列，根节点入队

2.队头出队，把队头的children挨个入队

3.重复操作，直到队列清空

![alt](https://pic.leetcode-cn.com/Figures/binary_tree/level_traversal/Slide17.png)

