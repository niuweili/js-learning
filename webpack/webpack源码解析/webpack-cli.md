## webpack-cli

1. 分析命令行参数，对各个参数进行转换，组件编译的配置项

2. 引用webpack，对配置荐进行编译和构建

### 1.运行run方法

```
const runCLI = async (args) => {
  // Create a new instance of the CLI object
  const cli = new WebpackCLI();

  try {
    await cli.run(args);
  } catch (error) {
    cli.logger.error(error);
    process.exit(2);
  }
};
```

### 2. 分析不需要构建的命令
```
// Built-in external commands
const externalBuiltInCommandsInfo = [
    {
        name: "serve [entries...]",
        alias: ["server", "s"],
        pkg: "@webpack-cli/serve",
    },
    {
        name: "info",
        alias: "i",
        pkg: "@webpack-cli/info",
    },
    {
        name: "init",
        alias: ["create", "new", "c", "n"],
        pkg: "@webpack-cli/generators",
    },
    {
        name: "loader",
        alias: "l",
        pkg: "@webpack-cli/generators",
    },
    {
        name: "plugin",
        alias: "p",
        pkg: "@webpack-cli/generators",
    },
    {
        name: "migrate",
        alias: "m",
        pkg: "@webpack-cli/migrate",
    },
    {
        name: "configtest [config-path]",
        alias: "t",
        pkg: "@webpack-cli/configtest",
    },
];
```

当使用webpack-cli运行以上命令时，会判断是否安装了pkg的包，如果安装了就执行对应的命令，如果没有安装会引导进行安装

* server：运行webpack-serve
* info：返回本地环境相关的一些信息
* init：创建一份webpack文件
* loader：生成webpack-loader代码
* plugin：生成webpack-plugin代码
* migrate：进行webpack版本迁移
* configtest：配置测试，验证webpack配置


### 3.通过loadCommandByName方法调用对应的命令行
如果是build或watch命令，会通过loadWebpack方法去import webpack然后再通过runWebpack方法去获取到compiler对象
```
 if (isBuildCommandUsed || isWatchCommandUsed) {
    await this.makeCommand(
        isBuildCommandUsed ? buildCommandOptions : watchCommandOptions,
        async () => {
        this.webpack = await this.loadWebpack();

        return isWatchCommandUsed
            ? this.getBuiltInOptions().filter((option) => option.name !== "watch")
            : this.getBuiltInOptions();
        },
        async (entries, options) => {
        if (entries.length > 0) {
            options.entry = [...entries, ...(options.entry || [])];
        }

        await this.runWebpack(options, isWatchCommandUsed);
        },
    );
    } else if (isCommand(commandName, helpCommandOptions)) {
    // Stub for the `help` command
    this.makeCommand(helpCommandOptions, [], () => {});
    } else if (isCommand(commandName, versionCommandOptions)) {
    // Stub for the `version` command
    this.makeCommand(versionCommandOptions, [], () => {});
    }
}
```

### 4. createCompiler方法创建compiler

createCompiler方法使用loadConfig和buildConfig方法去处理通过命令行设置的配置项，传入到webpack并执行，获取到compiler对象

```
async createCompiler(options, callback) {
    if (typeof options.nodeEnv === "string") {
        process.env.NODE_ENV = options.nodeEnv;
    }

    let config = await this.loadConfig(options);
    config = await this.buildConfig(config, options);

    let compiler;

    try {
        compiler = this.webpack(
        config.options,
        callback
            ? (error, stats) => {
                if (error && this.isValidationError(error)) {
                this.logger.error(error.message);
                process.exit(2);
                }

                callback(error, stats);
            }
            : callback,
        );
    } catch (error) {
        if (this.isValidationError(error)) {
        this.logger.error(error.message);
        } else {
        this.logger.error(error);
        }

        process.exit(2);
    }

    // TODO webpack@4 return Watching and MultiWatching instead Compiler and MultiCompiler, remove this after drop webpack@4
    if (compiler && compiler.compiler) {
        compiler = compiler.compiler;
    }

    return compiler;
}
```


总结：
1. 通过对输入的命令进行判断，查看是否需要执行webpack
2. 对输入的options进行处理生成最终配置选项参数
3. 引入webpack后通过调用webpack去执行构建，如果需要watch则会在watch后有一些状态输出