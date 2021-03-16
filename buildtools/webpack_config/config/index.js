const server = require('./webpack.devserver');
const optimise = require('./webpack.optimise');
const rules = require('./webpack.rules');
const plugins = require('./webpack.plugins');
const main = require('./webpack.main');

module.exports = {
  server,
  optimise,
  rules,
  plugins,
  main,
};
