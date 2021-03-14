import Phaser from 'phaser';
import { getDeviceMetric } from './utils/deviceDetection';
import { Saves } from './model';
import {
  InstallGameComponents,
  MergeComponentMaps,
} from '@jollywise/jollygoodgame/src/components/ComponentManager';
import { ComponentMap } from '@jollywise/jollygoodgame/src/components/ComponentMap';

/** */
export class AppBase extends Phaser.Game {
  constructor({ config, paths, components = {} }) {
    super(config);
    this._gameConfig = config;
    this._deviceMetric = getDeviceMetric();
    this._defaultDimensions = { width: config.width, height: config.height };
    this._safeDimensions = { width: config.safeWidth, height: config.safeHeight };
    this._gameController = null;

    this._saves = new Saves();

    //  install components
    InstallGameComponents(this, MergeComponentMaps(ComponentMap, components));

    // set paths
    this.appUrls.setPaths(paths);

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

  get saves() {
    return this._saves;
  }

  // mergeComponentMaps(defaultMap, optionalMap) {
  //   const mergedMap = {};
  //   Object.keys(defaultMap).forEach((key) => {
  //     const merged = this.mergeComponentConfig(defaultMap[key], optionalMap[key]);
  //     if (merged) mergedMap[key] = merged;
  //   });
  //   const additionalComponents = Object.keys(optionalMap).filter((k) => !mergedMap[k]);
  //   additionalComponents.forEach((key) => (mergedMap[key] = optionalMap[key]));
  //   console.log(mergedMap);
  //   return mergedMap;
  // }

  // mergeComponentConfig(defaultConfig, optionalConfig) {
  //   // config is optional and user option does not want it
  //   if (defaultConfig.optional && !optionalConfig) return false;
  //   // user has requested default component and config
  //   if (optionalConfig === true) return defaultConfig;
  //   // component is not option, and user has ommited it - return default
  //   if (!defaultConfig.optional && !optionalConfig) return defaultConfig;
  //   // user has some custom configuration
  //   const { component, config } = optionalConfig;
  //   const merged = { ...defaultConfig };
  //   if (component && component.prototype instanceof defaultConfig.component)
  //     merged.component = component;
  //   if (config) merged.config = { ...(defaultConfig || {}), ...merged.config };
  // }
}
