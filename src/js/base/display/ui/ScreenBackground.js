import { VIEWPORT_EVENTS } from '../../controller/ViewportController';

export default class ScreenBackground extends Phaser.GameObjects.Image {
  constructor(scene, image) {
    super(
      scene,
      scene.sys.game.gameWidthDefault * 0.5,
      scene.sys.game.gameHeightDefault * 0.5,
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
