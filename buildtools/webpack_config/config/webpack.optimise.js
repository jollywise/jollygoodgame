/* eslint-disable spaced-comment */

const TerserPlugin = require('terser-webpack-plugin');

const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const safeParser = require('postcss-safe-parser');
/************************************************
 *         O P T I M I S A T I O N
 *
 *         todo : sort this bit out : no inlining
 ************************************************/
exports.createInlineManifestChunk = (name) => ({
  optimization: {
    runtimeChunk: {
      name,
    },
  },
});

/**
 * https://webpack.js.org/configuration/optimization/#optimizationnamedmodules
 */
exports.nameModuleIDs = (val) => ({
  optimization: {
    namedModules: val,
  },
});

exports.createVendorChunk = (name) => ({
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name,
          test: /[\\/]node_modules[\\/]|[\\/]src[\\/]js[\\/]plugins[\\/]/,
          chunks: 'all',
          enforce: true,
        },
        styles: {
          name,
          test: /\.css$/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
});

exports.minifyCSS = ({ sourceMap = true }) => ({
  optimization: {
    minimizer: [
      new OptimizeCSSAssetsPlugin({
        cssProcessor: require('cssnano'),
        cssProcessorPluginOptions: {
          preset: ['default', { discardComments: { removeAll: true } }],
        },
        // cssProcessorOptions: {
        //   map: sourceMap ? { inline: false, annotation: true } : false,
        //   parser: safeParser,
        //   discardComments: { removeAll: true },
        // },
        canPrint: true,
      }),
    ],
  },
});

exports.minifyJS = ({ minimize = true, sourceMap = true, dropConsole = false }) => ({
  optimization: {
    minimize,
    minimizer: [
      new TerserPlugin({
        cache: false,
        parallel: true, // parallel: 4,
        sourceMap,
        extractComments: false, // /^\**!|@preserve|@license|@cc_on/i, // true
        terserOptions: {
          ecma: 5,
          warnings: false,
          parse: {},
          compress: {
            drop_console: dropConsole,
          },
          mangle: true, // Note `mangle.properties` is `false` by default.
          module: false,
          output: null,
          toplevel: false,
          nameCache: null,
          ie8: false,
          keep_classnames: undefined,
          keep_fnames: false,
          safari10: false,
        },
      }),
    ],
  },
});
