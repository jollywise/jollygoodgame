// import { UIModel } from '../model/UIModel';
import { CopyModel } from '../model/CopyModel';
import { VIEWPORT_EVENTS } from '../constants/Events';

export class GameControllerBase {
  constructor({ game, gameMode }) {
    this.game = game;
    this.saves = this.game.saves;
    this.settings = this.game.settings;
    this.gameMode = gameMode;
    this.gamePaused = false;
  }

  setSceneController(sceneController) {
    this.sceneController = sceneController;
  }

  // try to open external settings, if it fails we will need to show our own settings page
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
}
