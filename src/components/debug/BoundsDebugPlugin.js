/**
 *
 * @alias components.BoundsDebugPlugin
 * @classdesc Draw debug shapes in the scene for testing things like boounds
 * @todo write documentation
 *
 */
class BoundsDebugPlugin extends Phaser.Plugins.ScenePlugin {
  constructor(scene, pluginManager) {
    super(scene, pluginManager);
    this._displayDepth = 99;
    this._defaultColour = 0x00ff00;
    this._defaultLineWidth = 2;
  }

  boot() {
    this.scene.events.on('shutdown', this.shutdown, this);
  }

  set defaultColour(value) {
    this._defaultColour = value;
  }

  set defaultLineWidth(value) {
    this._defaultLineWidth = value;
  }

  set depth(value) {
    this._displayDepth = value;
    if (this._display) {
      this._display.setDepth(value);
    }
  }

  get display() {
    if (!this._display) {
      this.createDisplay();
    }
    return this._display;
  }

  createDisplay() {
    if (this._display) return;
    this._display = this.scene.add.graphics();
    this._display.setDepth(this._displayDepth);
  }

  destroyDisplay() {
    if (this._display) {
      this._display.destroy ? this._display.destroy() : false;
      this._display = null;
    }
  }

  clearDisplay() {
    if (this._display) {
      this._display.clear();
    }
  }

  drawBounds({ x, y, width, height }, colour, lineWidth) {
    this.display.lineStyle(lineWidth || this._defaultLineWidth, colour || this._defaultColour, 1);
    this.display.strokeRect(x, y, width, height);
  }

  drawLine(sx, sy, ex, ey, colour, lineWidth) {
    this.display.lineStyle(lineWidth || this._defaultLineWidth, colour || this._defaultColour, 1);
    this.display.lineBetween(sx, sy, ex, ey);
  }

  drawCircle(x, y, radius, colour, lineWidth) {
    this.display.lineStyle(lineWidth || this._defaultLineWidth, colour || this._defaultColour, 1);
    this.display.strokeCircle(x, y, radius);
  }

  drawPoints(points) {
    this.display.lineStyle(lineWidth || this._defaultLineWidth, colour || this._defaultColour, 1);
    this.display.moveTo(points[0].x, points[0].y);
    points.forEach((p, index) => {
      this.display.lineTo(p.x, p.y);
    });
    this.display.lineTo(points[0].x, points[0].y);
    this.display.stroke();
  }

  shutdown() {
    this.destroyDisplay();
  }

  destroy() {
    this.shutdown();
    super.destroy();
  }
}

export { BoundsDebugPlugin };
