/* eslint-disable spaced-comment */
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');

/****************************************
 *         P  L  U  G  I  N  S
 ***************************************/
exports.generateDevSourceMaps = ({ exclude }) => ({
  plugins: [
    new webpack.EvalSourceMapDevToolPlugin({
      exclude,
      columns: true,
      test: /\.css?|\.jsx?|\.js?$/,
      filename: 'sourcemaps/[file].map',
    }),
  ],
});

exports.generateDistSourceMaps = ({ exclude }) => ({
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      exclude,
      columns: true,
      test: /\.css?|\.jsx?|\.js?$/,
      filename: 'sourcemaps/[file].map',
    }),
  ],
});

exports.define = ({ env = 'development', opts }) => ({
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env),
      // 'process.env': {
      //   NODE_ENV: JSON.stringify(env),
      // },
      ...opts,
    }),
  ],
});

exports.setLoaderOptions = ({ minimise = true, options }) => ({
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: minimise,
      options: options,
    }),
  ],
});

exports.cleanDirectory = ({ cleanOptions }) => ({
  plugins: [new CleanWebpackPlugin(cleanOptions)],
});

/**
 * https://webpack.js.org/plugins/module-concatenation-plugin/
 */
exports.enableScopeHoisting = () => ({
  plugins: [new webpack.optimize.ModuleConcatenationPlugin()],
});

exports.copy = ({ copyPatterns, copyOptions = {} }) => ({
  plugins: [new CopyWebpackPlugin({ patterns: copyPatterns, options: copyOptions })],
});

exports.setExtraPlugins = (pluginsArray) => ({
  plugins: pluginsArray,
});

exports.runWebpackBundleAnalyzer = () => ({
  plugins: [new BundleAnalyzerPlugin()],
});

// https://webpack.js.org/guides/caching/
// https://webpack.js.org/plugins/hashed-module-ids-plugin/
// USE FOR PRODUCTION
exports.hashModuleIDs = () => ({
  plugins: [
    new webpack.HashedModuleIdsPlugin({
      hashFunction: 'md5',
      hashDigest: 'base64',
      hashDigestLength: 4,
    }),
  ],
});

exports.writeHTMLtoDisk = ({ outputPath }) => ({
  plugins: [
    new HtmlWebpackHarddiskPlugin({
      outputPath: outputPath,
    }),
  ],
});

exports.generateHTML = ({
  title,
  template,
  filename = 'index.html',
  writeHTMLToDisk = false,
  opts,
}) => ({
  plugins: [
    new HTMLWebpackPlugin({
      title,
      template,
      filename,
      inject: false,
      alwaysWriteToDisk: writeHTMLToDisk,
      minify: {
        collapseWhitespace: true,
        preserveLineBreaks: true,
      },
      ...opts,
    }),
  ],
});

exports.inlineManifest = (name) => ({
  plugins: [new InlineManifestWebpackPlugin(name)],
});
