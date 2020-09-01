export class GameControllerBase {
  constructor(o: object);
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
  constructor(o: object);
  sceneManager;
  addSceneMap();
  switchScene();
  startScene();
  stopScene();
  pauseScene();
  resumeScene();
}

export class SettingsControllerBase {
  constructor(o: object);
}

export class SoundControllerBase {
  constructor(o: object);
}

export class TrackingControllerBase {
  constructor(o: object);
  plugin;
  track();
  setPage();
}

export class ViewportControllerBase {
  constructor(o: object);
}
