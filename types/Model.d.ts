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
  constructor(game: any, paths: Object);
  game;
  basePath;
  assetsPath;
  getBaseDirectory();
  resolveRelativeUrl();
  resolveLevelAssetsUrl();
  getAssetsDirectory();
  getFontsDirectory();
}

export class CopyModel {
  constructor(o: Object);
  copy;
  get();
  getString();
  getStringNoDefault();
}

export class Settings {
  constructor(o: Object);
}
