### webpack基础库存分离

- 思路：将react、react-dom 或 vue 基础包通过cdn引入，不打入bundle中

1. 使用 [html-webpack-externals-plugin](https://www.npmjs.com/package/html-webpack-externals-plugin)，引入vue的cdn资源

```
new HtmlWebpackExternalsPlugin({
  externals: [
    {
      module: 'vue',
      entry: 'https://unpkg.com/vue@3.2.36/dist/vue.global.js',
      global: 'Vue'
    },
  ],
})
```

2. 使用webpack4内置的，[splitChunksPlugin](https://webpack.docschina.org/plugins/split-chunks-plugin)将vue单独打包到vendors.js中 
>从 webpack v4 开始，移除了 CommonsChunkPlugin，取而代之的是 optimization.splitChunks

```
 optimization: {
    splitChunks: {
        minSize: 0, // 被引用的文件大小
        cacheGroups: {
            // vue资源抽离
            vendors: {
                test: /vue/,
                name: 'vendors',
                chunks: 'all',
            },
        },
    },
},
```

chunks参数说明

* async 异步引入的库
* initial 同步引入的库
* all 所有的库


### 代码分割

对于一个大的web应用而言，所有的代码都打包在bundle.js里，显然是不合理的，而且在h5页面中（比如tab切换）是不需要加载所有的代码的，可以通过js懒加载（按需加载）的形式来加载所需要的模块

- 抽离相同代码到一个共享块

- 懒加载js脚本的方式

  * CommonJs：reuqire.ensure

  * ES6：动态import（目前还没有原生支持，需要通过babel plugin转换）

```
npm i --save-dev @babel/plugin-syntax-dynamic-import -D
```

```
{
  "plugins": ["@babel/plugin-syntax-dynamic-import"]
}

```

> 通过动态import的js在一定时机触发加载后，会在network发送加载js的请求，请求完成后会在html动态插入js（JSONP的加载模式）


webpack动态import的原理解析

1.所有的依赖都通过webpack.require方法保存在__webpack_module_cache__变量中，如果没有对应的依赖，就会往__webpack_module_cache__变量中注入对应的模块

```
// The module cache
// 保存所有引入的模块
var __webpack_module_cache__ = {};

// The require function
function __webpack_require__(moduleId) {
	// Check if module is in cache
	var cachedModule = __webpack_module_cache__[moduleId];
	if (cachedModule !== undefined) {
		return cachedModule.exports;
	}
	// Create a new module (and put it into the cache)
	var module = __webpack_module_cache__[moduleId] = {
		// no module.id needed
		// no module.loaded needed
		exports: {}
	};

	// Execute the module function
	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);

	// Return the exports of the module
	return module.exports;
}
```
2. 动态引入的模块通过__webpack_require__.e方法使用Promise.all加载

```
/* webpack/runtime/ensure chunk */
(() => {
	__webpack_require__.f = {};
	// This file contains only the entry 
	// The chunk loading function for  chunks
	__webpack_require__.e = (chunkId) => {
		return Promise.all(Object.keys_require__.f).reduce((promises, key) => {
			__webpack_require__.f[key](chunkId, 
			return promises;
		}, []));
	};
})();
```

3. 调用__webpack_require__.f.j方法通过installedChunks记录

```
__webpack_require__.f.j = (chunkId, promises) => {
    // JSONP chunk loading for javascript
    var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
    if(installedChunkData !== 0) { // 0 means "already installed".

      // a Promise means "currently loading".
      if(installedChunkData) {
        promises.push(installedChunkData[2]);
      } else {
        if(true) { // all chunks have JS
          // setup Promise in chunk cache
          var promise = new Promise((resolve, reject) => (installedChunkData = installedChunks[chunkId] = [resolve, reject]));
          promises.push(installedChunkData[2] = promise);

          // start chunk loading
          var url = __webpack_require__.p + __webpack_require__.u(chunkId);
          // create error before stack unwound to get useful stacktrace later
          var error = new Error();
          var loadingEnded = (event) => {
            if(__webpack_require__.o(installedChunks, chunkId)) {
              installedChunkData = installedChunks[chunkId];
              if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
              if(installedChunkData) {
                var errorType = event && (event.type === 'load' ? 'missing' : event.type);
                var realSrc = event && event.target && event.target.src;
                error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
                error.name = 'ChunkLoadError';
                error.type = errorType;
                error.request = realSrc;
                installedChunkData[1](error);
              }
            }
          };
          __webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
        } else installedChunks[chunkId] = 0;
      }
    }
};
```