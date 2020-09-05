import Phaser from 'phaser';
import { getDeviceMetric } from './utils/deviceDetection';
import { ViewportControllerBase, TrackingControllerBase } from './controller';
import { AppUrls, Saves } from './model';
import { SoundController } from './scenes/SoundController';
import { PointerController } from './scenes/PointerController';

export class AppBase extends Phaser.Game {
  constructor({ config, paths }) {
    super(config);

    this._gameConfig = config;
    this._deviceMetric = getDeviceMetric();
    this._defaultDimensions = { width: config.width, height: config.height };
    this._gameController = null;

    this._pointerController = new PointerController({ key: 'pointerController' });
    this.scene.add(this._pointerController.key, this._pointerController);

    this._soundController = new SoundController({ key: 'soundController' });
    this.scene.add(this._soundController.key, this._soundController);

    this._appUrls = new AppUrls(this, paths);
    this._viewportController = new ViewportControllerBase({ game: this });
    this._trackingController = new TrackingControllerBase({ game: this });

    this._saves = new Saves();
  }

  init() {}

  get gameConfig() {
    return this._gameConfig;
  }

  get deviceMetric() {
    // deviceMetric returns a profile of the device used to determine if game need to adjust loaded assets (lowend etc)
    return this._deviceMetric;
  }

  get defaultDimensions() {
    return this._defaultDimensions;
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

  set settings(settings) {
    this._settings = settings;
  }

  get settings() {
    return this._settings;
  }
}
