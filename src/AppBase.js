import Phaser from 'phaser';
import { getDeviceMetric } from './utils/deviceDetection';
import { ViewportControllerBase } from './controller';
import { AppUrls, Saves } from './model';
import { Shortcuts, ShortcutStub } from './shortcuts';
import { ComponentManager } from '@jollywise/jollygoodgame/src/components/ComponentManager';
import { ComponentMap } from '@jollywise/jollygoodgame/src/components/ComponentMap';

/** */
export class AppBase extends Phaser.Game {
  constructor({ config, paths, options = {}, components = {}, componentMap = {} }) {
    super(config);
    const { shortcutsContainerId, viewPortType } = options;
    this._gameConfig = config;
    this._deviceMetric = getDeviceMetric();
    this._defaultDimensions = { width: config.width, height: config.height };
    this._safeDimensions = { width: config.safeWidth, height: config.safeHeight };
    this._gameController = null;
    this._appUrls = new AppUrls(this, paths);

    this._viewportController = new ViewportControllerBase({ game: this, viewPortType });

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

    //  install components
    ComponentManager.InstallGameComponents(this, components, {...componentMap, ...ComponentMap});
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

  get viewportController() {
    return this._viewportController;
  }

  get saves() {
    return this._saves;
  }

  get shortcuts() {
    return this._shortcuts;
  }
}
