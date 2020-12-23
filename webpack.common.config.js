const path = require('path')
const CompressionPlugin = require('compression-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const {InjectManifest} = require('workbox-webpack-plugin')

module.exports = {
  entry: {
    main: ['./src/index.tsx']
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js'
  },
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        loader: 'ts-loader',
        include: path.resolve(__dirname, 'src'),
        options: {
          transpileOnly: true,
          allowTsInNodeModules: true,
          compilerOptions: {
            target: 'es5'
          }
        }
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader'
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: true,
              modules: {
                namedExport: true
              }
            }
          },
          {
            loader: 'css-loader',
            options: {
              esModule: true,
              importLoaders: 2,
              modules: {
                exportLocalsConvention: 'camelCaseOnly',
                namedExport: true,
                localIdentName: '[path]__[local]',
                auto: true
              }
            }
          },
          'postcss-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true
              }
            }
          }
        ]
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[ext]'
        }
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        loader: 'file-loader',
        options: {
          name: 'images/[name].[ext]'
        }
      },
      {
        test: /\.(mp3)$/i,
        loader: 'file-loader',
        options: {
          name: 'sounds/[name].[ext]'
        }
      },
      {
        test: /\.yaml$/,
        use: ['json-loader', 'yaml-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js', '.tsx', '.json', '.yaml']
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$|\.svg$|\.mp3$/,
      threshold: 1024,
      minRatio: 0.4
    }),
    // new WebpackManifestPlugin(),
    new HtmlWebpackPlugin({
      template: 'public/index.html'
    }),
    new InjectManifest({
      swSrc: './src/sw.ts',
      swDest: 'service-worker.js'
    })
  ],
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 200000,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            // get the name. E.g. node_modules/packageName/not/this/part.js
            // or node_modules/packageName
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]

            // npm package names are URL-safe, but some servers don't like @ symbols
            return `npm.${packageName.replace('@', '')}`
          }
        }
      }
    }
  }
}
