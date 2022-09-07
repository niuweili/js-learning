
## webpack钩子

1. entry-option：初始化option
2. run：开始编译
3. make：对entry开始递归的分析依赖，对每个依赖模块进行build
4. before-resolve：对模块位置进行解析
5. build-module：开始构建某个模块（js代码）
6. normal-moudel-loader：将loader加载完成的module进行编译，生成AST树
7. program：遍历AST，当遇到require等一些表达式时，收集依赖
8. seal：所有依赖build完成，开始优化（优化chunks，对模块顺序进行排序）
9. emit：输出到dist目录

**compilation：负责模块编译和优化处理** 

### 1.准备阶段

```
const createCompiler = rawOptions => {
	const options = getNormalizedWebpackOptions(rawOptions);
	applyWebpackOptionsBaseDefaults(options);
	const compiler = new Compiler(options.context);
	compiler.options = options;
	new NodeEnvironmentPlugin({
		infrastructureLogging: options.infrastructureLogging
	}).apply(compiler);
	if (Array.isArray(options.plugins)) {
		for (const plugin of options.plugins) {
			if (typeof plugin === "function") {
				plugin.call(compiler, compiler);
			} else {
				plugin.apply(compiler);
			}
		}
	}
	applyWebpackOptionsDefaults(options);
	compiler.hooks.environment.call();
	compiler.hooks.afterEnvironment.call();
	new WebpackOptionsApply().process(options, compiler);
	compiler.hooks.initialize.call();
	return compiler;
};
```
* NodeEnvironmentPlugin：清理构建的缓存

* applyWebpackOptionsDefaults：负责生成默认的options参数

* WebpackOptionsApply：将所有的配置options转换为webpack内部插件，使用默认插件列表

    * output.externals -> ExternalsPlugin
    * output.devtool -> EvalSourceMapDevToolPlugin/SourceMapDevToolPlugin，EvalDevToolModulePlugin


### 2. 模块构建&资源生成阶段

ModuleFactory

* NormailModuleFactory
* ContextModuleFactory

Module

* NormailModule：普通模块
    
    build构建阶段：
    1. 使用loader-runner运行loader
    2. 通过Parser解析（内部是acron）将内部依赖解析出来
    3. ParserPlugin添加依赖

* ContextModule：./src/a带有路径引入的模块
* ExternalModule：module.exports = jQuery
* DelegatedModule：manifest
* MultiModule：entry: ['a','b']


1. webpack创建compiler开始执行compiler.run方法
```
const { compiler, watch, watchOptions } = create();
if (watch) {
    compiler.watch(watchOptions, callback);
} else {
    compiler.run((err, stats) => {
        compiler.close(err2 => {
            callback(err || err2, stats);
        });
    });
}
```

2. compiler.run中依次执行beforeRun->run->this.compile

```
const run = () => {
    this.hooks.beforeRun.callAsync(this, err => {
        if (err) return finalCallback(err);

        this.hooks.run.callAsync(this, err => {
            if (err) return finalCallback(err);

            this.readRecords(err => {
                if (err) return finalCallback(err);

                this.compile(onCompiled);
            });
        });
    });
};
```

3. compile方法中开始执行make钩子开始执行构建过程

```
compile(callback) {
    const params = this.newCompilationParams();
    this.hooks.beforeCompile.callAsync(params, err => {
        if (err) return callback(err);

        this.hooks.compile.call(params);

        const compilation = this.newCompilation(params);

        const logger = compilation.getLogger("webpack.Compiler");

        logger.time("make hook");
        this.hooks.make.callAsync(compilation, err => {
            logger.timeEnd("make hook");
            if (err) return callback(err);

            logger.time("finish make hook");
            this.hooks.finishMake.callAsync(compilation, err => {
                logger.timeEnd("finish make hook");
                if (err) return callback(err);

                process.nextTick(() => {
                    logger.time("finish compilation");
                    compilation.finish(err => {
                        logger.timeEnd("finish compilation");
                        if (err) return callback(err);

                        logger.time("seal compilation");
                        compilation.seal(err => {
                            logger.timeEnd("seal compilation");
                            if (err) return callback(err);

                            logger.time("afterCompile hook");
                            this.hooks.afterCompile.callAsync(compilation, err => {
                                logger.timeEnd("afterCompile hook");
                                if (err) return callback(err);

                                return callback(null, compilation);
                            });
                        });
                    });
                });
            });
        });
    });
}
```

