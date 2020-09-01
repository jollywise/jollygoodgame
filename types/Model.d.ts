export class Saves {
  constructor();
  storage;
  createSaveId();
  setSaveId();
  getSaveId();
  load();
  save();
}

export class AppUrls {
  constructor(game: Phaser.Game, paths: object);
  game: Phaser.Game;
  basePath;
  assetsPath;
  getBaseDirectory();
  resolveRelativeUrl();
  resolveLevelAssetsUrl();
  getAssetsDirectory();
  getFontsDirectory();
}

export class CopyModel {
  constructor(opts: object);
  copy;
  get();
  getString();
  getStringNoDefault();
}

export class Settings {
  constructor(opts: object);
}
