import Phaser from 'phaser';
import { getDeviceMetric } from './utils/deviceDetection';
import { ViewportControllerBase, TrackingControllerBase, GameControllerBase } from './controller';
import { AppUrls, Saves } from './model';
import { SoundController } from './scenes/SoundController';
import { PointerController } from './scenes/PointerController';
import { SettingsBase } from './settings/SettingsBase';
import { Shortcuts, ShortcutStub } from './shortcuts';

/**
 * @class AppBase
 * @classdesc AppBase extends {@link https://photonstorm.github.io/phaser3-docs/Phaser.Game.html|Phaser.Game}, plugging in core components and providing them in scope.
 * @extends Phaser.Game
 * @property {AppBaseOptions} settings
 */
export class AppBase extends Phaser.Game {
  constructor({ config, paths, options = {} }) {
    super(config);
    const { shortcutsContainerId, viewPortType } = options;
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

    this._viewportController = new ViewportControllerBase({ game: this, viewPortType });
    this._trackingController = new TrackingControllerBase({ game: this });

    this._saves = new Saves();
    if (__SHORTCUTS_ENABLED__) {
      this._shortcuts = new Shortcuts(this, shortcutsContainerId);
    }
    if (!__SHORTCUTS_ENABLED__) {
      this._shortcuts = new ShortcutStub(this);
    }
    this._shortcuts.addShortcut({
      field: 'clearSaves',
      title: 'Clear saves',
      value: this._saves.deleteSaves.bind(this._saves),
    });
  }

  init() {}

  /**
   * @readonly
   * Get the game configuration, as passed through in the constructor */
  get gameConfig() {
    return this._gameConfig;
  }

  /**
   * The estimated device performance level
   * @type {string}
   * @see PERFORMANCE_CATEGORY
   * @see getDeviceMetric
   * @readonly
   */
  get deviceMetric() {
    return this._deviceMetric;
  }

  /**
   * Default dimensions of the game
   * @type {object}
   * @readonly
   */
  get defaultDimensions() {
    return this._defaultDimensions;
  }
  /**
   * Center point of game
   * @type {object}
   * @readonly
   */
  get centerPoint() {
    return { x: this._defaultDimensions.width / 2, y: this._defaultDimensions.height / 2 };
  }
  /**
   * Screen safe dimensions
   * @type {object}
   * @readonly
   */
  get safeDimensions() {
    return this._safeDimensions;
  }

  /**
   * Reference to the app urls component
   * @type {AppUrls}
   * @see AppUrls
   * @readonly
   */
  get appUrls() {
    return this._appUrls;
  }

  /**
   * Reference to the game controller component
   * @type {GameControllerBase}
   * @see GameControllerBase
   */
  set controller(controller) {
    this._gameController = controller;
  }

  get controller() {
    return this._gameController;
  }

  /**
   * Reference to the pointer component
   * @type {PointerController}
   * @see PointerController
   * @readonly
   */
  get pointerController() {
    return this._pointerController;
  }

  /**
   * Reference to the sound controller component
   * @type {SoundController}
   * @see SoundController
   * @readonly
   */
  get soundController() {
    return this._soundController;
  }

  /**
   * Reference to the viewport component
   * @type {ViewportControllerBase}
   * @see ViewportControllerBase
   * @readonly
   */
  get viewportController() {
    return this._viewportController;
  }

  /**
   * Reference to the tracking component
   * @type {TrackingControllerBase}
   * @see TrackingControllerBase
   * @readonly
   */
  get tracking() {
    return this._trackingController;
  }

  /**
   * Reference to the saves component
   * @type {Saves}
   * @see Saves
   * @readonly
   */
  get saves() {
    return this._saves;
  }

  /**
   * Reference to the settings component
   * @type {SettingsBase}
   * @see SettingsBase
   * @readonly
   */
  get settings() {
    return this._settings;
  }

  /**
   * Reference to the shortcuts component
   * @type {Shortcuts}
   * @see Shortcuts
   * @readonly
   */
  get shortcuts() {
    return this._shortcuts;
  }
}

/**
 *
 * @typedef {Object} PathsConfig
 * @description define the base url for the app, as well as the assets root folder
 * @property {string} base './'
 * @property {string} assets 'assets/'
 *
 */

/**
 *
 * @typedef {Object} AppBaseOptions
 * @description a configuration object that is passed through in the constructor
 * @property {Object} config the base game configuration
 * @property {PathsConfig} paths the default urls for app paths
 * @property {Object} options an options config
 * @todo Can we just flatten this into a singular config?
 *
 */
