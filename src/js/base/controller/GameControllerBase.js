import ConfigModel from 'base/model/ConfigModel';
import UIModel from 'base/model/UIModel';
import CopyModel from 'base/model/CopyModel';
import ShortcutsStub from 'base/shortcuts/ShortcutsStub';
import { VIEWPORT_EVENTS } from 'base/constants/Events'

export class GameControllerBase {
  constructor({ game, gameMode }) {
    this.game = game;
    this.gameMode = gameMode;
    this.gamePaused = false;
  }

  addSceneController(sceneController) {
    this.sceneController = sceneController
  }

  assetsLoaded() {
    console.log('GameControllerBase.assetsLoaded');
    const appConfig = this.game.cache.json.get('app_config');
    const uiConfig = this.game.cache.json.get('ui_config');
    this.config = new ConfigModel({ config: appConfig });
    this.uiModel = new UIModel({ config: uiConfig, settings: this.settings });
    this.copyModel = new CopyModel({ xml: this.game.cache.xml.get('copy_xml') });
    this.game.viewportController.on(VIEWPORT_EVENTS.UPDATED, this.handleViewportUpdated, this);
    this.game.viewportController.updateViewport();
  }

  handleViewportUpdated(viewport) {
    if (!viewport.landscape) {
      this.sceneController.showRotate();
    } else {
      this.sceneController.removeRotate();
    }
  }

  pauseGame() {}

  resumeGame() {}

  /*
  ====================================================================================================
  SHORTCUTS
  ====================================================================================================
  */
  addShortcuts(shortcuts) {
    this.shortcuts = shortcuts || new ShortcutsStub();
    this.shortcuts.create();
  }

  updateShortcuts({ prop, value }) {
    if (this.shortcuts) {
      this.shortcuts.model[prop] = value;
      this.shortcuts.update();
    }
  }
}
