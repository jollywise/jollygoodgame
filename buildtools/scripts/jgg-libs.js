/**
 * Libs for the build scripts
 */

const fs = require('fs');
const path = require('path');

Object.defineProperty(exports, '__esModule', {
  value: true,
});

const isExcluded = (dir, base, exclude) => {
  const found = exclude.find((e) => {
    const excludePath = path.resolve(base, e);
    if (excludePath === dir) return true;
    const relative = path.relative(path.resolve(base, e), dir);
    return relative && !relative.startsWith('..') && !path.isAbsolute(relative);
  });
  return found != null;
};

const getRelativeName = (exports.getRelativeName = (filePath, base) => {
  return filePath.split(base)[1].substr(1);
});

exports.getManifestID = (filePath, base) => {
  return getRelativeName(filePath, base).replace(/[\\]/g, '/');
};

const getContents = (exports.getContents = (dir, base, exclude = []) => {
  let results = [];
  if (isExcluded(dir, base, exclude)) {
    console.log(`Excluding ${getRelativeName(dir, base)}`);
    return [];
  }
  fs.readdirSync(dir).forEach(function (item) {
    if (!/^\..*/.test(item)) {
      const file = path.join(dir, item);
      const stat = fs.lstatSync(file);
      if (stat && stat.isDirectory()) {
        results = results.concat(getContents(file, base, exclude));
      } else {
        results.push(file);
      }
    }
  });
  return results;
});

exports.readManifest = (manifestFile) => {
  let manifest = {};
  try {
    manifest = JSON.parse(fs.readFileSync(manifestFile));
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err;
    }
  }
  return manifest;
};

exports.writeManifest = (manifestFile, manifest) => {
  try {
    fs.writeFileSync(manifestFile, JSON.stringify(manifest));
  } catch (err) {
    throw err;
  }
};