依次执行：beforeCompile->compile->make->finishMake->compilation.finish

4. 监听make钩子解析entry

```
compiler.hooks.make.tapAsync("EntryPlugin", (compilation, callback) => {
    compilation.addEntry(context, dep, options, err => {
        callback(err);
    });
});
```

EntryPlugin.js监听到make钩子会执行compilation.addEntry方法将entry的入口信息解析成一个个的module

5. buildModule阶段

通过compilation.addEntry->compilation._addEntryItem->compilation.addModuleTree->compilation.handleModuleCreation->compilation.factorizeModule->compilation.addModule->compilation.buildModule->module.build
最后来到NormalModule中的doBuild方法

```
const { runLoaders } = require("loader-runner");
doBuild(options, compilation, resolver, fs, callback){
    // runLoaders从包'loader-runner'引入的方法
    runLoaders({
        resource: this.resource,  // 这里的resource可能是js文件，可能是css文件，可能是img文件
        loaders: this.loaders,
    }, (err, result) => {
        const source = result[0];
        const sourceMap = result.length >= 1 ? result[1] : null;
        const extraInfo = result.length >= 2 ? result[2] : null;
        // ...
    })
}
```

doBuild中使用了runLoaders方法使用合适的loader去加载resource，将源码转换为js

6. 解析依赖

执行完doBuild后，调用parser.parse

```
result = this.parser.parse(this._ast || this._source.source(), {
    current: this,
    module: this,
    compilation: compilation,
    options: options
});
```
而这里的this.parser其实就是JavascriptParser的实例对象，最终JavascriptParser会调用第三方包acorn提供的parse方法对JS源代码进行语法解析

```
const { Parser: AcornParser } = require("acorn");
const parser = AcornParser;
static _parse(code, options) {
    ast = (parser.parse(code, parserOptions));
}
```

> webpack会记录下通过import {is} from 'object-is'或const xxx = require('XXX')引入的模块，记录在module.dependencies数组中






### 3. 模块生成

build完成后，会进入到compilation.seal()阶段，在这里会先封闭模块，生成资源

createHash方法会根据传入的hash进行不同的hash处理

- JS：chunkhash
- CSS：contenthash
- IMG：hash

在createModuleAssets build阶段解析好的模块保存在compilation.assets中

```
emitAsset(file, source, assetInfo = {}) {
    if (this.assets[file]) {
        if (!isSourceEqual(this.assets[file], source)) {
            this.errors.push(
                new WebpackError(
                    `Conflict: Multiple assets emit different content to the same filename ${file}`
                )
            );
            this.assets[file] = source;
            this._setAssetInfo(file, assetInfo);
            return;
        }
        const oldInfo = this.assetsInfo.get(file);
        const newInfo = Object.assign({}, oldInfo, assetInfo);
        this._setAssetInfo(file, newInfo, oldInfo);
        return;
    }
    this.assets[file] = source;
    this._setAssetInfo(file, assetInfo, undefined);
}

createModuleAssets() {
    const { chunkGraph } = this;
    for (const module of this.modules) {
        if (module.buildInfo.assets) {
            const assetsInfo = module.buildInfo.assetsInfo;
            for (const assetName of Object.keys(module.buildInfo.assets)) {
                const fileName = this.getPath(assetName, {
                    chunkGraph: this.chunkGraph,
                    module
                });
                for (const chunk of chunkGraph.getModuleChunksIterable(module)) {
                    chunk.auxiliaryFiles.add(fileName);
                }
                this.emitAsset(
                    fileName,
                    module.buildInfo.assets[assetName],
                    assetsInfo ? assetsInfo.get(assetName) : undefined
                );
                this.hooks.moduleAsset.call(module, fileName);
            }
        }
    }
}
```


### 4. 文件输出

在compiler.compile方法执行完后，会执行到onCompiled回调中的emitAssets方法最终调用emit钩子通过options中配置的output.path将文件输出到指定的文件夹

```
this.hooks.emit.callAsync(compilation, err => {
    if (err) return callback(err);
    outputPath = compilation.getPath(this.outputPath, {});
    mkdirp(this.outputFileSystem, outputPath, emitFiles);
});
```