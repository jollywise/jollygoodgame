class LoadBar extends Phaser.GameObjects.Container {
  constructor({ scene, x, y }) {
    const track = scene.add.image(x, y, 'loadbar', 'loading_bar').setOrigin(0);
    const width = track.width;
    x -= width * 0.5;
    track.x = x;
    const progressBar = scene.add.image(x, y, 'loadbar', 'loading_fill').setOrigin(0);
    super(scene, [track, progressBar]);
    this.x = x;
    this.y = y;

    scene.add.existing(this);

    const shape = this.createShapeMask(x, y, progressBar.width, progressBar.height);
    this.mask = shape.createGeometryMask();
    progressBar.mask = this.mask;

    this.track = track;
    this.progressBar = progressBar;
  }

  setProgress(value) {
    value = value === 0 ? 0.001 : value;
    const shape = this.createShapeMask(
      this.x,
      this.y,
      this.progressBar.width * value,
      this.progressBar.height
    );
    this.mask.setShape(shape);
  }

  destroy() {
    this.progressBar.clearMask();
    this.track.destroy(true);
    this.progressBar.destroy(true);
    this.mask.destroy(true);
  }

  createShapeMask(x, y, w, h) {
    const shape = this.scene.make.graphics();
    shape.fillStyle(0xffffff);
    shape.fillRect(x, y, w, h);
    return shape;
  }
}
export default LoadBar;
