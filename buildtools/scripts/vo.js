/**
 * VO
 *
 * Generate voiceovers from AWS Polly according to assets_src/vo.csv
 */

const fs = require('fs');
const path = require('path');
const md5 = require('md5');
const csv = require('csv-parser');
const AWS = require('aws-sdk');
const { cosmiconfigSync } = require('cosmiconfig');
const { readManifest, writeManifest, getRelativeName } = require('./jgg-libs');

const cosmiconfig = cosmiconfigSync('vo').search();
const config = cosmiconfig ? cosmiconfig.config || {} : {};

const ROOT_DIRECTORY = config.rootDirectory || path.resolve('.');
const SRC_FILE = config.srcFile || path.resolve(ROOT_DIRECTORY, 'assets_src/vo.csv');
const OUTPUT_DIRECTORY =
  config.outputDirectory || path.resolve(ROOT_DIRECTORY, 'assets_src/audiosprites/audiosprites');
const CAPTIONS_FILE =
  config.captionsFile || path.resolve(ROOT_DIRECTORY, 'src/assets/data/captions.json');
const MANIFEST_FILE =
  config.manifestFile || path.resolve(ROOT_DIRECTORY, 'assets_src/vo_manifest.json');
const POLLY_VOICE = config.pollyVoice || 'Justin';
const DRYRUN = false;

const Polly = new AWS.Polly({ region: 'eu-west-1' });

// prettier-ignore
const getWorkPlan = ({ srcFile = SRC_FILE, outDir = OUTPUT_DIRECTORY, manifestRead, manifestWrite }) => {
  return new Promise(function(resolve) {
    const plan = [];
    const captions = {};
    const keys = [];
    fs.createReadStream(srcFile)
      .pipe(csv({ skipLines: 1, headers: false }))
      .on('data', (row) => {
        const id = row[0].trim();
        const text = row[1].trim();
        const area = row[2].trim();

        if (keys.indexOf(id) > -1) {
          console.log(`Text ID ${id} repeated, ignoring`);
          return;
        }

        keys.push(id);
        captions[id] = text;

        const outputFile = path.join(outDir, area, id + '.mp3');
        const hash = md5(text);
        const manifestHash = manifestRead[id] || null;
        manifestWrite[id] = hash;
        if (hash !== manifestHash) {
          plan.push({ text: text, outputFile: outputFile });
        } else {
          console.log(`Skipping ${id}`);
        }
      }).on('end', () => {
        resolve({plan, captions});
      });
  });
};

const createVO = (text, outputFile, attempt = 1) => {
  if (attempt === 1) {
    console.log(`Creating ${getRelativeName(outputFile, OUTPUT_DIRECTORY)}`);
  }
  if (!DRYRUN) {
    if (!fs.existsSync(path.dirname(outputFile))) {
      require('mkdirp').sync(path.dirname(outputFile));
    }

    const speechParams = {
      Engine: 'neural',
      OutputFormat: 'mp3',
      Text: text,
      TextType: 'text',
      VoiceId: POLLY_VOICE,
    };

    Polly.synthesizeSpeech(speechParams, function (err, res) {
      if (err) {
        if (err.code === 'ThrottlingException') {
          setTimeout(function () {
            createVO(text, outputFile, attempt + 1);
          }, 500);
        } else {
          console.log('Error synthesizing speech', err);
        }
      } else if (res && res.AudioStream instanceof Buffer) {
        fs.writeFileSync(outputFile, res.AudioStream);
      }
    });
  }
};

if (fs.existsSync(SRC_FILE)) {
  const manifestRead = readManifest(MANIFEST_FILE);
  const manifestWrite = {};
  getWorkPlan({ manifestRead, manifestWrite }).then(({ plan, captions }) => {
    if (plan.length > 0) {
      plan.forEach((data) => {
        createVO(data.text, data.outputFile);
      });
    }
    fs.writeFileSync(CAPTIONS_FILE, JSON.stringify(captions));
    writeManifest(MANIFEST_FILE, manifestWrite);
  });
}
