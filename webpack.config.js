const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    main: './src/index.js'
  },
  devtool:
    process.env.NODE_ENV === 'production'
      ? 'source-map'
      : 'cheap-eval-source-map',
  devServer: {
    host: '0.0.0.0',
    disableHostCheck: true,
    port: 8080
  },
  module: {
    rules: [
      {
        test: /\.js$|\.jsx$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                'env',
                {
                  modules: false,
                  targets: {
                    browsers: '> 1%'
                  },
                  useBuiltIns: true
                }
              ],
              'react'
            ],
            plugins: [
              'transform-object-rest-spread',
              ['transform-class-properties', { spec: true }]
            ]
          }
        }
      },
      {
        test: /\.scss$|\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'style.[chunkhash].css',
      disable: process.env.NODE_ENV !== 'production'
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      minify:
        process.env.NODE_ENV === 'production'
          ? {
              minifyCSS: true,
              collapseWhitespace: true,
              removeComments: true
            }
          : false
    }),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'runtime'
    })
  ],
  output: {
    filename:
      process.env.NODE_ENV === 'production'
        ? '[name].[chunkhash].js'
        : '[name].js',
    publicPath: '/',
    path: path.resolve(__dirname, 'dist')
  }
};
