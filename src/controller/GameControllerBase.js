// import { UIModel } from '../model/UIModel';
import { CopyModel } from '../model/CopyModel';
import { VIEWPORT_EVENTS } from '../constants/Events';

export class GameControllerBase {
  constructor({ game, forceRotation = 'landscape' }) {
    this.game = game;
    this.saves = this.game.saves;
    this.settings = this.game.settings;
    this.forceRotation = forceRotation;
    this.paused = false;
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
        ? viewport.width > viewport.height
        : this.forceRotation === 'portrait'
        ? viewport.width < viewport.height
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
    if (this.paused) {
      return;
    }
    this.paused = true;
    this.game.scene.pause('soundController');
    if (this.sceneController) {
      this.sceneController.pause();
    }
    this.onPaused();
  }

  resumeGame() {
    // can't override rotation paused state
    if (!this.paused || this.rotatePaused) {
      return;
    }
    this.paused = false;
    this.game.scene.resume('soundController');
    if (this.sceneController) {
      this.sceneController.resume();
    }
    this.onResumed();
  }

  onPaused() {}

  onResumed() {}

  exitGame() {}

  returnHome() {}
}
