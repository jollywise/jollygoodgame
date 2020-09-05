import Phaser from 'phaser';

export class PointerController extends Phaser.Scene {
  constructor({ key }) {
    super({ key, active: true });
    this.key = key;
    this.pointer = null;
    this.pointerInside = true;
  }

  setPointer({ key, originX = 0.5, originY = 0.5 }) {
    this.input.on('gameout', this.onPointerOut, this);
    this.input.on('gameover', this.onPointerOver, this);
    this.input.setDefaultCursor('none');

    this.pointer = this.add.image(0, 0, key);
    this.pointer.setOrigin(originX, originY);
    if (!this.pointerInside) {
      this.pointer.visible = false;
    }
  }

  onPointerOut() {
    if (this.pointer) {
      this.pointer.visible = false;
    }
    this.pointerInside = false;
  }

  onPointerOver() {
    if (this.pointer) {
      this.pointer.visible = true;
    }
    this.pointerInside = true;
  }

  resetPointer() {
    this.remove(this.pointer);
    this.pointer = null;

    this.input.setDefaultCursor('default');
    this.input.off('gameout', this.onPointerOut, this);
    this.input.off('gameover', this.onPointerOver, this);
  }

  update(time, delta) {
    super.update(time, delta);
    if (this.pointer && this.input.activePointer) {
      this.scene.bringToTop(this.key);
      this.pointer.x = this.input.activePointer.x;
      this.pointer.y = this.input.activePointer.y;
    }
  }
}
