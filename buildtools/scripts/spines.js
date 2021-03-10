/**
 * Spine
 *
 * Generate spine_manifest.json to handle incremental updates of assets_src spine
 * You can add, delete or change an audio file in a spine folder to force the regeneration
 */

const fs = require('fs');
const path = require('path');
const md5File = require('md5-file');
const { execSync } = require('child_process');

const ROOT_DIRECTORY = path.resolve(__dirname, '../..');
const SRC_DIRECTORY = path.resolve(ROOT_DIRECTORY, 'assets_src/spines/');
const OUTPUT_DIRECTORY = path.resolve(ROOT_DIRECTORY, 'src/assets/');
const MANIFEST_FILE = path.resolve(ROOT_DIRECTORY, 'assets_src/spine_manifest.json');
const EXPORT_CONFIG_PATH = path.resolve(__dirname, './spinexportconfig.json'); // temporary file
const DRYRUN = false;

const excludefolders = ['cutscenes'];

let SPINE = 'C:\\Program Files (x86)\\Spine\\Spine.exe';
if (!fs.existsSync(SPINE)) {
  SPINE = 'C:\\Program Files\\Spine\\Spine.exe';
}
if (SPINE.indexOf(' ') > -1 && SPINE.indexOf('"') === -1 && SPINE.indexOf("'") === -1) {
  SPINE = '"' + SPINE + '"';
}
const EXPORT_JSON = {
  class: 'export-json',
  name: 'JSON',
  project: '',
  output: '.',
  open: false,
  extension: '.json',
  format: 'JSON',
  prettyPrint: false,
  nonessential: false,
  cleanUp: true,
  packAtlas: null,
  packSource: 'attachments',
  packTarget: 'perskeleton',
  warnings: true,
};
const EXPORT = {
  class: 'export-json',
  name: 'JSON',
  project: '',
  output: '.',
  open: false,
  extension: '.json',
  format: 'JSON',
  prettyPrint: false,
  nonessential: false,
  cleanUp: true,
  packAtlas: {
    stripWhitespaceX: true,
    stripWhitespaceY: true,
    rotation: true,
    alias: true,
    ignoreBlankImages: false,
    alphaThreshold: 3,
    minWidth: 16,
    minHeight: 16,
    maxWidth: 2048,
    maxHeight: 2048,
    pot: false,
    multipleOfFour: true,
    square: false,
    outputFormat: 'png',
    jpegQuality: 0.9,
    premultiplyAlpha: false,
    bleed: true,
    scale: [1],
    scaleSuffix: [''],
    scaleResampling: ['bicubic'],
    paddingX: 2,
    paddingY: 2,
    edgePadding: true,
    duplicatePadding: true,
    filterMin: 'Linear',
    filterMag: 'Linear',
    wrapX: 'ClampToEdge',
    wrapY: 'ClampToEdge',
    format: 'RGBA8888',
    atlasExtension: '.atlas',
    combineSubdirectories: false,
    flattenPaths: false,
    useIndexes: false,
    debug: false,
    fast: false,
    limitMemory: false,
    currentProject: true,
    packing: 'rectangles',
    silent: false,
    ignore: false,
    bleedIterations: 2,
  },
  packSource: 'attachments',
  packTarget: 'perskeleton',
  warnings: true,
};

const getContents = (dir) => {
  let results = [];
  if (isExcluded(dir)) {
    console.log('excluding ' + dir);
    return [];
  }
  fs.readdirSync(dir).forEach(function (item) {
    if (!/^\..*/.test(item)) {
      const file = path.join(dir, item);
      const stat = fs.lstatSync(file);
      if (stat && stat.isDirectory()) {
        results = results.concat(getContents(file));
      } else if (path.extname(file) === '.spine') {
        results.push(file);
      }
    }
  });
  return results;
};

