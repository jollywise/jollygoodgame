/**
 * @class components.SceneControllerBase
 * @description A scene controller for managing scenes used in game.
 * <br>
 * This controller provides easy ability to add scenes, as well as control which scenes are active and trigger overlays.
 */
class SceneControllerPlugin extends Phaser.Plugins.BasePlugin {
  constructor(pluginManager) {
    super(pluginManager);
    this.currentSceneKey = null;
    this.paused = false;
  }

  get sceneManager() {
    return this.game.scene;
  }

  /**
   *
   * @description Add a scene map to the controller. <br>The controller will parse each scene in the map and add them to phasers scene manager.
   * @param {Object} sceneMap A scene map to add to the controller key/scene dictionary
   * @example
   *
   * // state = imported Phaser.Scenes.Scene class
   *
   * const SCENE_MAP = [
   *  { key: 'Welcome', state: Welcome },
   *  { key: 'Complete', state: Complete },
   *  { key: 'HowToPlay', state: HowToPlay },
   *  { key: 'GamePlay', state: GamePlay },
   * ];
   *
   * sceneController.addSceneMap(SCENE_MAP);
   *
   */

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

  /**
   * @returns {Phaser.Scenes.Scene}
   * @description returns the current active scene
   *
   */

  getCurrentScene() {
    return this.sceneManager.getScene(this.currentSceneKey);
  }

  /**
   *
   * @param {string} id scene key - should match a key provided in the {@link addSceneMap | Scene Map}
   * @returns {Phaser.Scenes.Scene} the requested scene
   * @description request a specific scene from the manager.
   *
   */

  getScene(id) {
    return this.sceneManager.getScene(id);
  }

  /**
   *
   * @param {bool=} isActive return all scenes or active ones only
   * @returns {Phaser.Scenes.Scene[]} an array of all scenes found
   * @description Get all active scenes, if isActive is set to false, the it will return every scene added in the game
   *
   */

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

  /**
   *
   * @param {string} sceneKey The key of the scene to start, should match a key provided in the Scene Map.
   * @param {Object} data Data that will be passed through to the scenes init method whenn starting.
   * @description Switch game scenes, this will stop the current active scene and start the requested scene. <br>The new scene will automatically be brought to the top of the scene display list.
   *
   */

  switchScene(sceneKey, data) {
    // console.log('switchScene', sceneKey);
    if (this.currentSceneKey) {
      this.stopScene(this.currentSceneKey);
    }
    this.currentSceneKey = sceneKey;
    this.startScene(this.currentSceneKey, data);
    if (this.paused) {
      this.pauseScene(this.currentSceneKey);
    }
  }

  /**
   *
   * @param {string} scene The key of the scene to be started, should match a key in the Scene Map.
   * @param {Object} data Data that will be passed through to the scenes init method when starting.
   * @description Start a scene. Usually you would use switchScene instead how-ever this can be called directly to start a particular scene.<br>
   * Calling this directly will not stop and current active scenes.
   *
   */

  startScene(scene, data) {
    this.sceneManager.start(scene, data);
    this.sceneManager.getScene(scene).scene.setVisible(true);
    this.sceneManager.bringToTop(scene);
  }

  /**
   *
   * @param {string} scene The key of the scene to be stopped, should match a key in the Scene Map.
   * @description Will stop the requested scene from running, it is not destroyed and can be restarted again if desired.
   *
   */

  stopScene(scene) {
    this.sceneManager.stop(scene);
    this.sceneManager.getScene(scene).scene.setVisible(false);
  }

  /**
   *
   * @param {string} scene The key of the scene to be paused, should match a key in the Scene Map.
   * @description pause a desired scene
   *
   */

  pauseScene(scene) {
    this.sceneManager.pause(scene);
  }

  /**
   *
   * @param {string} scene The key of the scene to be paused, should match a key in the Scene Map.
   * @description resume a desired scene
   *
   */

  resumeScene(scene) {
    this.sceneManager.resume(scene);
    this.sceneManager.bringToTop(scene);
  }

  /**
   *
   * @param {string} sceneKey The key of the scene to be obverlayed, should match a key in the Scene Map.
   * @param {Object} data  Data that will be passed through to the scenes init method when starting. <br>Also accepts a callback for onOverlayCLosed which will be called when the overlay is closed of provided.
   * @description Show a scene as an overlay. This will pause the current active scene and display the requested scene over the top
   *
   */

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

  /**
   *
   * @description Close the current overlay and resume the current active scene.
   *
   */

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

  /**
   *
   *  @description quick pause current scene or overlay.
   *
   */

  pause() {
    this.paused = true;
    this.pauseScene('soundController');
    this.pauseScene(this.overlaySceneKey ? this.overlaySceneKey : this.currentSceneKey);
  }

  /**
   *
   * @description quick resume current scxene or overlay.
   *
   */

  resume() {
    this.paused = false;
    this.resumeScene('soundController');
    this.resumeScene(this.overlaySceneKey ? this.overlaySceneKey : this.currentSceneKey);
  }
}

export { SceneControllerPlugin };
