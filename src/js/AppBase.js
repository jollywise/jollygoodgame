import Phaser from 'phaser';
import GameController from 'base/controller/GameController';
import SoundController from 'base/controller/SoundController';
import AppUrls from 'base/constants/AppUrls';
import ViewportController from 'base/controller/ViewportController';
import SettingsController from 'base/controller/SettingsController';
import TrackingController from 'base/controller/TrackingController';
import { getDeviceMetric } from 'utils/deviceDetection';

export default class JGGApp extends Phaser.Game {
  constructor({ config, gameMode, gameConfig = {}, paths = { base: './', assets: 'assets/' } }) {
    super(config);

    this._gameConfig = gameConfig;
    this._appUrls = new AppUrls(this, paths);
    this._trackingController = new TrackingController({ game: this });
    this._settingsController = new SettingsController({ game: this });
    this._soundController = new SoundController({ game: this });
    this._viewportController = new ViewportController({ game: this });
    this._gameController = new GameController({ game: this, gameMode });

    this.defaultGameWidth = gameConfig.width;
    this.defaultGameHeight = gameConfig.height;

    this._deviceMetric = getDeviceMetric();
  }

  init() {}

  get gameConfig() {
    return this._gameConfig;
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

  get deviceMetric() {
    return this._deviceMetric;
  }
}
