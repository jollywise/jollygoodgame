import Phaser from 'phaser';
import { getDeviceMetric } from 'utils/deviceDetection';

export class AppBase extends Phaser.Game {
  constructor({ config }) {
    super(config);
    this._gameConfig = config;
    this._deviceMetric = getDeviceMetric();
    this._defaultDimensions = { width: config.width, height: config.height };
  }

  init() {}

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
