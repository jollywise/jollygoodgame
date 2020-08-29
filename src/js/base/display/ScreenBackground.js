import { VIEWPORT_EVENTS } from '../constants/Events';

export class ScreenBackground extends Phaser.GameObjects.Image {
  constructor(scene, image) {
    super(
      scene,
      scene.sys.game.defaultDimensions.width * 0.5,
      scene.sys.game.defaultDimensions.height * 0.5,
      image
    );
    scene.add.existing(this);
    this.setScrollFactor(0);
    this.scene.sys.game.viewportController.on(VIEWPORT_EVENTS.UPDATED, this.handleViewUpdate, this);
    this.handleViewUpdate(this.scene.sys.game.viewportController);
  }

  handleViewUpdate(viewport) {
    this.displayWidth = viewport.width;
    this.displayHeight = viewport.height;
  }

  destroy() {
    this.scene.sys.game.viewportController.off(
      VIEWPORT_EVENTS.UPDATED,
      this.handleViewUpdate,
      this
    );
    super.destroy(true);
  }
}
