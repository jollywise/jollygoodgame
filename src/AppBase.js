import Phaser from 'phaser';
import { getDeviceMetric } from './utils/deviceDetection';

/** */
export class AppBase extends Phaser.Game {
  constructor({ config }) {
    super(config);
    this._gameConfig = config;
    this._deviceMetric = getDeviceMetric();
    this._defaultDimensions = { width: config.width, height: config.height };
    this._safeDimensions = { width: config.safeWidth, height: config.safeHeight };
    this._gameController = null;

    this._installComponents(config.components);

    // enable shortcuts
    if (__SHORTCUTS_ENABLED__) this.shortcuts.enable();
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

  set controller(controller) {
    this._gameController = controller;
  }

  get controller() {
    return this._gameController;
  }

  _installComponents(components) {
    console.log('[Installing Components]');

    const installedComponents = [];
    const installComponent = (global, key, component, data) => {
      if (global) {
        const installed = this.plugins.install(key, component, true, null, data);
        if (installed) {
          this[key] = installed;
          console.log('\t installed : ' + key);
          installedComponents.push(installed);
        }
      } else {
        const installed = this.plugins.installScenePlugin(key, components, key);
        if (installed) console.log('\t installed : ' + key);
      }
    };

    // install the components
    Object.keys(components).forEach((key) => {
      if (components[key].prototype instanceof Phaser.Plugins.BasePlugin) {
        const global = components[key].prototype instanceof Phaser.Plugins.ScenePlugin != true;
        installComponent(global, key, components[key]);
      } else {
        const { component, data } = components[key];
        if (component && component.prototype instanceof Phaser.Plugins.BasePlugin) {
          const global = component.prototype instanceof Phaser.Plugins.ScenePlugin != true;
          installComponent(global, key, component, data);
        } else console.error('Component is not a Phaser plugin : ' + key);
      }
    });

    // run start - all components shuld be installed and ready to use
    installedComponents.forEach((c) => (c.onGameReady ? c.onGameReady() : null));
  }
}
