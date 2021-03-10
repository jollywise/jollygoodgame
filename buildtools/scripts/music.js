/**
 * Music
 *
 * Generate music_manifest.json to handle incremental updates of assets_src music
 * You can add, delete or change an audio file in a music folder to force the regeneration
 */

const fs = require('fs');
const path = require('path');
const md5File = require('md5-file');

const EXPORT_FILETYPES = 'ogg,m4a,mp3';
const ROOT_DIRECTORY = path.resolve('.');
const SRC_DIRECTORY = path.resolve(ROOT_DIRECTORY, 'assets_src/music/');
const OUTPUT_DIRECTORY = path.resolve(ROOT_DIRECTORY, 'src/assets/');
const MANIFEST_FILE = path.resolve(ROOT_DIRECTORY, 'assets_src/music_manifest.json');
const DRYRUN = false;

const getContents = (dir) => {
  let results = [];
  fs.readdirSync(dir).forEach(function (item) {
    if (!/^\..*/.test(item)) {
      const file = path.join(dir, item);
      const stat = fs.lstatSync(file);
      if (stat && stat.isDirectory()) {
        results = results.concat(getContents(file));
      } else {
        results.push(file);
      }
    }
  });
  return results;
};

// prettier-ignore
const getWorkPlan = ({ srcDir = SRC_DIRECTORY, outDir = OUTPUT_DIRECTORY, manifestRead, manifestWrite }) => {
  const plan = [];
  getContents(srcDir).forEach((file) => {
    const hash = md5File.sync(file);
    const musicId = file.split(SRC_DIRECTORY)[1].replace('/', '').replace(/\//g, '_');
    const manifestHash = manifestRead[musicId] || null;
    manifestWrite[musicId] = hash;
    if (hash !== manifestHash) {
      const output = file.replace(srcDir, outDir).replace(/\.[^/.]+$/, "");
      plan.push({ input: file, outputBase: output });
    }
  });
  return plan;
};

const createMusic = (input, outputBase) => {
  console.log(`Creating music ${outputBase} from ${input}`);
  if (!DRYRUN) {
    EXPORT_FILETYPES.split(',').forEach((filetype) => {
      const outfile = outputBase + '.' + filetype;
      if (!fs.existsSync(path.dirname(outfile))) {
        require('mkdirp').sync(path.dirname(outfile));
      }
      require('child_process')
        .spawn('ffmpeg', ['-y', '-i', input, '-ar', 44100, '-ac', 1, outfile])
        .on('exit', function (code, signal) {
          if (code) {
            console.warn(`Couldn\'t create ${outfile}`, code, signal);
          }
        });
    });
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
getWorkPlan({ manifestRead, manifestWrite }).forEach((data) => {
  createMusic(data.input, data.outputBase);
});
writeManifest(manifestWrite);
