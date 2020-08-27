import Phaser from 'phaser';
import { getDeviceMetric } from 'utils/deviceDetection';

export class AppBase extends Phaser.Game {
  constructor({ config }) {
    super(config);
    this._gameConfig = config;
    this._deviceMetric = getDeviceMetric();
    this.defaultGameWidth = config.width;
    this.defaultGameHeight = config.height;
  }

  init() {}

  get gameConfig() {
    return this._gameConfig;
  }

  get deviceMetric() {
    return this._deviceMetric;
  }
}
