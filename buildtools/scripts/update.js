/**
 * Update package.json
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIRECTORY = path.resolve('.');
const PACKAGE_JSON = path.resolve(ROOT_DIRECTORY, 'package.json');
const NODE_MODULES = path.resolve(ROOT_DIRECTORY, 'node_modules/@jollywise');
const PACKAGE_FRAGMENT = path.resolve(ROOT_DIRECTORY, 'package-fragment.json');

const readPackage = (file) => {
  if (!fs.existsSync(file)) {
    return {};
  }
  try {
    return JSON.parse(fs.readFileSync(file));
  } catch (err) {
    console.log('Error reading ' + file, err);
  }
};

const writePackage = (file, data) => {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, '\t'));
  } catch (err) {
    console.log('Error writing ' + file, err);
  }
};

const getJGGModules = () => {
  if (!fs.existsSync(NODE_MODULES)) {
    return [];
  }
  const modules = [];
  fs.readdirSync(NODE_MODULES).forEach((item) => {
    if (!/^\..*/.test(item)) {
      if (fs.lstatSync(path.join(NODE_MODULES, item)).isDirectory()) {
        modules.push(item);
      }
    }
  });
  return modules;
};

const mergePackageData = (current, merge) => {
  Object.keys(merge).forEach((key) => {
    if (!current[key]) {
      current[key] = merge[key];
    } else if (typeof merge[key] === 'string') {
      current[key] = merge[key];
    } else {
      Object.keys(merge[key]).forEach((key2) => {
        current[key][key2] = merge[key][key2];
      });
    }
  });
};

if (fs.existsSync(PACKAGE_FRAGMENT)) {
  const current = {
    '_jgg:generated': 'This package.json is generated. Please modify package-fragment.json instead',
  };
  getJGGModules().forEach((el) => {
    const fragment = path.join(NODE_MODULES, `${el}/buildtools/package-fragment.json`);
    if (fs.existsSync(fragment)) {
      mergePackageData(current, readPackage(fragment));
    }
  });
  mergePackageData(current, readPackage(PACKAGE_FRAGMENT));
  delete current.scripts['jgg:init'];
  writePackage(PACKAGE_JSON, current);

  console.log('Rebuilt package.json');
} else {
  console.log('No package-fragment.json file found - cannot continue');
}
