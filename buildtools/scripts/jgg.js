#!/usr/bin/env node
'use strict';

/**
 * Build scripts
 */
const fs = require('fs');
const path = require('path');

if (process.argv.length < 3) {
  return;
}
const script = process.argv[2].replace('/', '').replace('\\', '');
if (!fs.existsSync(path.resolve(__dirname, script + '.js'))) {
  console.log('Unknown jgg command ' + script);
  return;
}

require('./' + script + '.js');
