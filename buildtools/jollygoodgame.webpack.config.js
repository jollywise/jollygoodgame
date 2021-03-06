const webpack = require('webpack');
const path = require('path');

const root = path.resolve(__dirname, '../');
const src = path.join(root, 'src');
const dist = path.join(root, 'dist');

const MODE = process.env.NODE_ENV; // development, production
console.log('building ' + MODE + ' release');
const DEBUG = true;

module.exports = {
  entry: './src/index.js',
  mode: MODE,
  resolve: {
    alias: {},
    modules: [src + '/js', 'libs', 'node_modules'],
    extensions: ['.js', '.jsx', '.json', '.css', '.scss'],
  },
  output: {
    path: dist,
    filename: 'jollygoodgame.js',
    library: 'jollygoodgame',
    libraryTarget: 'umd',
  },
  stats: 'normal', // minimal, none, normal, verbose ::: https://webpack.js.org/configuration/stats/
  externals: {
    phaser: { commonjs: 'Phaser', commonjs2: 'Phaser', amd: 'Phaser', root: 'Phaser' },
    webfontloader: {
      commonjs: 'webfontloader',
      commonjs2: 'webfontloader',
      amd: 'webfontloader',
      root: 'webfontloader',
    },
  },
  devtool: process.env.NODE_ENV === 'development' ? 'none' : 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(MODE),
      __DEBUG__: JSON.stringify(DEBUG),
    }),
  ],
};
