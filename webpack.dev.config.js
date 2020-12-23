const path = require('path')
const commonConfig = require('./webpack.common.config')
const {merge} = require('webpack-merge')
// const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')
const webpack = require('webpack')
module.exports = merge(commonConfig, {
  devtool: 'eval-source-map',
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    disableHostCheck: true,
    historyApiFallback: true,
    hot: true,
    contentBase: path.join(__dirname, 'public')
  },
  cache: {
    type: 'memory'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
    // new BundleAnalyzerPlugin({
    //   openAnalyzer: true
    // }),
  ]
})
