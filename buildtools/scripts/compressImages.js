/**
 * https://github.com/imagemin/imagemin-optipng
 *
 * Ideally we have the src in assets_src and compress from there into dev/assets :)
 */
const imagemin = require('imagemin');
const imageminOptipng = require('imagemin-optipng');
const imageminPngquant = require('imagemin-pngquant');

const fs = require('fs');
const path = require('path');
const md5File = require('md5-file');
const { cosmiconfigSync } = require('cosmiconfig');
const { readManifest, writeManifest, getManifestID, getRelativeName } = require('./jgg-libs');

const cosmiconfig = cosmiconfigSync('compressImages').search();
const config = cosmiconfig ? cosmiconfig.config || {} : {};

const ROOT_DIRECTORY = config.rootDirectory || path.resolve('.');
const SRC_DIRECTORY = config.rootDirectory || path.resolve(ROOT_DIRECTORY, 'src/assets/');
const OUTPUT_DIRECTORY = config.outputDirectory || path.resolve(ROOT_DIRECTORY, 'src/assets/');
const MANIFEST_FILE =
  config.manifestFile || path.resolve(ROOT_DIRECTORY, 'assets_src/compressImages_manifest.json');
const DRYRUN = false;

// prettier-ignore
const getWorkPlan = ({ srcDir = SRC_DIRECTORY, outDir = OUTPUT_DIRECTORY, manifestRead, manifestWrite }) => {
  const dirContents = { files: [], dirs: [] };
  let plan = [];

  fs.readdirSync(srcDir).reduce((ary, item) => {
    if (!/^\..*/.test(item)) {
      if (fs.lstatSync(path.join(srcDir, item)).isDirectory()) {
        dirContents.dirs.push(item);
      } else if (path.extname(item) === '.png') {
        const file = path.join(srcDir, item);
        const hash = md5File.sync(file);
        const imageId = getManifestID(file, SRC_DIRECTORY);

        const manifestHash = manifestRead[imageId] || false;
        if (manifestHash !== hash) {
          plan.push({
            id    : item,
            srcDir: srcDir,
            outDir: outDir,
            imageId: imageId,
          });  
        } else {
          manifestWrite[imageId] = hash;
          console.log(`Skipping ${getRelativeName(file, SRC_DIRECTORY)}`);
        }
      }
    }
    return ary;
  }, []);

  dirContents.dirs.forEach((subDir) => {
    plan = plan.concat(
      getWorkPlan({
        srcDir: path.join(srcDir, subDir),
        outDir: path.join(outDir, subDir),
        manifestRead,
        manifestWrite,
      })
    );
  });
  return plan;
};

async function compressImage(id, srcDir, outDir, imageId, manifestWrite) {
  const src = path.join(srcDir, id);
  const dest = path.join(outDir, id);
  const optimizationLevel = 7;

  const stats = fs.statSync(src);
  const filesize = stats['size'];

  if (!DRYRUN) {
    await imagemin([src], {
      destination: path.dirname(dest),
      glob: false,
      plugins: [
        imageminPngquant({
          speed: 1,
          quality: [0.8, 1],
          strip: true,
          dithering: 0,
        }),
        imageminOptipng({
          optimizationLevel,
          bitDepthReduction: true,
        }),
      ],
    });
    const statsAfter = fs.statSync(dest);
    const filesizeAfter = statsAfter['size'];

    console.log(
      `Compressed ${getRelativeName(src, SRC_DIRECTORY)} : ${filesize} -> ${filesizeAfter}`
    );
  } else {
    console.log(`Compressing ${getRelativeName(src, SRC_DIRECTORY)} : ${filesize}`);
  }
  manifestWrite[imageId] = md5File.sync(dest);
}

const manifestRead = readManifest(MANIFEST_FILE);
const manifestWrite = {};
(async () => {
  const workPlan = getWorkPlan({ manifestRead, manifestWrite });
  for (let i = 0; i < workPlan.length; i++) {
    const data = workPlan[i];
    await compressImage(data.id, data.srcDir, data.outDir, data.imageId, manifestWrite);
  }
  writeManifest(MANIFEST_FILE, manifestWrite);
})();
