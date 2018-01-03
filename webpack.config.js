const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: {
    tinylex: './tinylex.ts',
    'tinylex.min': './tinylex.ts'
  },
  output: {
    filename: './[name].js',
    path: path.resolve(__dirname, './dist'),
    libraryTarget: 'umd'
  },
  module: {
    rules: [{
      test: /.ts$/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: ['env']
        }
      }, {
        loader: 'ts-loader'
      }]
    }]
  },
  devtool: 'sourcemap',
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      test: /\.min\.js$/
    })
  ]
}