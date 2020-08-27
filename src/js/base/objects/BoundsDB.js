export class BoundsDBStub {
  constructor() {}
  clearGraphics() {}
  drawBounds() {}
}

export default class BoundsDB extends Phaser.GameObjects.Graphics {
  constructor(scene, shortcutsModel) {
    super(scene);
    this.shortcuts = shortcutsModel;
  }

  clearGraphics() {
    this.clear();
  }

  drawBounds({ x, y, width, height }, colour = CLR.GENERAL) {
    if (this.shortcuts.boundsDebug) {
      this.lineStyle(2, colour, 1);
      this.strokeRect(x, y, width, height);
    }
  }

  drawLine(sx, sy, ex, ey, colour = 0xffff00) {
    this.lineStyle(5, colour, 1);
    this.lineBetween(sx, sy, ex, ey);
  }

  drawCircle(x, y, radius, colour = CLR.GENERAL) {
    if (this.shortcuts.boundsDebug) {
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
