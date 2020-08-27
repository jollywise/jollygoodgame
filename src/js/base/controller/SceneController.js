import { KEYS } from 'base/constants/SceneConstants';

class SceneController {
  constructor(sceneManager) {
    this.sceneManager = sceneManager;
    this.onOverlayClosed = null;
  }

  init(sceneMap) {
    this.currentSceneKey = null;
    sceneMap.map(({ key, state }) => {
      if (!this.sceneManager.keys[key]) {
        this.sceneManager.add(key, state);
        this.sceneManager.getScene(key).scene.setVisible(true);
      }
    });
  }

  reset() {
    this.currentSceneKey = null;
    this.onOverlayClosed = null;
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

  showOverlayScene(sceneKey, { data, onOverlayClosed = null } = {}) {
    console.log('showOverlayScene', sceneKey, onOverlayClosed);
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

  switchScene(sceneKey, { data } = {}) {
    // console.log('switchScene', sceneKey);
    if (this.overlaySceneKey) {
      this.removeOverlayScene({});
    }

    if (this.currentSceneKey) {
      this.stopScene(this.currentSceneKey);
    }
    this.currentSceneKey = sceneKey;
    this.startScene(this.currentSceneKey, { data });
  }

  showRotate() {
    if (!this.sceneManager.isActive(KEYS.Rotate)) {
      const pause = this.overlaySceneKey ? this.overlaySceneKey : this.currentSceneKey;
      this.pauseScene(pause);
      this.startScene(KEYS.Rotate, {});
    }
  }

  removeRotate() {
    if (this.sceneManager.isActive(KEYS.Rotate)) {
      this.stopScene(KEYS.Rotate, {});
      const resume = this.overlaySceneKey ? this.overlaySceneKey : this.currentSceneKey;
      this.resumeScene(resume);
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
}

export default SceneController;
