import Phaser from 'phaser';
import { getDeviceMetric } from 'utils/deviceDetection';
import {
  SoundControllerBase,
  SettingsControllerBase,
  ViewportControllerBase,
  TrackingControllerBase,
} from './base/controller';

export class AppBase extends Phaser.Game {
  constructor({ config }) {
    super(config);
    this._gameConfig = config;
    this._deviceMetric = getDeviceMetric();
    this._soundController = new SoundControllerBase({ game: this });
    this._settingsController = new SettingsControllerBase({ game: this });
    this._viewportController = new ViewportControllerBase({ game: this });
    this._trackingController = new TrackingControllerBase({ game: this });
    this._defaultDimensions = { width: config.width, height: config.height };
  }

  init() {}

  get soundController() {
    return this._soundController;
  }

  get settingsController() {
    return this._settingsController;
  }

  get viewportController() {
    return this._viewportController;
  }

  get trackingController() {
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
