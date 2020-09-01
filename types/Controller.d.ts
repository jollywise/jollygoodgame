export class GameControllerBase {
  constructor(opts: object);
  sceneController;
  addSceneController();
  assetsLoaded();
  handleViewportUpdated();
  pauseGame();
  resumeGame();
  addShortcuts();
  updateShortcuts();
}

export class SceneControllerBase {
  constructor(opts: object);
  sceneManager;
  addSceneMap();
  switchScene();
  startScene();
  stopScene();
  pauseScene();
  resumeScene();
}

export class SettingsControllerBase {
  constructor(opts: object);
}

export class SoundControllerBase {
  constructor(opts: object);
}

export class TrackingControllerBase {
  constructor(opts: object);
  plugin;
  track();
  setPage();
}

export class ViewportControllerBase {
  constructor(opts: object);
}
