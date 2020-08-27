import ConfigModel from 'base/model/ConfigModel';
import UIModel from 'base/model/UIModel';
import CopyModel from 'base/model/CopyModel';
import ShortcutsModel from 'base/model/ShortcutsModel';
import Shortcuts, { ShortcutStub } from 'base/shortcuts/Shortcuts';
import SceneController from 'base/controller/SceneController';
import { VIEWPORT_EVENTS } from './ViewportController';

class GameController {
  constructor({ game, gameMode, shortcutsEnabled = false }) {
    this.game = game;
    this.sceneController = new SceneController(game.scene);
    this.gameMode = gameMode;
    this.shortcutsEnabled = shortcutsEnabled;
    this.gamePaused = false;
  }

  init() {
    const appConfig = this.game.cache.json.get('app_config');
    const uiConfig = this.game.cache.json.get('ui_config');
    this.config = new ConfigModel({ config: appConfig });
    this.uiModel = new UIModel({ config: uiConfig, settings: this.settings });
    this.copyModel = new CopyModel({ xml: this.game.cache.xml.get('copy_xml') });
    this.addShortcuts();
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
  addShortcuts() {
    this.shortcutsModel = new ShortcutsModel();
    if (this.shortcutsEnabled) {
      this.shortcuts = new Shortcuts(this.game, { model: this.shortcutsModel, isVisible: true });
      this.shortcuts.create();
    } else {
      this.shortcuts = new ShortcutStub();
    }
  }

  updateShortcuts({ prop, value }) {
    if (this.shortcutsEnabled) {
      this.shortcutsModel[prop] = value;
      this.shortcuts.update();
    }
  }
}

export default GameController;
