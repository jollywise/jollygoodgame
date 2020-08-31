import Phaser from 'phaser';
import { getDeviceMetric } from './utils/deviceDetection';
import {
  SoundControllerBase,
  SettingsControllerBase,
  ViewportControllerBase,
  TrackingControllerBase,
} from './base/controller';
import { AppUrls, Saves } from './base/model';

export class AppBase extends Phaser.Game {
  constructor({ config, paths }) {
    super(config);

    this._gameConfig = config;
    this._deviceMetric = getDeviceMetric();
    this._appUrls = new AppUrls(this, paths);
    this._defaultDimensions = { width: config.width, height: config.height };

    this._soundController = new SoundControllerBase({ game: this });
    this._settingsController = new SettingsControllerBase({ game: this });
    this._viewportController = new ViewportControllerBase({ game: this });
    this._trackingController = new TrackingControllerBase({ game: this });

    this._saves = new Saves();
  }

  init() {}

  get saves() {
    return this._saves;
  }

  get soundController() {
    return this._soundController;
  }

  get settings() {
    return this._settingsController;
  }

  get viewportController() {
    return this._viewportController;
  }

  get tracking() {
    return this._trackingController;
  }

  get gameConfig() {
    return this._gameConfig;
  }

  get defaultDimensions() {
    return this._defaultDimensions;
  }

  get deviceMetric() {
    return this._deviceMetric;
  }
}
