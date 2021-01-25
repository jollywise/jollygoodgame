export class AppBase extends Phaser.Game {
  constructor(opts: object);
  gameConfig;
  deviceMetric;
  defaultDimensions;
  appUrls;
  controller;
  soundController;
  pointerController;
  viewportController;
  tracking;
  saves;
  settings;
}
