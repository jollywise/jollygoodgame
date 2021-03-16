const webpack = require('webpack');
const merge = require('webpack-merge');
const { server, main, optimise, rules, plugins } = require('./config/index');

module.exports = ({ paths, project, environmentVars, minimize }) => {
  const PATHS = paths;
  const PROJECT = project;
  const PUBLIC_PATH = PROJECT.devserverURL + '/';
  const generateHTML = true;
  const sourceMap = false;
  const dropConsole = false;
  const writeHTMLToDisk = false;

  return merge([
    server.setDevServer({
      open: true,
      host: PROJECT.devserverHost,
      contentBase: PATHS.contentBase,
      port: PROJECT.devserverPort,
    }),
    main.setDevMode(),
    main.setEntries({
      main: [PROJECT.devServer, PATHS.entryFile],
    }),
    main.setOutput({
      jsOut: PATHS.jsOut,
      pathToDirectory: '/',
      publicPath: PUBLIC_PATH,
      isHashed: false,
    }),
    main.resolveDependencies({ aliases: {}, src: PATHS.src + '/js' }),
    main.setPerformance(),
    main.setStats({}),

    optimise.createVendorChunk(PROJECT.vendorName),
    optimise.nameModuleIDs(true),

    rules.loadStaticImageAssets({ name: PATHS.images, publicPath: PUBLIC_PATH }),
    rules.loadStaticFontAssets({ name: PATHS.fonts, publicPath: PUBLIC_PATH }),

    rules.eslintPre(),
    rules.transpileJavaScript(),
    optimise.minifyJS({ minimize, sourceMap, dropConsole }),

    rules.compileSCSS({ extract: false, sourceMap }),

    plugins.define({ env: 'development', opts: environmentVars }),
    generateHTML &&
      plugins.generateHTML({
        title: PROJECT.title,
        template: PATHS.templateDir + '/index.ejs',
        filename: 'index.html',
        writeHTMLToDisk,
        opts: {
          statsCounterName: PROJECT.statsCounterName,
          containerId: PROJECT.containerId,
          gameId: PROJECT.gameId,
        },
      }),
    writeHTMLToDisk && plugins.writeHTMLtoDisk({ outputPath: PATHS.htmlOutPath }),
    sourceMap &&
      plugins.generateDevSourceMaps({
        exclude: new RegExp(PROJECT.vendorName + '|' + PROJECT.manifestName),
      }),

    plugins.setExtraPlugins([new webpack.HotModuleReplacementPlugin()]),
  ]);
};