const isExcluded = (dir) => {
  const found = excludefolders.find((e) => {
    const excludePath = path.resolve(SRC_DIRECTORY, e);
    if (excludePath === dir) return true;
    const relative = path.relative(path.resolve(SRC_DIRECTORY, e), dir);
    return relative && !relative.startsWith('..') && !path.isAbsolute(relative);
  });
  return found != null;
};

// prettier-ignore
const getWorkPlan = ({ srcDir = SRC_DIRECTORY, outDir = OUTPUT_DIRECTORY, manifestRead, manifestWrite }) => {
  const plan = [];
  getContents(srcDir).forEach((file) => {
    const hash = md5File.sync(file);
    const spineId = file.split(SRC_DIRECTORY)[1].replace('/', '').replace(/\//g, '_');
    const manifestHash = manifestRead[spineId] || null;
    manifestWrite[spineId] = hash;
    if (hash !== manifestHash) {
      const output = path.dirname(path.dirname(file.replace(srcDir, outDir)));
      plan.push({ input: file, outputBase: output });
    } else {
      const relativeFile = file.split(SRC_DIRECTORY)[1].substr(1);
      console.log(`Skipping ${relativeFile}`);
    }
  });
  return plan;
};

const createSpine = (input, destination) => {
  const relativeFile = input.split(SRC_DIRECTORY)[1].substr(1);
  console.log(`Processing spine ${relativeFile}`);
  if (!DRYRUN) {
    if (!fs.existsSync(destination)) {
      require('mkdirp').sync(destination);
    }

    if (!DRYRUN) {
      const settings = { ...EXPORT_JSON };
      settings.project = input;
      settings.output = destination;
      try {
        fs.writeFileSync(EXPORT_CONFIG_PATH, JSON.stringify(settings));
        execSync(SPINE + ' -e ' + EXPORT_CONFIG_PATH, { stdio: 'inherit' });
      } catch (err) {
        console.log(err);
      }
    }

    let scale = 0;
    const outfile = path.join(destination, path.basename(input).replace('.spine', '.json'));
    if (fs.existsSync(outfile)) {
      try {
        const exportedData = JSON.parse(fs.readFileSync(outfile));
        if (exportedData && exportedData.bones) {
          for (let i = 0; i < exportedData.bones.length; i++) {
            const bone = exportedData.bones[i];
            if (bone.parent === 'root' && (bone.scaleX || 1) !== 1) {
              scale = Math.max(scale, bone.scaleX || 0, bone.scaleY || 0);
              console.log(`Found scale ${scale} in bone ${bone.name}`);
            }
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
    if (scale === 0) {
      scale = 1;
    }

    if (!DRYRUN) {
      const settings = { ...EXPORT };
      settings.project = input;
      settings.output = destination;
      settings.packAtlas.scale = [scale];
      try {
        fs.writeFileSync(EXPORT_CONFIG_PATH, JSON.stringify(settings));
        execSync(SPINE + ' -e ' + EXPORT_CONFIG_PATH, { stdio: 'inherit' });
      } catch (err) {
        console.log(err);
      }
    }
  }
};

const readManifest = () => {
  let manifest = {};
  try {
    const rawData = fs.readFileSync(MANIFEST_FILE);
    manifest = JSON.parse(rawData);
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log('Creating manifest');
    } else {
      throw err;
    }
  }
  return manifest;
};

const writeManifest = (manifest) => {
  try {
    const rawData = JSON.stringify(manifest);
    fs.writeFileSync(MANIFEST_FILE, rawData);
  } catch (err) {
    throw err;
  }
};

const manifestRead = readManifest();
const manifestWrite = {};
console.log('Using spine executable path', SPINE);
getWorkPlan({ manifestRead, manifestWrite }).forEach((data) => {
  createSpine(data.input, data.outputBase);
});
try {
  fs.unlinkSync(EXPORT_CONFIG_PATH);
} catch (err) {}
writeManifest(manifestWrite);
