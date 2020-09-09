import Phaser from 'phaser';

export class BoundsDB extends Phaser.GameObjects.Graphics {
  constructor(scene) {
    super(scene);
  }

  clearGraphics() {
    this.clear();
  }

  drawBounds({ x, y, width, height }, colour = CLR.GENERAL) {
    if (this.scene.sys.game.shortcuts.model.boundsDebug) {
      this.lineStyle(2, colour, 1);
      this.strokeRect(x, y, width, height);
    }
  }

  drawLine(sx, sy, ex, ey, colour = 0xffff00) {
    this.lineStyle(5, colour, 1);
    this.lineBetween(sx, sy, ex, ey);
  }

  drawCircle(x, y, radius, colour = CLR.GENERAL) {
    if (this.scene.sys.game.shortcuts.model.boundsDebug) {
      this.lineStyle(2, colour, 1);
      this.strokeCircle(x, y, radius);
    }
  }

  drawPoints(points, colour = CLR.GENERAL) {
    this.lineStyle(2, colour, 1);
    this.moveTo(points[0].x, points[0].y);
    points.forEach((p, index) => {
      this.lineTo(p.x, p.y);
    });
    this.lineTo(points[0].x, points[0].y);
    this.stroke();
  }
}
export const CLR = {
  GENERAL: 0xffff00,
  GROUND: 0x00ff00,
  PLAYER: 0xffff00,
  COLLISION: 0xff0000,
  SLOT: 0xfcb103,
};
