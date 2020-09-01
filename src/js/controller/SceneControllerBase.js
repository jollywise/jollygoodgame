export class SceneControllerBase {
  constructor(sceneManager) {
    this.sceneManager = sceneManager;
  }

  addSceneMap(sceneMap) {
    this.currentSceneKey = null;
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

  pause(key) {
    this.sceneManager.pause(key);
  }

  resume(key) {
    this.sceneManager.resume(key);
  }

  switchScene(sceneKey, { data } = {}) {
    // console.log('switchScene', sceneKey);
    if (this.currentSceneKey) {
      this.stopScene(this.currentSceneKey);
    }
    this.currentSceneKey = sceneKey;
    this.startScene(this.currentSceneKey, { data });
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
  }

  removeOverlayScene() {
    if (this.overlaySceneKey) {
      this.stopScene(this.overlaySceneKey);
      this.resumeScene(this.currentSceneKey);
      this.overlaySceneKey = null;
      if (this.onOverlayClosed) {
        const t = this.onOverlayClosed;
        this.onOverlayClosed = null;
        setTimeout(t, 100);
      }
    }
  }

  showRotate(key) {
    if (!this.sceneManager.isActive(key)) {
      const pause = this.overlaySceneKey ? this.overlaySceneKey : this.currentSceneKey;
      this.pauseScene(pause);
      this.startScene(key, {});
    }
  }

  removeRotate(key) {
    if (this.sceneManager.isActive(key)) {
      this.stopScene(key, {});
      const resume = this.overlaySceneKey ? this.overlaySceneKey : this.currentSceneKey;
      this.resumeScene(resume);
    }
  }
}
