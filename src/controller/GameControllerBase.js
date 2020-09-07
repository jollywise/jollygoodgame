// import { UIModel } from '../model/UIModel';
import { CopyModel } from '../model/CopyModel';
import { ShortcutsStub } from '../shortcuts/ShortcutsStub';
import { VIEWPORT_EVENTS } from '../constants/Events';

export class GameControllerBase {
  constructor({ game, gameMode }) {
    this.game = game;
    this.saves = this.game.saves; // shortcut
    this.settings = this.game.settings; // shortcut
    this.gameMode = gameMode;
    this.gamePaused = false;
  }

  setSceneController(sceneController) {
    this.sceneController = sceneController;
  }

  // can return false, then show our own settings page
  showSettings() {
    return this.game.settings.showSettings();
  }

  assetsLoaded() {
    this.copyModel = new CopyModel({ xml: this.game.cache.xml.get('copy_xml') });
    this.game.viewportController.on(VIEWPORT_EVENTS.UPDATED, this.handleViewportUpdated, this);
    this.game.viewportController.updateViewport();
  }

  handleViewportUpdated(viewport) {
    viewport;
  }

  pauseGame() {}

  resumeGame() {}

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
