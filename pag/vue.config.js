const { defineConfig } = require('@vue/cli-service')
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require('webpack')
const path = require('path')

module.exports = defineConfig({
  transpileDependencies: true,
  // devServer: {
  //   devMiddleware: {
  //     writeToDisk: (filePath) => {
  //       console.log('filePath', filePath)
  //       return /libpag\.wasm$/.test(filePath);
  //     },
  //   },
  // },
  configureWebpack: {
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, './node_modules/libpag/lib/libpag.wasm'),
            to: './js',
          },
        ]
      }),
    ]
    // plugins: [
    //   new HtmlWebpackExternalsPlugin({
    //     externals: [
    //       {
    //         module: 'libpag',
    //         entry: 'https://cdn.jsdelivr.net/npm/libpag@latest/lib/libpag.esm.js',
    //       },
    //     ],
    //   }),
    // ]
  }
})
