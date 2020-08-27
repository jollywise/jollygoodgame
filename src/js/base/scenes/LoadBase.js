import WebFont from 'webfontloader';
import { KEYS } from 'base/constants/SceneConstants';

export class LoadBase extends Phaser.Scene {
  constructor({ key = KEYS.Load, active = false, debug = false }) {
    super({ key, active });
    console.log('LoadBase | key', key, '| active', active, '| debug', debug);
    this.debug = debug;
    this.fontsReady = false;
    this.assetsReady = false;
  }

  init() {
    this.handleLoadProgress = this.loadProgress.bind(this);
    this.handleFileLoadProgress = this.loadFileProgress.bind(this);
    this.handleFileLoadComplete = this.loadFileComplete.bind(this);
    this.handleLoadError = this.loadError.bind(this);
    this.handleLoadComplete = this.loadComplete.bind(this);

    this.events.on('shutdown', this.shutdown, this);
  }

  renderScene() {}

  preload({ fonts }) {
    this.renderScene();
    const loadFonts = fonts.reduce(
      (obj, font) => {
        for (const i in font) {
          if (i === 'CSS') {
            obj.urls.push(
              ...font[i].map((css) => {
                return this.game.appUrls.getFontsDirectory(css);
              })
            );
          } else {
            obj.families.push(font[i]);
          }
        }

        return obj;
      },
      { families: [], urls: [] }
    );

    WebFont.load({
      custom: loadFonts,
      active: this.fontsLoaded.bind(this),
      inactive: this.fontsLoaded.bind(this),
    });

    this.load.crossOrigin = 'anonymous';
    this.load.on('progress', this.handleLoadProgress);
    this.load.on('fileprogress', this.handleFileLoadProgress);
    this.load.on('filecomplete', this.handleFileLoadComplete);
    this.load.on('loaderror', this.handleLoadError);
    this.load.on('complete', this.handleLoadComplete);
  }

  loadProgress(value) {
    if (this.loadBar) {
      this.loadBar.setProgress(value);
    }
  }

  loadFileProgress(file) {
    this.debug && console.log('LoadBase.loadFileProgress | type ' + file.type + ' | key ' + file.key);
  }

  loadFileComplete(key, type) {
    this.debug && console.log('LoadBase.loadFileComplete | type ' + type + ' | key ' + key);
  }

  loadError(file) {
    this.debug && file &&
      console.error(
        'LoadBase.loadError | type ' + file.type + ' | key ' + file.key + ' | src ' + file.src
      );
  }

  loadComplete() {
    this.debug && console.log('LoadBase.loadComplete');
    this.load.off('progress', this.handleLoadProgress);
    this.load.off('fileprogress', this.handleFileLoadProgress);
    this.load.off('filecomplete', this.handleFileLoadComplete);
    this.load.off('loaderror', this.handleLoadError);
    this.load.off('complete', this.handleLoadComplete);
    this.assetsReady = true;
  }

  fontsLoaded() {
    this.fontsReady = true;
  }

  create(opts) {
    this.scene.stop(KEYS.Load);
  }

  update(time, delta) {}

  shutdown() {
    this.events.off('shutdown', this.shutdown, this);
    if (this.loadBar) {
      this.loadBar.destroy(true);
      this.loadBar = null;
    }
    this.scene.stop(KEYS.Load);
  }
}
