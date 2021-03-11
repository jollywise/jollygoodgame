#!/usr/bin/env node
'use strict';

/**
 * Build scripts
 */
const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;

if (process.argv.length === 0) {
  return;
}
const script = process.env[0].replace('/', '').replace('\\', '');
if (!fs.existsSync(path.resolve(__dirname, script + '.js'))) {
  console.log('Unknown build script ' + script);
  return;
}

exec('node ' + path.resolve(__dirname, script + '.js'), function (error, stdout, stderr) {
  console.log('stdout: ' + stdout);
  console.log('stderr: ' + stderr);
  if (error !== null) {
    console.log('exec error: ' + error);
  }
});
