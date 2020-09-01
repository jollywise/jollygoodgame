import Phaser from 'phaser';

const LOADED_ASSETS = { multiatlas: [], spine: [] };

export class SceneLoadBase extends Phaser.Scene {
  constructor(opts) {
    super(opts);
    this.debug = opts.debug || false;
  }

  init() {
    this.handleLoadStart = this.loadStart.bind(this);
    this.handleLoadProgress = this.loadProgress.bind(this);
    this.handleFileLoadProgress = this.loadFileProgress.bind(this);
    this.handleFileLoadComplete = this.loadFileComplete.bind(this);
    this.handleLoadError = this.loadError.bind(this);
    this.handleLoadAssetPackComplete = this.loadAssetPackComplete.bind(this);
    this.handleLoadComplete = this.loadComplete.bind(this);
    this.errorCount = 0;
    this.loadHasErrored = false;
  }

  renderScene() {}

  preload(path) {
    this.flushLoadedAssets();
    this.renderScene();

    this.load.crossOrigin = 'anonymous';
    this.load.path = path;
    this.load.on('start', this.handleLoadStart);
    this.load.on('progress', this.handleLoadProgress);
    this.load.on('fileprogress', this.handleFileLoadProgress);
    this.load.on('filecomplete', this.handleFileLoadComplete);
    this.load.on('loaderror', this.handleLoadError);
    this.load.on('complete', this.handleLoadAssetPackComplete);
  }

  loadStart() {
    this.debug && console.log('Load.handleLoadStart');
  }

  loadProgress(value) {
    this.debug && console.log('Load.loadProgress', value);
  }

  loadFileProgress(file) {
    this.debug && console.log('Load.loadFileProgress | type ' + file.type + ' | key ' + file.key);
  }

  loadFileComplete(key, type) {
    this.debug && console.log('Load.loadFileComplete | type ' + type + ' | key ' + key);
  }

  loadError(pack) {
    this.loadHasErrored = true;
    this.errorCount++;
    if (pack) {
      let errorMessage = `SceneLoad.loadError | type ${pack.type} | key ${pack.key} | src ${pack.src}`;
      errorMessage +=
        '\n-- status : ' +
        pack.xhrLoader.status +
        ' | -- statusText : ' +
        pack.xhrLoader.statusText;
      console.error(errorMessage + ' | -- response :\n' + pack.xhrLoader.response);
      this.add.text(30, this.errorCount * 60, errorMessage, {
        fontFamily: 'Arial',
        color: '#00ff00',
        fontSize: '21px',
      });
    }
  }

  loadAssetPackComplete() {
    this.debug && console.log('Load.loadAssetPackComplete');
  }

  create() {
    this.load.off('complete', this.handleLoadAssetPackComplete);
    this.load.on('complete', this.handleLoadComplete);
    this.load.start();
  }

  loadComplete() {
    this.load.off('progress', this.handleLoadProgress);
    this.load.off('fileprogress', this.handleFileLoadProgress);
    this.load.off('filecomplete', this.handleFileLoadComplete);
    this.load.off('loaderror', this.handleLoadError);
    this.load.off('complete', this.handleLoadComplete);

    this.start();
  }

  start() {} // override

  registerLoadedAsset(type, key) {
    if (!LOADED_ASSETS[type]) {
      LOADED_ASSETS[type] = [];
    }
    LOADED_ASSETS[type].push(key);
  }

  flushLoadedAssets() {
    LOADED_ASSETS.multiatlas.forEach((atlas) => {
      this.debug && console.log('flush multiatlas : ' + atlas);
      if (this.textures.exists(atlas)) {
        this.debug && console.log('\tflush texture');
        this.textures.remove(atlas);
      }
      if (this.cache.json.exists(atlas)) {
        this.debug && console.log('\tflush json');
        this.cache.json.remove(atlas);
      }
    });
    LOADED_ASSETS.multiatlas = [];

    LOADED_ASSETS.spine.forEach((spine) => {
      if (this.textures.exists(spine + '.png')) {
        this.textures.remove(spine + '.png');
      }
      if (this.cache.json.exists(spine)) {
        this.cache.json.remove(spine);
      }
      if (this.cache.custom.spine.exists(spine)) {
        this.cache.custom.spine.remove(spine);
      }
      if (this.cache.custom.spineTextures.exists(spine)) {
        this.cache.custom.spineTextures.remove(spine);
      }
    });

    if (LOADED_ASSETS.audiosprite) {
      LOADED_ASSETS.audiosprite.forEach((audiosprite) => {
        this.debug && console.log('REMOVE AUDIO : ' + audiosprite);
        if (this.cache.audio.exists(audiosprite)) {
          this.debug && console.log('\tREMOVED AUDIO : ' + audiosprite);
          this.game.sound.removeByKey(audiosprite);
          this.cache.audio.remove(audiosprite);
          this.cache.json.remove(audiosprite);
        }
      });
      LOADED_ASSETS.audiosprite = [];
    }

    LOADED_ASSETS.spine = [];
  }

  shutdown() {}
}
