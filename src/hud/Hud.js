import { SceneBase, ButtonSimple, ButtonSound } from '@jollywise/jollygoodgame';
import { HUD_CONFIG } from './HudConfig';
import HudButtonGroup from './HudButtonGroup';
import { HudEventMapBase, HudEventMapConfigBase } from './HudEventMapBase';

export const HUD_EVENTS = {
  BUTTON_SELECT: 'BUTTON_SELECT',
  HUD_ACTION: 'HUD_ACTION',
};

export class Hud extends SceneBase {
  constructor() {
    super({ key: 'Hud', active: true });
  }

  init(config) {
    this._hudConfig = {};
    for (const key in HUD_CONFIG) {
      if (HUD_CONFIG.hasOwnProperty(key)) {
        if (config && config[key]) {
          this._hudConfig[key] = { ...HUD_CONFIG[key], ...config[key] };
        } else {
          this._hudConfig[key] = { ...HUD_CONFIG[key] };
        }
      }
    }

    this._savedStates = [];
    this._state = false;
    this._stateButtons = {};
    this._buttonGroups = {};
  }

  addEventMap(controller, mapConfig = HudEventMapConfigBase) {
    this.hudEventMap = new HudEventMapBase(this, controller, mapConfig);
  }

  /*
  =========================================================================================================
   STATE MANAGEMENT
  =========================================================================================================
  */

  setState(hudid, save = true) {
    // rab state config
    const data = this._hudConfig.states[hudid];

    if (save && this._state) {
      this.addToHistory(this._state);
    }

    // clear current state
    this.clearCurrentState();

    // if state data exists
    if (data) {
      this._state = hudid;

      this.showModalBackground(data.modal);

      // create buttons
      this.createStateButtons(data.buttons);

      this.scene.bringToTop();
    }
  }

  addToHistory(state) {
    if (state) {
      this._savedStates.push(state);
    }
  }

  resumePreviousState() {
    const state = this.retrievePreviousState();
    this.setState(state, false);
  }

  retrievePreviousState() {
    const state = this._savedStates.pop();
    return state || false;
  }

  clearCurrentState() {
    this.state = false;
    this.clearStateButtons();
  }

  /*
  =========================================================================================================
   MODAL MANAGEMENT
  =========================================================================================================
  */

  createModalBackground() {
    if (!this._modalBackground) {
      this._modalBackground = this.add.graphics();
      this._modalBackground.fillStyle(0x000000, 0.5);
      this._modalBackground.fillRect(0, 0, 1680, 720);
      this._modalBackground.setScrollFactor(0);
      this.children.sendToBack(this._modalBackground);
    }
  }

  showModalBackground(value) {
    if (!this._modalBackground) {
      this.createModalBackground();
    }
    this.add.existing(this._modalBackground);
    this._modalBackground.visible = value;
    this.children.sendToBack(this._modalBackground);
  }

  clearModalBackground() {
    if (this._modalBackground) {
      this._modalBackground.destroy();
      this._modalBackground = null;
    }
  }

  /*
  =========================================================================================================
   BUTTON MANAGEMENT
  =========================================================================================================
  */

  createStateButtons(buttons) {
    let btnConfig;
    for (let i = 0; i < buttons.length; i++) {
      btnConfig = { ...this._hudConfig.buttons[buttons[i]] };
      this.createStateButton(btnConfig);
    }
  }

  createStateButton(config, overwrite = false) {
    // button already exists
    if (this._stateButtons[config.id]) {
      if (overwrite) {
        // overwrite is enable, destroy current button
        this.removeStateButton(config.id);
      } else {
        // overwrite is disabled, return
        return false;
      }
    }

    let btn;
    switch (config.id) {
      case 'btn_sound':
        btn = new ButtonSound(this, config);
        break;
      default:
        btn = new ButtonSimple(this, config);
    }

    // create button
    // const btn = new ButtonSimple(this, config);
    btn.on('click', this.handleButtonInteraction, this);
    this.add.existing(btn);

    // add button to group if desired
    if (config.buttongroup) {
      this.addToButtonGroup(btn, config.buttongroup);
    }

    // register button
    this._stateButtons[config.id] = btn;
  }

  clearStateButtons() {
    for (const key in this._stateButtons) {
      if (this._stateButtons.hasOwnProperty(key)) {
        this._stateButtons[key].destroy();
      }
    }
    for (const key in this._buttonGroups) {
      if (this._buttonGroups.hasOwnProperty(key)) {
        this._buttonGroups[key].clearButtons();
      }
    }
    this._stateButtons = {};
  }

  clearStateButton(buttonid) {
    if (this._stateButtons[buttonid]) {
      for (const key in this._buttonGroups) {
        if (this._buttonGroups.hasOwnProperty(key)) {
          this._buttonGroups[key].removeButton(this._stateButtons[buttonid]);
        }
      }
      this._stateButtons[buttonid].destroy();
      delete this._stateButtons[buttonid];
    }
  }

  /*
  =========================================================================================================
  BUTTON GROUPS
  =========================================================================================================
  */

  addToButtonGroup(btn, groupid) {
    const group = this.getButtonGroup(groupid);
    if (group) {
      group.addButton(btn);
    }
  }

  getButtonGroup(id) {
    if (!this._buttonGroups[id]) {
      this.createButtonGroup(id);
    }
    return this._buttonGroups[id];
  }

  createButtonGroup(id) {
    if (!this._buttonGroups[id]) {
      const groupdata = this._hudConfig.buttongroups[id];
      this._buttonGroups[id] = new HudButtonGroup(this, {
        positiondata: { ...groupdata },
        viewport: this.game.viewportController,
      });
    }
  }

  /*
  =========================================================================================================
   USER INTERACTION
  =========================================================================================================
  */

  handleButtonInteraction(e) {
    const btn = this._stateButtons[e.id];
    if (btn.event) {
      this.events.emit(btn.event);
    }
    this.events.emit(HUD_EVENTS.BUTTON_SELECT, e.id);
  }

  /*
  =========================================================================================================
    CLEAN UP
  =========================================================================================================
  */

  shutdown() {
    this._hudConfig = null;
    this.clearModalBackground();
    this.clearStateButtons();
    super.shutdown();
  }
}
