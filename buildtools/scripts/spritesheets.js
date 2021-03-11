/**
 * texturepacker target
 * Github repo : https://github.com/strewhella/node-texturepacker-command-line
 * Texture Settings : https://www.codeandweb.com/texturepacker/documentation/texture-settings
 */

const fs = require('fs');
const path = require('path');
const texturepacker = require('./texturepacker-command-line');
const { cosmiconfigSync } = require('cosmiconfig');
const { getRelativeName } = require('./jgg-libs');

const cosmiconfig = cosmiconfigSync('spritesheets').search();
const config = cosmiconfig ? cosmiconfig.config || {} : {};

const FORMAT = 'phaser'; // PHASER 3 FORMAT
const MAXSIZE = 2048;

const ROOT_DIRECTORY = config.rootDirectory || path.resolve('.');
const SRC_DIRECTORY =
  config.srcDirectory || path.resolve(ROOT_DIRECTORY, 'assets_src/spritesheets/');
const OUTPUT_DIRECTORY = config.outputDirectory || path.resolve(ROOT_DIRECTORY, 'src/assets/');
const DRYRUN = false;

const getWorkPlan = (srcDir = SRC_DIRECTORY, outDir = OUTPUT_DIRECTORY) => {
  const dirContents = { files: [], dirs: [] };
  fs.readdirSync(srcDir).reduce((ary, item) => {
    if (!/^\..*/.test(item)) {
      if (fs.lstatSync(path.join(srcDir, item)).isDirectory()) {
        dirContents.dirs.push(item);
      } else {
        dirContents.files.push(item);
      }
    }
    return ary;
  }, []);

  let plan = [];
  dirContents.dirs.forEach((subDir) => {
    plan = plan.concat(getWorkPlan(path.join(srcDir, subDir), path.join(outDir, subDir)));
  });
  if (dirContents.files.length > 0) {
    plan.push({
      id: path.basename(srcDir),
      srcDir: srcDir,
      outDir: path.dirname(outDir),
    });
  }
  return plan;
};

const createSprite = (id, srcDir, outDir, scale = 1) => {
  const outBase = path.join(outDir, id);
  console.log(`Creating spritesheet ${getRelativeName(outBase, OUTPUT_DIRECTORY)}`);
  if (!DRYRUN) {
    texturepacker.exec(`${srcDir}/`, {
      sheet: `${outBase}-{n}.png`,
      data: `${outBase}{n}.json`,
      textureFormat: 'png',
      trimSpriteNames: true,
      format: FORMAT,
      maxSize: MAXSIZE,
      scale,
      scaleMode: 'Smooth',
      multipack: true,
    });
  }
};

getWorkPlan().forEach((data) => {
  createSprite(data.id, data.srcDir, data.outDir);
});
