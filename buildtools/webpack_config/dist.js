const webpack = require('webpack');
const merge = require('webpack-merge');
const { main, optimise, rules, plugins } = require('./config/index');

module.exports = ({ paths, project, environmentVars, minimize }) => {
  const PATHS = paths;
  const PROJECT = project;
  const PUBLIC_PATH = '';
  const copyPatterns = [{ from: PATHS.src + '/assets/', to: PATHS.dist + '/assets/' }];

  const copyOptions = { concurrency: 100 };
  const cleanOptions = { verbose: false, exclude: ['language'] };

  const generateHTML = PROJECT.generateHTML;
  const sourceMap = PROJECT.generateSourcemaps;
  const dropConsole = PROJECT.dropConsole;
  const isHashed = PROJECT.isHashed;
  const isVendorChunked = PROJECT.isVendorChunked;

  return merge([
    main.setProductionMode(),
    main.setEntries({ main: [PATHS.entryFile] }),
    main.setOutput({
      jsOut: PATHS.jsOut,
      pathToDirectory: PATHS.dist,
      publicPath: PUBLIC_PATH,
      isHashed,
    }),
    main.resolveDependencies({ aliases: {}, src: PATHS.src + '/js' }),
    main.setPerformance(),
    main.setStatsPreset({ type: 'minimal' }), // minimal, none, normal, verbose ::: https://webpack.js.org/configuration/stats/

    plugins.enableScopeHoisting(),

    isVendorChunked && optimise.createVendorChunk(PROJECT.vendorName),
    isVendorChunked && optimise.createInlineManifestChunk(PROJECT.manifestName), // must come after createVendorChunk

    rules.loadStaticImageAssets({
      name: '[path][name].[ext]',
      context: PATHS.src,
      publicPath: '../',
    }),
    rules.loadStaticFontAssets({
      name: '[path][name].[ext]',
      context: PATHS.src,
      publicPath: '../',
    }),

    rules.eslintPre(),
    rules.transpileJavaScript(),
    optimise.minifyJS({ minimize, sourceMap, dropConsole }),

    rules.extractCss({ cssOut: PATHS.cssOut, isHashed }),
    rules.compileSCSS({ extract: true, sourceMap }),
    minimize && optimise.minifyCSS({ sourceMap }),

    plugins.cleanDirectory({ cleanOptions }),
    plugins.copy({ copyPatterns, copyOptions }),

    plugins.hashModuleIDs(),

    plugins.define({ env: 'production', opts: environmentVars }),

    generateHTML &&
      plugins.generateHTML({
        title: PROJECT.title,
        template: PATHS.templateDir + '/index.ejs',
        filename: PATHS.htmlOutName,
        opts: {
          statsCounterName: PROJECT.statsCounterName,
          containerId: PROJECT.containerId,
          gameId: PROJECT.gameId,
        },
      }),
    sourceMap &&
      plugins.generateDistSourceMaps({
        exclude: new RegExp(PROJECT.vendorName + '|' + PROJECT.manifestName),
      }),
    isVendorChunked && generateHTML && plugins.inlineManifest(PROJECT.manifestName),
    // plugins.runWebpackBundleAnalyzer(),
  ]);
};
