/**
 * Music
 *
 * Generate music_manifest.json to handle incremental updates of assets_src music
 * You can add, delete or change an audio file in a music folder to force the regeneration
 */

const fs = require('fs');
const path = require('path');
const md5File = require('md5-file');
const { cosmiconfigSync } = require('cosmiconfig');
const {
  getContents,
  readManifest,
  writeManifest,
  getManifestID,
  getRelativeName,
} = require('./jgg-libs');

const cosmiconfig = cosmiconfigSync('music').search();
const config = cosmiconfig ? cosmiconfig.config || {} : {};

const EXPORT_FILETYPES = 'ogg,m4a,mp3';
const ROOT_DIRECTORY = config.rootDirectory || path.resolve('.');
const SRC_DIRECTORY = config.srcDirectory || path.resolve(ROOT_DIRECTORY, 'assets_src/music/');
const OUTPUT_DIRECTORY = config.outputDirectory || path.resolve(ROOT_DIRECTORY, 'src/assets/');
const MANIFEST_FILE =
  config.manifestFile || path.resolve(ROOT_DIRECTORY, 'assets_src/music_manifest.json');
const DRYRUN = false;

// prettier-ignore
const getWorkPlan = ({ srcDir = SRC_DIRECTORY, outDir = OUTPUT_DIRECTORY, manifestRead, manifestWrite }) => {
  const plan = [];
  getContents(srcDir, SRC_DIRECTORY).forEach((file) => {
    const hash = md5File.sync(file);
    const musicId = getManifestID(file, SRC_DIRECTORY);
    
    const manifestHash = manifestRead[musicId] || null;
    manifestWrite[musicId] = hash;
    if (hash !== manifestHash) {
      const output = file.replace(srcDir, outDir).replace(/\.[^/.]+$/, "");
      plan.push({ input: file, outputBase: output });
    } else {
      console.log(`Skipping ${getRelativeName(file, SRC_DIRECTORY)}`);
    }
  });
  return plan;
};

const createMusic = (input, outputBase) => {
  console.log(`Creating music ${getRelativeName(outputBase, OUTPUT_DIRECTORY)}`);
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
            console.warn(`Error creating ${outfile}`, code, signal);
          }
        });
    });
  }
};

const manifestRead = readManifest(MANIFEST_FILE);
const manifestWrite = {};
getWorkPlan({ manifestRead, manifestWrite }).forEach((data) => {
  createMusic(data.input, data.outputBase);
});
writeManifest(MANIFEST_FILE, manifestWrite);
