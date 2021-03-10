/**
 * Zip's the dist folder for Jenkins
 */
var path = require('path');
var execSync = require('child_process').execSync;

var WORKING_DIRECTORY = path.resolve(__dirname, '../');
var MAX_SIZE = 1024 * 1024 * 500; // 500 MB
var TARGET = (process.argv[2] || 'dist');
var FILENAME = (process.argv[3] || 'deploy.zip');
var ZIP_CONTENTS = TARGET+'/*.* '+TARGET+'/**/*';
var ZIP_COMMAND = 'zip -r ' + FILENAME + ' ' + ZIP_CONTENTS;
console.info('ZIP ' + TARGET + ' to ' + WORKING_DIRECTORY + '/' + FILENAME);
execSync(ZIP_COMMAND, { cwd: WORKING_DIRECTORY, maxBuffer: MAX_SIZE }, function(
  error,
  stdout,
  stderr
) {
  if (error) {
    throw error;
  }
  console.info('ZIP created');
});
