import { VIEWPORT_EVENTS } from '../constants/Events';
import Phaser from 'phaser';

export class ScreenBackground extends Phaser.GameObjects.Image {
  constructor(scene, image) {
    super(scene, scene.sys.game.centerPoint.x, scene.sys.game.centerPoint.y, image);
    scene.add.existing(this);
    this.setScrollFactor(0);
    this.scene.sys.game.viewportController.on(VIEWPORT_EVENTS.UPDATED, this.handleViewUpdate, this);
    this.handleViewUpdate(this.scene.sys.game.viewportController.viewport);
  }

  handleViewUpdate(viewport) {
    this.scale = viewport.height / this.height;
  }

  destroy() {
    if (this.scene) {
      this.scene.sys.game.viewportController.off(
        VIEWPORT_EVENTS.UPDATED,
        this.handleViewUpdate,
        this
      );
    }
    super.destroy(true);
  }
}
