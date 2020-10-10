export class GameControllerBase {
  constructor(opts: object);
  sceneController;
  copyModel;
  shortcuts;
  setSceneController();
  assetsLoaded();
  handleViewportUpdated();
  pauseGame();
  resumeGame();
  onPaused();
  onResumed();
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

export class TrackingControllerBase {
  constructor(opts: object);
  plugin;
  track();
  setPage();
}

export class ViewportControllerBase {
  constructor(opts: object);
}
