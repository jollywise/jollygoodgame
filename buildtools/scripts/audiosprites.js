/**
 * Audiosprite target
 * Github repo : https://github.com/tonistiigi/audiosprite
 * terminal = audiosprite -e "ogg,m4a,mp3" -o audiosprite_story -b 64 ./story/*.mp3 ./story/*.wav
 *
 * Generate audiosprites_manifest.json to handle incremental updates of assets_src audiosprites
 * You can add, delete or change an audio file in a audiosprite folder to force the sprite regeneration
 * Delete audiosprites_manifest.json to start from scratch
 *
 * CAPTIONS_FILE : A file containing a lookup of wav filename -> caption text
 */

const fs = require('fs');
const path = require('path');
const md5 = require('md5');
const md5File = require('md5-file');
const audiosprite = require('audiosprite');
const { cosmiconfigSync } = require('cosmiconfig');

const cosmiconfig = cosmiconfigSync('audiosprites').search();
const config = cosmiconfig ? cosmiconfig.config || {} : {};
console.log('Loaded config', config);

const EXPORT_FILETYPES = config.exportFiletypes || 'ogg,m4a,mp3';
const EXPORT_FORMATS = config.exportFormats || [
  { bitrate: 32, samplerate: 22050 },
  { bitrate: 64, samplerate: 44100 },
];
const ROOT_DIRECTORY = config.rootDirectory || path.resolve('.');
const SRC_DIRECTORY =
  config.srcDirectory || path.resolve(ROOT_DIRECTORY, 'assets_src/audiosprites/');
const OUTPUT_DIRECTORY = config.outputDirectory || path.resolve(ROOT_DIRECTORY, 'src/assets/');
const MANIFEST_FILE =
  config.mainfestFile || path.resolve(ROOT_DIRECTORY, 'assets_src/audiosprites_manifest.json');
const CAPTIONS_FILE =
  config.captionsFile || path.resolve(ROOT_DIRECTORY, 'assets_src/captions.json');
const DRYRUN = false;
const FORCE = false;

// prettier-ignore
const getWorkPlan = ({ srcDir = SRC_DIRECTORY, outDir = OUTPUT_DIRECTORY, manifestRead, manifestWrite, subDir }) => {
  const dirContents = { files: [], dirs: [] };
  let manifestFiles = [];

  fs.readdirSync(srcDir).reduce((ary, item) => {
    if (!/^\..*/.test(item)) {
      if (fs.lstatSync(path.join(srcDir, item)).isDirectory()) {
        dirContents.dirs.push(item);
      } else {
        const file = `${srcDir}/${item}`;
        const hash = md5File.sync(file);
        const relativeFile = srcDir.split(SRC_DIRECTORY)[1].substr(1);
        const spriteId = relativeFile.replace(/[\\\/]/g, '_');

        manifestFiles = (manifestRead[spriteId] && manifestRead[spriteId].files) || [];

        if (!manifestWrite[spriteId]) {
          manifestWrite[spriteId] = {
            directory: subDir,
            files: [],
          };
        }
        manifestWrite[spriteId].files.push({ item, hash });
        dirContents.files.push({ item, hash });
      }
    }
    return ary;
  }, []);

  let plan = [];
  dirContents.dirs.forEach((subDir) => {
    plan = plan.concat(
      getWorkPlan({
        srcDir: path.join(srcDir, subDir),
        outDir: path.join(outDir, subDir),
        manifestRead,
        manifestWrite,
        subDir,
      })
    );
  });

  if (dirContents.files.length > 0) {
    const existingHash = md5(JSON.stringify(manifestFiles));
    const newHash =md5(JSON.stringify(dirContents.files))
    if (existingHash !== newHash || FORCE) {
      plan.push({
        id    : path.basename(srcDir),
        srcDir: srcDir,
        outDir: path.dirname(outDir),
      });
    } else {
      console.log(`Skipping ${path.basename(srcDir)}`);
    }
  }
  return plan;
};

const generateCaptions = (obj, captionData) => {
  const sprites = obj.spritemap;
  const result = {};
  let hasResults = false;
  for (const key in captionData) {
    if (captionData.hasOwnProperty(key)) {
      let length = 0;
      key.split('+').forEach((subkey) => {
        if (sprites.hasOwnProperty(subkey)) {
          const vo = sprites[subkey];
          length += (vo.end - vo.start) * 1000;
        }
      });

      if (length > 0) {
        const cpts = [];
        const phraseCount = captionData[key].length;

        const duration = Math.round(length) + 100;

        // calculate total letters
        let lettersTotal = 0;
        for (let i = 0; i < phraseCount; i++) {
          lettersTotal += captionData[key][i].length;
        }

        let start = 0;
        for (let i = 0; i < phraseCount; i++) {
          const content = captionData[key][i];
          const cpt = { content };
          cpt.start = start;
          const dt = Math.ceil(duration * (content.length / lettersTotal)); // set time based on the letter in content
          if (i === phraseCount - 1) {
            cpt.end = Math.round(length) + 100;
          } else {
            cpt.end = start + dt;
          }
          start += dt;
          cpts.push(cpt);
        }
        result[key] = cpts;
        hasResults = true;
      }
    }
  }
  return hasResults ? result : null;
};

const createSprite = (id, srcDir, outDir, captions) => {
  EXPORT_FORMATS.forEach((format) => {
    const bitrate = format.bitrate;
    const samplerate = format.samplerate;
    const output = `${outDir}/${bitrate}/${id}`;

    console.log(`Creating audiosprite ${output} from ${srcDir}`);
    if (!DRYRUN) {
      const files = [srcDir + '/*.mp3', srcDir + '/*.wav', srcDir + '/*.m4a'];
      const opts = {
        export: EXPORT_FILETYPES,
        output,
        bitrate,
        samplerate,
        path: './',
        gap: 0.5,
        silence: 1,
      };
      audiosprite(files, opts, (err, obj) => {
        if (err) {
          return console.error(err);
        } else {
          fs.writeFileSync(`${outDir}/${bitrate}/${id}.json`, JSON.stringify(obj, null, 2));
          if (captions) {
            const cap = generateCaptions(obj, captions);
            if (cap !== null) {
              fs.writeFileSync(`${outDir}/${id}_captions.json`, JSON.stringify(cap, null, 2));
            }
          }
        }
      });
    }
  });
};

const readCaptions = () => {
  let captions = {};
  try {
    const rawData = fs.readFileSync(CAPTIONS_FILE);
    captions = JSON.parse(rawData);
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log('No captions');
    } else {
      throw err;
    }
  }
  return captions;
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

const captions = readCaptions();
const manifestRead = readManifest();
const manifestWrite = {};
getWorkPlan({ manifestRead, manifestWrite }).forEach((data) => {
  createSprite(data.id, data.srcDir, data.outDir, captions);
});
writeManifest(manifestWrite);
