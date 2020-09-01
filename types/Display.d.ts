export class LoadBar extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, opts: object);
  setProgress();
  destroy();
}

export class ScreenBackground extends Phaser.GameObjects.Image {
  constructor(scene: Phaser.Scene, key: string);
  handleViewUpdate();
  destroy();
}

export class ScreenContainer extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene);
  destroy();
}
