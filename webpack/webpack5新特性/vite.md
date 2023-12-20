## 提升开发体验

- bundless在开发阶段返回源文件，可以很好的提升HMR的速度

- debug阶段也可以很好的进行调试，不需要使用sourcemap，可以直接进行debug


bundle 会将源文件打包成bundle.js文件返回，当项目文件比较大时，HMR的时间会很长

bundless 在HMR阶段直接返回修改过的源文件，没有编译的流程，对单个文件更好缓存


## 构建原理

### 1.构建速度快的原因

预构建汇使用ESBuild（冷启动快的原因）

ESBuild原理是使用Golang（静态语言）要比js（动态语言）运行速度快很多

### 2.打包流程

#### 2.1 创建构建服务

1. 创建KOA Server
2. 使用chokidar监听文件变化（HMR）
3. 模块解析
4. 增加各种中间件
5. 启动服务

#### 2.2 静态文件托管服务

.vue文件浏览器是不能直接解析的，但是可以直接解析 import、export 等ES6语法
因此就需要在server里进行编译


- vite利用`serverStaticePlugin`将整个项目根目录和`public`目录设置为静态目录

- 利用 koa-etag 中间件打 etag，如果文件发生了变化，通过etag把变化的信息通知过去，达到浏览器的更新

- **devServer 具备静态文件服务功能** 


#### 2.3 重写模块路径

`bare import` 裸导入
```
import Vue from 'vue'
```

浏览器无法处理这种语法，只可以识别相对路径和绝对路径

- vite利用`serverPluginModuleRewrite` 将模块名替换成这个模块的entry path，并在path的开头补上一个`/@module`的标识符

```
import Vue from '/@modules/vue/dist/vue.runtime.esm-bundler.js'
```

相对路径转换为绝对路径，方便浏览器请求

- 补齐文件扩展名和经常被省略的index.xxx
```
import a from 'src/a/index.js'
```

- 给非js类型（js类型：js(x)/ts(x)/vue）的文件地址加上一个叫`import`的 qurey 参数

```
import 'css/style.css?import'
```

- 给HMR相关的请求地址添加时间戳，避免缓存
```
import 'src/App.js?timestamp=xxx'
```

#### 2.3 静态资源打包

浏览器中是不支持js中直接import CSS、图片、JSON等语法的

- webpack loader的处理策略：
    - CSS：转换为js模块，执行模块会在DOM中创建`<style>`标签并插入css内容
    - 图片：转换为图片路径或base64
    - JSON：转换为js模块，导出数据，如：default export = json

- vite 对 vue 资源的打包

    - 判断url后缀如果是.vue，利用`@vue/compiler-sfc`将vue文件进行解析

    - 获取script内容

    - 如果有style就发送请求获取style的部分，并在url后缀上拼接`?type=style`

    - 发送请求获取template的部分，并在url后缀上拼接`?type=template`

    - 进行渲染

- vite 对 css 资源的打包

    - 对.css文件请求和.js文件中import的css文件，进行区分
    
    - 如果是import的css文件，会进行Sass/Less的编译处理，将css源码包装成js模块

    - 通过CSS Style Shee API创建style标签，将CSS代码插入DOM中

    - 如果开启了CSS Module，则导出一个对象，否则直接导出CSS代码
     
- vite 模版打包策略

    - 如果是template类型的文件，用`@vue/compiler-dom`在服务端起一个server，在server里编译template内容并返回


## 如何取舍？

复杂场景使用webpack，因为webpack生态强大

vite生态如果可以满足，则可以使用vite

可以尝试开发阶段引入esbuild，构建阶段使用webpack