import Phaser from 'phaser';
import { getDeviceMetric } from 'utils/deviceDetection';

export class AppBase extends Phaser.Game {
  constructor({ config, gameMode, gameConfig = {}, paths = { base: './', assets: 'assets/' } }) {
    super(config);

    this._gameConfig = gameConfig;
    this._deviceMetric = getDeviceMetric();
    // this._appUrls = new AppUrls(this, paths);
    // this._trackingController = new TrackingController({ game: this });
    // this._settingsController = new SettingsController({ game: this });
    // this._soundController = new SoundController({ game: this });
    // this._viewportController = new ViewportController({ game: this });
    // this._gameController = new GameController({ game: this, gameMode });
    //
    // this.defaultGameWidth = gameConfig.width;
    // this.defaultGameHeight = gameConfig.height;
  }

  init() {}

  get gameConfig() {
    return this._gameConfig;
  }

  get deviceMetric() {
    return this._deviceMetric;
  }

  get appUrls() {
    return this._appUrls;
  }

  get gameController() {
    return this._gameController;
  }

  get settings() {
    return this._settingsController;
  }

  get tracking() {
    return this._trackingController;
  }

  get soundController() {
    return this._soundController;
  }

  get viewportController() {
    return this._viewportController;
  }
}
