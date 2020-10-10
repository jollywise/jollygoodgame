export class SceneControllerBase {
  constructor(sceneManager) {
    this.sceneManager = sceneManager;
    this.currentSceneKey = null;
    this.paused = false;
  }

  addSceneMap(sceneMap) {
    sceneMap.map(({ key, state }) => {
      if (!this.sceneManager.keys[key]) {
        this.sceneManager.add(key, state);
      }
    });
  }

  reset() {
    this.currentSceneKey = null;
  }

  getCurrentScene() {
    return this.sceneManager.getScene(this.currentSceneKey);
  }

  getScene(id) {
    return this.sceneManager.getScene(id);
  }

  getScenes(isActive = true) {
    return this.sceneManager.getScenes(isActive);
  }

  sleepScene(id) {
    this.sceneManager.getScene(id).sleep();
    this.sceneManager.sleep(id);
  }

  shutdownScene(id) {
    this.sceneManager.getScene(id).shutdown();
  }

  shutdownScenes(scenes = []) {
    for (const sceneID of scenes) {
      this.sceneManager.getScene(sceneID).shutdown();
    }
  }

  switchScene(sceneKey, { data } = {}) {
    // console.log('switchScene', sceneKey);
    if (this.currentSceneKey) {
      this.stopScene(this.currentSceneKey);
    }
    this.currentSceneKey = sceneKey;
    this.startScene(this.currentSceneKey, { data });
    if (this.paused) {
      this.pauseScene(this.currentSceneKey);
    }
  }

  startScene(scene, data) {
    this.sceneManager.start(scene, data);
    this.sceneManager.getScene(scene).scene.setVisible(true);
    this.sceneManager.bringToTop(scene);
  }

  stopScene(scene) {
    this.sceneManager.stop(scene);
    this.sceneManager.getScene(scene).scene.setVisible(false);
  }

  pauseScene(scene) {
    this.sceneManager.pause(scene);
  }

  resumeScene(scene) {
    this.sceneManager.resume(scene);
    this.sceneManager.bringToTop(scene);
  }

  showOverlayScene(sceneKey, { data, onOverlayClosed = null } = {}) {
    if (this.overlaySceneKey) this.removeOverlayScene();
    this.overlaySceneKey = sceneKey;
    this.onOverlayClosed = onOverlayClosed;
    this.pauseScene(this.currentSceneKey);
    this.startScene(sceneKey, { data });
    if (this.paused) {
      this.pauseScene(sceneKey);
    }
  }

  removeOverlayScene() {
    if (this.overlaySceneKey) {
      this.stopScene(this.overlaySceneKey);
      if (!this.paused) {
        this.resumeScene(this.currentSceneKey);
      }
      this.overlaySceneKey = null;
      if (this.onOverlayClosed) {
        const t = this.onOverlayClosed;
        this.onOverlayClosed = null;
        setTimeout(t, 100);
      }
    }
  }

  pause() {
    this.paused = true;
    this.pauseScene('soundController');
    this.pauseScene(this.overlaySceneKey ? this.overlaySceneKey : this.currentSceneKey);
  }

  resume() {
    this.paused = false;
    this.resumeScene('soundController');
    this.resumeScene(this.overlaySceneKey ? this.overlaySceneKey : this.currentSceneKey);
  }
}
