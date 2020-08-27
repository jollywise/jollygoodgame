import EventEmitter from 'eventemitter3';

export default class TapArea extends EventEmitter {
  constructor(scene, container, { x, y, w, h }) {
    super();

    this.scene = scene;
    this.bindedDown = this.onDown.bind(this);
    this.bindedUp = this.onUp.bind(this);
    this.bindedMove = this.onMove.bind(this);
    // const { width, height } = scene.game.canvas;
    this.clickbox = scene.add.zone(x, y, w, h).setOrigin(0);
    this.clickbox.setScrollFactor(0); // phaser 2 fixedToCamera
    this.clickbox.active = true;
    this.pointer = false;
    this.pointerDown = false;
    this.timeDown = 0;
    container.add(this.clickbox);
    this.enable();
  }

  enable() {
    this.clickbox.setInteractive({ useHandCursor: true });
    this.clickbox.on('pointerdown', this.bindedDown, this);
    this.clickbox.on('pointerup', this.bindedUp, this);
  }

  disable() {
    this.clickbox.disableInteractive();
    this.clickbox.off('pointerdown', this.bindedDown, this);
    this.clickbox.off('pointermove', this.bindedMove, this);
    this.clickbox.off('pointerup', this.bindedUp, this);
  }

  onMove(pointer) {
    if (this.scene.time.now - this.timeDown > 250) {
      if (this.pointerDown) {
        const { x, y } = pointer;
        this.pointer = { x, y };
      }
    }
  }

  onDown(pointer) {
    this.timeDown = this.scene.time.now;
    this.clickbox.on('pointermove', this.bindedMove, this);
    this.pointerDown = true;
    const { x, y } = pointer;
    this.pointer = { x, y };
  }

  onUp(pointer) {
    this.clickbox.off('pointermove', this.bindedMove, this);
    this.pointerDown = false;
    this.pointer = false;
    // const { x, y } = pointer;
    // this.onClick(pointer);
  }

  onClick(pointer) {
    const { x, y } = pointer;
    this.emit(TAP, { x, y });
  }

  destroy() {
    this.disable();
    this.clickbox = null;
  }
}

export const TAP = 'TAP';
