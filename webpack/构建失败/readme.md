### 如何判断是否构建失败

每次构建完后可以通过输入命令获取错误码

```
> echo $? 
```

webpack4后构建失败会抛出错误码

Node.js中的process.exit规范

- 0：成功完成，回调函数中，err为null
- 非0：执行失败，回调函数中，err不为null，err.code 就是传给exit的数字


### 如何主动捕获并处理构建错误


1. compiler在每次构建结束后会触发done的hook

```
// buildErrorPlugin.js

class BuildErrorPlugin {
    apply(compiler) {
        compiler.hooks.done.tap('done', function (stats) {
            if (stats.compilation.errors && stats.compilation.errors.length && process.argv.indexOf('--watch') < 0) {
                console.log('build error')
                process.exit(2) // 抛出错误
            }
        })
    }
}
module.exports = BuildErrorPlugin
```

```
// webpack.config.js

const BuildErrorPlugin = require("./buildErrorPlugins.js")

plugins:[
    new BuildErrorPlugin()
]
```

2. process.exit 主动抛出构建错误