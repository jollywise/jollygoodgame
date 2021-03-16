'use strict';

const path = require('path');
const { cosmiconfigSync } = require('cosmiconfig');

const cosmiconfig = cosmiconfigSync('webpackBuild').search();
const config = cosmiconfig ? cosmiconfig.config || {} : {};

const DEVSERVER_HOST = 'localhost';
const DEVSERVER_PORT = 3000;
const BROWSERSYNC_PORT = 4000;

function buildConfig(target, buildtype, minimize) {
  const constantsPath = path.resolve(__dirname, `webpack_config/constants/${target}/`);
  const paths = require(`${constantsPath}/paths`);
  const project = require(`${constantsPath}/project`);

  project.title = config.title || 'JollyGoodGame';
  project.statsCounterName = config.statsCounterName || '';
  project.gameId = config.gameId || 'test-game';
  project.devserverHost = config.devServer
    ? config.devServer.host || DEVSERVER_HOST
    : DEVSERVER_HOST;
  project.devserverPort = config.devServer
    ? config.devServer.port || DEVSERVER_PORT
    : DEVSERVER_PORT;
  project.browserSyncPort = config.devServer
    ? config.devServer.browserSyncPort || BROWSERSYNC_PORT
    : BROWSERSYNC_PORT;
  project.devserverURL = `http://${project.devserverHost}:${project.devserverPort}`;
  project.devServer = `webpack-dev-server/client?${project.devserverURL}`;

  const environmentVars = {
    __DEBUG__: JSON.stringify(project.environmentVars.debug),
    __DEBUG_BOUNDS__: JSON.stringify(project.environmentVars.debugBounds),
    __WATCH__: JSON.stringify(project.environmentVars.watch),
    __SHORTCUTS_ENABLED__: JSON.stringify(project.environmentVars.shortcuts),
    __VERSION__: JSON.stringify(process.env.npm_package_version),
  };

  console.log('[WEBPACK] Building', target, buildtype, ' | minimize = ', minimize);

  const configPath = path.resolve(__dirname, `webpack_config/${buildtype}.js`);
  const result = require(configPath)({
    paths,
    project,
    environmentVars,
    minimize,
  });
  return result;
}

module.exports = function ({ target = '', buildtype = '', minimize = 'true' }) {
  return buildConfig(target, buildtype, minimize === 'true');
};
