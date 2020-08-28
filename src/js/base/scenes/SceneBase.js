export class SceneBase extends Phaser.Scene {
  constructor({ key, active = false }) {
    super({ key, active });
  }

  init() {
    const { width, height } = this.game.defaultDimensions;
    this.defaultWidth = width;
    this.defaultHeight = height;
  }

  create(options) {
    options;
    this.scale.on('resize', this.handleGameResized, this);
    this.events.on('shutdown', this.shutdown, this);
    this.events.on('pause', this.onScenePaused, this);
    this.events.on('resume', this.onSceneResumed, this);
  }

  handleGameResized() {
    const viewport = this.getViewport();
    if (this.bg) {
      this.bg.width = viewport.width;
      this.bg.height = viewport.height;
    }
  }

  onScenePaused() {
    this.disableScene();
  }

  onSceneResumed() {
    this.enableScene();
  }

  enableScene() {}

  disableScene() {}

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
    this.scale.off('resize', this.handleGameResized, this);
    this.events.off('shutdown', this.shutdown, this);
    this.events.off('pause', this.onScenePaused, this);
    this.events.off('resume', this.onSceneResumed, this);
    if (this.bg) {
      this.bg.destroy(true);
      this.bg = null;
    }
  }
}
