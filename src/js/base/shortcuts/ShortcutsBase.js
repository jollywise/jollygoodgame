import * as dat from 'dat.gui';
import { ShortcutTriggers } from 'base/shortcuts/ShortcutTriggers';

const TRIGGER = '↑ ↑ ↓ ↓ ← →';

export class ShortcutsBase {
  constructor(game, { model: shortcutsModel, isVisible: isVisible = false }) {
    this.game = game;
    this.model = shortcutsModel;

    this.gameSettings = null;
    this.saveSettings = null;
    this.levelSettings = null;

    this.saveControl = null;

    this.boundClearSaves = this.clearSaves.bind(this);

    this.boundToggle = this.toggleDisplay.bind(this);

    this.isVisible = isVisible;

    this.trigger = new ShortcutTriggers({
      sequence: TRIGGER,
      onComplete: this.boundToggle,
      onFail: (val) => {
        console.log('FAIL', val);
      },
    });
  }

  toggleDisplay() {
    this.isVisible ? this.hide() : this.show();
  }

  open() {
    this.gui.open();
  }

  close() {
    this.gui.close();
  }

  show() {
    this.isVisible = true;
    this.gui.show();
  }

  hide() {
    this.isVisible = false;
    this.gui.hide();
  }

  clearSaves() {
    if (this.game.controller.saves) {
      this.game.controller.saves.deleteSaves();
    }
  }

  setVisible() {
    this.isVisible ? this.show() : this.hide();
  }

  /*
  =========================================================================================================
    GAME
  =========================================================================================================
  */
  createGameSettings() {
    this.gameSettings = this.gui.addFolder('Game Settings');

    this.gameSettings.open();
  }

  /*
  =========================================================================================================
    SAVE
  =========================================================================================================
  */
  createSaveSettings() {
    this.saveSettings = this.gui.addFolder('Saved Data');
    this.saveControl = this.saveSettings
      .add(this.model, 'clearPlayerSaves')
      .name('Clear Saves')
      .onChange(this.boundClearSaves);

    this.saveSettings.open();
  }

  /*
  =========================================================================================================
    API
  =========================================================================================================
  */
  create() {
    dat.GUI.TEXT_CLOSED = 'Close Shortcuts';
    dat.GUI.TEXT_OPEN = 'Open Shortcuts';
    this.gui = new dat.GUI({ name: 'Shortcuts', closed: false, autoPlace: false });
    this.gui.domElement.id = 'gui';
    this.gui.domElement.style.position = 'absolute';
    this.gui.domElement.style.top = 0;
    this.game.scale.parent.appendChild(this.gui.domElement);
    this.createGameSettings();
    this.createSaveSettings();
    this.close();
    this.setVisible();
  }

  reset() {
    this.levelSettings && this.gui.removeFolder(this.levelSettings);
    this.levelSettings = null;
    this.addItemMenu && this.gui.removeFolder(this.addItemMenu);
    this.addItemMenu = null;
  }

  cleanUp(control) {
    if (control) {
      control.remove();
      control = null;
    }
  }

  destroy() {
    this.quests = null;

    this.gui.removeFolder(this.gameSettings);
    this.gameSettings = null;

    this.cleanUp(this.saveControl);
    this.gui.removeFolder(this.saveSettings);
    this.saveSettings = null;

    this.gui.destroy();
    this.gui = null;

    this.trigger.destroy();
    this.trigger = null;
  }
}
