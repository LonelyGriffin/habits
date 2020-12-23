const path = require('path')
const commonConfig = require('./webpack.common.config')
const {merge} = require('webpack-merge')
// const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = merge(commonConfig, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{from: 'public'}]
    })

    // new BundleAnalyzerPlugin({
    //   openAnalyzer: true
    // }),
  ]
})
