// import { UIModel } from '../model/UIModel';
import { CopyModel } from '../model/CopyModel';
import { VIEWPORT_EVENTS } from '../constants/Events';

export class GameControllerBase {
  constructor({ game, forceRotation = 'landscape' }) {
    this.game = game;
    this.saves = this.game.saves;
    this.settings = this.game.settings;
    this.forceRotation = forceRotation;
    this.gamePaused = false;
    this.rotatePaused = false;
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
    const rotationOK =
      this.forceRotation === 'landscape'
        ? viewport.width < viewport.height
        : this.forceRotation === 'portrait'
        ? viewport.width > viewport.height
        : true;
    if (!rotationOK) {
      console.log('Pausing due to unsupported rotation');
      this.rotatePaused = true;
      this.pauseGame();
    } else if (this.rotatePaused) {
      console.log('Resuming due to rotation');
      this.rotatePaused = false;
      this.resumeGame();
    }
  }

  pauseGame() {
    if (this.gamePaused) {
      return;
    }
    this.gamePaused = true;
    if (this.sceneController) {
      this.sceneController.pauseCurrentScene();
    }
    this.game.sound.pauseAll();
    this.onGamePaused();
  }

  resumeGame() {
    // can't override rotation paused state
    if (!this.gamePaused || this.rotatePaused) {
      return;
    }
    this.gamePaused = false;
    if (this.sceneController) {
      this.sceneController.resumeCurrentScene();
    }
    this.game.sound.resumeAll();
    this.onGameResumed();
  }

  onGamePaused() {}

  onGameResumed() {}
}
