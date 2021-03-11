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
const { cosmiconfigSync } = require('cosmiconfig');
const {
  getContents,
  readManifest,
  writeManifest,
  getManifestID,
  getRelativeName,
} = require('./jgg-libs');

const cosmiconfig = cosmiconfigSync('spines').search();
const config = cosmiconfig ? cosmiconfig.config || {} : {};

const ROOT_DIRECTORY = config.rootDirectory || path.resolve('.');
const SRC_DIRECTORY = config.srcDirectory || path.resolve(ROOT_DIRECTORY, 'assets_src/spines/');
const OUTPUT_DIRECTORY = config.outputDirectory || path.resolve(ROOT_DIRECTORY, 'src/assets/');
const MANIFEST_FILE =
  config.manifestFile || path.resolve(ROOT_DIRECTORY, 'assets_src/spines_manifest.json');
const TEMP_CONFIG_PATH = path.resolve(__dirname, './spinexportconfig.json'); // temporary file
const EXCLUDE_FOLDERS = config.excludeFolders || [];
const DRYRUN = false;

let SPINE = config.spine || '';
if (!SPINE || SPINE === '' || !fs.existsSync(SPINE)) {
  SPINE = 'C:\\Program Files (x86)\\Spine\\Spine.exe';
}
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

// prettier-ignore
const getWorkPlan = ({ srcDir = SRC_DIRECTORY, outDir = OUTPUT_DIRECTORY, manifestRead, manifestWrite }) => {
  const plan = [];
  getContents(srcDir, SRC_DIRECTORY, EXCLUDE_FOLDERS).forEach((file) => {
    if (path.extname(file) === '.spine') {
      const hash = md5File.sync(file);
      const spineId = getManifestID(file, SRC_DIRECTORY);
      const manifestHash = manifestRead[spineId] || null;
      manifestWrite[spineId] = hash;
      if (hash !== manifestHash) {
        const output = path.dirname(path.dirname(file.replace(srcDir, outDir)));
        plan.push({ input: file, outputBase: output });
      } else {
        console.log(`Skipping ${getRelativeName(file, SRC_DIRECTORY)}`);
      }
    }
  });
  return plan;
};

// eslint-disable-next-line max-statements
const createSpine = (input, destination) => {
  console.log(`Processing spine ${getRelativeName(input, SRC_DIRECTORY)}`);
  if (!DRYRUN) {
    if (!fs.existsSync(destination)) {
      require('mkdirp').sync(destination);
    }

    let settings = { ...EXPORT_JSON };
    settings.project = input;
    settings.output = destination;
    try {
      fs.writeFileSync(TEMP_CONFIG_PATH, JSON.stringify(settings));
      execSync(SPINE + ' -e ' + TEMP_CONFIG_PATH, { stdio: 'inherit' });
    } catch (err) {
      console.log(`Error creating ${TEMP_CONFIG_PATH}`, err);
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
        console.log(`Error parsing ${outfile}`, err);
      }
    }
    if (scale === 0) {
      scale = 1;
    }

    settings = { ...EXPORT };
    settings.project = input;
    settings.output = destination;
    settings.packAtlas.scale = [scale];
    try {
      fs.writeFileSync(TEMP_CONFIG_PATH, JSON.stringify(settings));
      execSync(SPINE + ' -e ' + TEMP_CONFIG_PATH, { stdio: 'inherit' });
    } catch (err) {
      console.log(`Error creating ${TEMP_CONFIG_PATH}`, err);
    }
  }
};

const manifestRead = readManifest(MANIFEST_FILE);
const manifestWrite = {};
getWorkPlan({ manifestRead, manifestWrite }).forEach((data) => {
  createSpine(data.input, data.outputBase);
});
try {
  fs.unlinkSync(TEMP_CONFIG_PATH);
} catch (err) {}
writeManifest(MANIFEST_FILE, manifestWrite);
