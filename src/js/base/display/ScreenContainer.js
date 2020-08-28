export class ScreenContainer extends Phaser.GameObjects.Container {
  constructor({ scene }) {
    super(scene);
    this.bindedHandleResize = this.resize.bind(this);
    this.scene.scale.on('resize', this.bindedHandleResize);

    this.resize();
  }

  resize() {
    const { width } = this.scene.game.canvas;
    this.x = width * 0.5 - this.scene.sys.game.gameWidthDefault * 0.5;
  }

  positionContainer() {}

  update() {
    super.update();
  }

  destroy() {
    this.scene.scale.off('resize', this.bindedHandleResize);
  }
}
