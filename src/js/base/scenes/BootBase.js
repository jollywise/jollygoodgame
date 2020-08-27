import WebFont from 'webfontloader';
import { KEYS } from 'base/constants/SceneConstants';

export class BootBase extends Phaser.Scene {
  constructor({ key = KEYS.Boot, active = true, debug = false }) {
    super({ key, active });
    console.log('BootBase | key', key, '| active', active, '| debug', debug);
    this.debug = debug;
    this.fontsReady = false;
  }

  init() {
    this.handleLoadStart = this.loadStart.bind(this);
    this.handleLoadProgress = this.loadProgress.bind(this);
    this.handleFileLoadProgress = this.loadFileProgress.bind(this);
    this.handleLoadError = this.loadError.bind(this);
    this.handleLoadComplete = this.loadComplete.bind(this);
    this.errorCount = 0;
    this.loadHasErrored = false;
  }

  preload({ fonts }) {
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
    this.load.on('start', this.handleLoadStart);
    this.load.on('progress', this.handleLoadProgress);
    this.load.on('fileprogress', this.handleFileLoadProgress);
    this.load.on('loaderror', this.handleLoadError);
    this.load.on('complete', this.handleLoadComplete);
    // override and add implementation
  }

  loadStart() {
    this.debug && console.log('BootBase.loadStart');
  }

  loadProgress(value) {
    this.debug && console.log('BootBase.loadProgress', value);
  }

  loadFileProgress(file) {
    this.debug && console.log('BootBase.loadFileProgress | type ' + file.type + ' | key ' + file.key);
  }

  loadError(pack) {
    this.loadHasErrored = true;
    this.errorCount++;
    if (pack) {
      let errorMessage = `Boot.loadError | type ${pack.type} | key ${pack.key} | src ${pack.src}`;
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

  loadComplete() {
    this.debug && console.log('BootBase.loadComplete');
    this.load.off('start', this.handleLoadStart);
    this.load.off('progress', this.handleLoadProgress);
    this.load.off('fileprogress', this.handleFileLoadProgress);
    this.load.off('loaderror', this.handleLoadError);
    this.load.off('complete', this.handleLoadComplete);
    this.assetsReady = true;
    this.scene.start(KEYS.Load, { booted: true });
  }

  fontsLoaded() {
    this.fontsReady = true;
  }

  create() {}

  update(time, delta) {}

  shutdown() {
    this.scene.stop(KEYS.Boot);
    this.scene.remove(KEYS.Boot);
  }
}
