export class BootBase extends Phaser.Scene {
  constructor(opts: object);
  init();
  preload();
  loadComplete();
  create();
  update(time: number, delta: number);
  shutdown();
}

export class LoadBase extends Phaser.Scene {
  constructor(opts: object);
  init();
  renderScene();
  preload();
  loadComplete();
  create();
  update(time: number, delta: number);
  shutdown();
}

export class SceneBase extends Phaser.Scene {
  constructor(opts: object);
  init();
  create();
  handleViewUpdate(viewport: object);
  enableScene();
  disableScene();
  getViewport();
  update(time: number, delta: number);
  shutdown();
}

export class SceneLoadBase extends Phaser.Scene {
  constructor(opts: object);
  init();
  renderScene();
  preload();
  loadAssetPackComplete();
  create();
  loadComplete();
  start();
  flushLoadedAssets();
  update(time: number, delta: number);
  shutdown();
}

export class SoundController extends Phaser.Scene {}

export class PointerController extends Phaser.Scene {}
