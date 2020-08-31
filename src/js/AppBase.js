import Phaser from 'phaser';
import { getDeviceMetric } from './utils/deviceDetection';
import {
  SoundControllerBase,
  ViewportControllerBase,
  TrackingControllerBase,
} from './base/controller';
import { AppUrls, Saves } from './base/model';

export class AppBase extends Phaser.Game {
  constructor({ config, paths }) {
    super(config);

    this._gameConfig = config;
    this._deviceMetric = getDeviceMetric();
    this._defaultDimensions = { width: config.width, height: config.height };

    this._appUrls = new AppUrls(this, paths);
    this._soundController = new SoundControllerBase({ game: this });
    this._viewportController = new ViewportControllerBase({ game: this });
    this._trackingController = new TrackingControllerBase({ game: this });

    this._saves = new Saves();

    // localstorage plugin : import { StoragePlugin } from './base/storage';
    // const storage = getStorage('hey-duggee-2');
    // storage.plugin = new StoragePlugin();
    // this.saves.storage = storage;
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
}
