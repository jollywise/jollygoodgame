/* eslint-disable spaced-comment */
/****************************************
 *         D  E  V  T  O  O  L
 ***************************************/
exports.generateSourceMaps = (type) => ({
  devtool: type,
});

/****************************************
 *         E  N  T  R  Y
 ***************************************/
exports.setEntries = (entries) => ({
  entry: { ...entries },
});

/****************************************
 *         M O D E
 ***************************************/
exports.setDevMode = () => ({
  mode: 'development',
});

exports.setProductionMode = () => ({
  mode: 'production',
});

/****************************************
 *         O  U  T  P  U  T
 ***************************************/
exports.setOutput = ({ jsOut = 'js/', pathToDirectory, publicPath, isHashed = false }) => {
  // remove [chunkhash] with webpack-dev-server - https://github.com/webpack/webpack/issues/2393
  const filename = isHashed ? jsOut + '[name].[chunkhash:8].js' : jsOut + '[name].js';
  const chunkFilename = isHashed ? jsOut + '[name].[chunkhash:8].js' : jsOut + '[name].js';
  return {
    output: {
      path: pathToDirectory,
      publicPath: publicPath,
      filename,
      chunkFilename,
    },
  };
};

/****************************************
 *         R  E  S  O  L  V  E
 ***************************************/
exports.resolveDependencies = ({ aliases, src }) => ({
  resolve: {
    alias: aliases,
    modules: [src, 'libs', 'node_modules'],
    extensions: ['.js', '.jsx', '.json', '.css', '.scss'],
  },
});

/****************************************
 *         T  A  R  G  E  T
 ***************************************/
exports.targetNode = () => ({
  target: 'node',
  node: {
    __filename: false,
    __dirname: false,
  },
});

/****************************************
 *         V E N D O R
 ***************************************/
exports.addVendorShortcut = ({ name, alias }) => ({
  resolve: {
    alias: alias,
  },
  module: {
    noParse: [new RegExp('^' + name + '$')],
  },
});

/****************************************
 *         P E R F O R M A N C E
 ***************************************/
exports.setPerformance = () => ({
  performance: {
    maxAssetSize: 100000,
    maxEntrypointSize: 300000,
    // hints: 'warning'
    hints: false,
  },
});

/****************************************
 *        S T A T S
 ***************************************/
exports.setStatsPreset = ({ type }) => ({
  stats: type,
});

exports.setStats = ({
  errors = true,
  errorDetails = true,
  modules = true,
  reasons = true,
  warnings = false,
  colors = true,
}) => ({
  stats: {
    errors,
    errorDetails,
    modules,
    reasons,
    warnings,
    colors,
  },
});
