var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'public');
var WIZ_DIR = path.resolve(__dirname, 'src/client/wizard');
var PROC_DIR = path.resolve(__dirname, 'src/client/process');
var ORD_DIR = path.resolve(__dirname, 'src/client/orders');
var CLUB_DIR = path.resolve(__dirname, 'src/client/club');
var APP_DIR = path.resolve(__dirname, 'src/client/app');
var CAFE_DIR = path.resolve(__dirname, 'src/client/cafe');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var CompressionPlugin = require('compression-webpack-plugin');
var BrotliPlugin = require('brotli-webpack-plugin');

var config = {
  entry: {
    guide: WIZ_DIR + '/guide.jsx',
    process: PROC_DIR + '/process.jsx',
    orders: ORD_DIR + '/orders.jsx',
    club: CLUB_DIR + '/club.jsx',
    cafe: CAFE_DIR + '/cafe.jsx',
    app: APP_DIR + '/app.jsx',
  },
  output: {
    path: BUILD_DIR,
    filename: '[name].bundle.min.js',
    chunkFilename: "[id].chunk.js"
  },
  node: {
    fs: 'empty',
    target: 'empty'
  },
  module : {
    rules : [
      {
        test : /\.jsx?/,
        include : [WIZ_DIR, PROC_DIR, ORD_DIR, CLUB_DIR, CAFE_DIR, APP_DIR],
        exclude: [/node_modules/],
        loader : 'babel',
        query:
        {
          presets: ['es2015','react']
        }
      },
      { test: /\.css$/, loader: "style-loader!css-loader" }
    ]
  },
  watch: true,
  resolveLoader: {
    moduleExtensions: ['-loader']
  },
  plugins: [
    new UglifyJSPlugin({
      minimize: true,
      compress: true
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new CompressionPlugin({
     filename: '[path].gz[query]',
     algorithm: 'gzip',
     test: /\.js$|\.css$|\.html$/,
     threshold: 10240,
     minRatio: 0.8
     }),
     new BrotliPlugin({
     asset: '[path].br[query]',
     test: /\.js$|\.css$|\.html$/,
     threshold: 10240,
     minRatio: 0.8
     })
  ]
};

module.exports = config;