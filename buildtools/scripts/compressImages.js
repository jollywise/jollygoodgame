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

const ROOT_DIRECTORY = path.resolve('.');
const SRC_DIRECTORY = path.resolve(ROOT_DIRECTORY, 'src/assets/');
const OUTPUT_DIRECTORY = path.resolve(ROOT_DIRECTORY, 'src/assets/');
const MANIFEST_FILE = path.resolve(ROOT_DIRECTORY, 'src_assets/compressImages_manifest.json');
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
        const relativeFile = file.split(SRC_DIRECTORY)[1].substr(1);
        const imageId = relativeFile.replace(/[\\\/]/g, '_');

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
          console.log(`Skipping ${relativeFile}`);
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
  const relativeFile = src.split(SRC_DIRECTORY)[1].substr(1);

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
    manifestWrite[imageId] = md5File.sync(dest);

    console.log(`Compressed ${relativeFile} : ${filesize} -> ${filesizeAfter}`);
  } else {
    console.log(`Compressing ${relativeFile} : ${filesize}`);
  }
}

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
  if (!DRYRUN) {
    try {
      const rawData = JSON.stringify(manifest);
      fs.writeFileSync(MANIFEST_FILE, rawData);
    } catch (err) {
      throw err;
    }
  }
};

const manifestRead = readManifest();
const manifestWrite = {};
(async () => {
  const workPlan = getWorkPlan({ manifestRead, manifestWrite });
  for (let i = 0; i < workPlan.length; i++) {
    const data = workPlan[i];
    await compressImage(data.id, data.srcDir, data.outDir, data.imageId, manifestWrite);
  }
  writeManifest(manifestWrite);
})();
