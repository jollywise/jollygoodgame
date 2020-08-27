export class SceneControllerBase {
  constructor(sceneManager) {
    this.sceneManager = sceneManager;
    this.onOverlayClosed = null;
  }

  init(sceneMap) {
    this.currentSceneKey = null;
    sceneMap.map(({ key, state }) => {
      if (!this.sceneManager.keys[key]) {
        this.sceneManager.add(key, state);
        const scene = this.sceneManager.getScene(key);
        scene && scene.setVisible(true);
        console.log('Add scene ', key, scene);
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
}

