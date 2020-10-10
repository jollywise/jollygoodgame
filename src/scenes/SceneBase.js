import Phaser from 'phaser';
import { VIEWPORT_EVENTS } from '../constants/Events';
import { ScreenBackground } from '../display/ScreenBackground';

export class SceneBase extends Phaser.Scene {
  constructor({ key, active = false }) {
    super({ key, active });
    this._sceneKey = key;
  }

  init() {
    const { width, height } = this.game.defaultDimensions;
    this.defaultWidth = width;
    this.defaultHeight = height;
  }

  setBackground(key) {
    this.bg = new ScreenBackground(this, key);
    this.add.existing(this.bg);
  }

  loadComplete() {
    if (this.loadScreen) {
      this.loadScreen.destroy();
      this.loadScreen = null;
    }
  }

  create(options) {
    options;
    this.events.on('shutdown', this.shutdown, this);
    this.events.on('pause', this.onScenePaused, this);
    this.events.on('resume', this.onSceneResumed, this);

    this.game.viewportController.on(VIEWPORT_EVENTS.UPDATED, this.handleViewUpdate, this);
    this.handleViewUpdate(this.game.viewportController.viewport);
  }

  handleViewUpdate(viewport) {
    viewport;
  }

  onScenePaused() {}

  onSceneResumed() {}

  getViewport() {
    const windowAspect = this.game.scale.parentSize.aspectRatio;
    const height = this.defaultHeight;
    const width = Math.min(this.defaultWidth, this.defaultHeight * windowAspect);
    const x = Math.max(0, this.defaultWidth * 0.5 - width * 0.5);
    const y = Math.max(0, this.defaultHeight * 0.5 - height * 0.5);
    const right = x + width;
    const bottom = y + height;
    const padding = Math.max(width * 0.02, height * 0.02);
    return { x, y, width, height, padding, right, bottom };
  }

  shutdown() {
    this.game.viewportController.off(VIEWPORT_EVENTS.UPDATED, this.handleViewUpdate, this);

    this.events.off('shutdown', this.shutdown, this);
    this.events.off('pause', this.onScenePaused, this);
    this.events.off('resume', this.onSceneResumed, this);
    if (this.bg) {
      this.bg.destroy(true);
      this.bg = null;
    }
    if (this.loadScreen) {
      this.loadScreen.destroy(true);
      this.loadScreen = null;
    }
    this.scene.stop(this._sceneKey);
  }
}
