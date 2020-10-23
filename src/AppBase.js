import Phaser from 'phaser';
import { getDeviceMetric } from './utils/deviceDetection';
import { ViewportControllerBase, TrackingControllerBase } from './controller';
import { AppUrls, Saves } from './model';
import { SoundController } from './scenes/SoundController';
import { PointerController } from './scenes/PointerController';
import { SettingsBase } from './settings/SettingsBase';
import { Shortcuts, ShortcutStub } from './shortcuts';

export class AppBase extends Phaser.Game {
  constructor({ config, paths }) {
    super(config);

    console.log('AbbBase#paul-temp');

    this._gameConfig = config;
    this._deviceMetric = getDeviceMetric();
    this._defaultDimensions = { width: config.width, height: config.height };
    this._safeDimensions = { width: config.safeWidth, height: config.safeHeight };
    this._gameController = null;
    this._appUrls = new AppUrls(this, paths);

    this._settings = new SettingsBase({ game: this });

    this._pointerController = new PointerController({ game: this, key: 'pointerController' });
    this.scene.add(this._pointerController.key, this._pointerController);

    this._soundController = new SoundController({ game: this, key: 'soundController' });
    this.scene.add(this._soundController.key, this._soundController);

    this._viewportController = new ViewportControllerBase({ game: this });
    this._trackingController = new TrackingControllerBase({ game: this });

    this._saves = new Saves();
    if (__SHORTCUTS_ENABLED__) {
      this._shortcuts = new Shortcuts(this);
    }
    if (!__SHORTCUTS_ENABLED__) {
      this._shortcuts = new ShortcutStub(this);
    }
    this._shortcuts.addShortcut({
      field: 'clearSaves',
      title: 'Clear saves',
      value: this._saves.deleteSaves.bind(this._saves),
    });
    this._shortcuts.addShortcut({
      field: 'boundsDebug',
      title: 'Debug bounds',
      value: false,
    });
  }

  init() {}

  get gameConfig() {
    return this._gameConfig;
  }

  get deviceMetric() {
    return this._deviceMetric;
  }

  get defaultDimensions() {
    return this._defaultDimensions;
  }

  get centerPoint() {
    return { x: this._defaultDimensions.width / 2, y: this._defaultDimensions.height / 2 };
  }

  get safeDimensions() {
    return this._safeDimensions;
  }

  get appUrls() {
    return this._appUrls;
  }

  set controller(controller) {
    this._gameController = controller;
  }

  get controller() {
    return this._gameController;
  }

  get pointerController() {
    return this._pointerController;
  }

  get soundController() {
    return this._soundController;
  }

  get viewportController() {
    return this._viewportController;
  }

  get tracking() {
    return this._trackingController;
  }

  get saves() {
    return this._saves;
  }

  get settings() {
    return this._settings;
  }

  get shortcuts() {
    return this._shortcuts;
  }
}
