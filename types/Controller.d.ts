export class GameControllerBase {
  constructor(o: Object);
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
  constructor(o: Object);
  sceneManager;
  addSceneMap();
  switchScene();
  startScene();
  stopScene();
  pauseScene();
  resumeScene();
}

export class SettingsControllerBase {
  constructor(o: Object);
}

export class SoundControllerBase {
  constructor(o: Object);
}

export class TrackingControllerBase {
  constructor(o: Object);
  plugin;
  track();
  setPage();
}

export class ViewportControllerBase {
  constructor(o: Object);
}
