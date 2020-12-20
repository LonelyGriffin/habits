const path = require('path')
const commonConfig = require('./webpack.common.config')
const {merge} = require('webpack-merge')

module.exports = merge(commonConfig, {
  devtool: 'eval-source-map',
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    disableHostCheck: true,
    historyApiFallback: true,
    hot: true,
    contentBase: path.join(__dirname, 'public')
  }
})
