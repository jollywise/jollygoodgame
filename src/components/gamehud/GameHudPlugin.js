import { ButtonSimple, VIEWPORT_EVENTS } from '@jollywise/jollygoodgame';
import { GameHudButtonGroup } from './GameHudButtonGroup';

const STATE_EMPTY = { modal: false, buttons: [] };
/**
 *
 * @alias components.GameHudPlugin
 * @classdesc A GameHud component that displays UI buttons
 * @todo write documentation
 * @todo add ability to add UI buttons on the fly
 * @todo add ability to add UI graphics
 */
class GameHudPlugin extends Phaser.Plugins.BasePlugin {
  constructor(pluginManager) {
    super(pluginManager);

    this._state = false;
    this._hudscene = false;
    this._hudConfig = {};
    this._stateButtons = {};
    this._buttonGroups = {};
    this._savedStates = [];
    this._events = new Phaser.Events.EventEmitter();
  }

  // =============================================================================================
  // SETUP
  // =============================================================================================

  init(config) {
    this.setHudConfig(config);
    this.game.scene.add('Hud', {}, true);
  }

  start() {
    this.game.viewportController.on(VIEWPORT_EVENTS.UPDATED, this.updatePosition, this);
  }

  setHudConfig(config) {
    this._hudConfig = config || {};
  }

  get defaultButton() {
    return this._hudConfig.defaultButton ? this._hudConfig.defaultButton : ButtonSimple;
  }

  // =============================================================================================
  // GETTERS
  // =============================================================================================

  get scene() {
    if (!this._hudscene) {
      this._hudscene = this.game.scene.getScene('Hud');
    }
    return this._hudscene;
  }

  get events() {
    return this._events;
  }

  // =============================================================================================
  // HUD STATE
  // =============================================================================================

  setState(stateid, save = true) {
    if (!this._hudConfig) {
      console.warn('[HudPlugin] attempting to set state before adding config');
      return;
    }

    if (save && this._state) {
      this.addToHistory(this._state);
    }

    this._clearCurrentState();
    const stateconfig = stateid === 'EMPTY' ? STATE_EMPTY : this._hudConfig.states[stateid];
    if (stateconfig) {
      this._state = { id: stateid };
      console.log('stateconfig.modal', stateconfig.modal);
      this.showModal(stateconfig.modal);
      this._createStateButtons(stateconfig.buttons);
    }
    this.scene.scene.bringToTop();
    this.updatePosition();
  }

  setEmptyState() {
    this.showModal(false);
    this.setState('EMPTY');
  }

  resumePreviousState() {
    const state = this._retrievePreviousState();
    this.setState(state.id, false);
  }

  _retrievePreviousState() {
    const state = this._savedStates.pop();
    return state || false;
  }

  _clearCurrentState() {
    this.showModal(false);
    this._clearStateButtons();
  }

  // =============================================================================================
  // HISTORY
  // =============================================================================================

  addToHistory(state) {
    if (state) {
      this._savedStates.push(state);
    }
  }

  // =============================================================================================
  // BUTTONS
  // =============================================================================================

  _createStateButtons(buttons) {
    let btnConfig;
    for (let i = 0; i < buttons.length; i++) {
      btnConfig = { ...this._hudConfig.buttons[buttons[i]] };
      this._createStateButton(btnConfig);
    }
  }

  _createStateButton(config) {
    // button already exists
    if (this._stateButtons[config.id]) return false;
    // initialize button
    let btn;
    if (config.classname) {
      btn = new config.classname(this.scene, config);
    } else if (config.buttonClass) {
      btn = new config.buttonClass(this.scene, config);
    } else {
      btn = new this.defaultButton(this.scene, config);
    }

    btn.on('click', this._handleButtonInteraction, this);
    this.scene.add.existing(btn);

    // add button to group if desired
    if (config.buttongroup) {
      this._addToButtonGroup(btn, config.buttongroup);
    }

    // register button
    this._stateButtons[config.id] = btn;
  }

  _clearStateButtons() {
    Object.keys(this._stateButtons).forEach((key) => {
      this._stateButtons[key].destroy();
      this._stateButtons[key] = null;
    });
    Object.keys(this._buttonGroups).forEach((key) => {
      this._buttonGroups[key].clearButtons();
    });
    this._stateButtons = {};
  }

  _handleButtonInteraction(e) {
    const btn = this._stateButtons[e.id];
    if (btn.event) {
      this.events.emit(btn.event);
    }
    this.events.emit('BUTTON_SELECT', e.id);
  }

  /*
  =========================================================================================================
  BUTTON GROUPS
  =========================================================================================================
  */

  _addToButtonGroup(btn, groupid) {
    const group = this._getButtonGroup(groupid);
    if (group) {
      group.addButton(btn);
    }
  }

  _getButtonGroup(id) {
    if (!this._buttonGroups[id]) {
      this._createButtonGroup(id);
    }
    return this._buttonGroups[id];
  }

  _createButtonGroup(id) {
    if (!this._buttonGroups[id]) {
      const groupdata = this._hudConfig.buttongroups[id];
      this._buttonGroups[id] = new GameHudButtonGroup(this.scene, {
        positiondata: { ...groupdata },
        viewport: this.game.viewportController,
      });
    }
  }

  // =============================================================================================
  // MODAL
  // =============================================================================================

  // public
  showModal(value) {
    if (value) this._addModal();
    else this._removeModal();
  }

  // private
  _addModal() {
    if (!this._modal) {
      console.log('ADD MODAL');
      const { width, height } = this.game.scale;
      const { colour = 0x000000, alpha = 0.75 } = this._hudConfig.modal || {};
      this._modal = this.scene.add.rectangle(0, 0, width, height, colour, alpha);
      this._modal.setOrigin(0);
      this.scene.children.sendToBack(this._modal);
    }
  }
  _removeModal() {
    if (this._modal) {
      this._modal.destroy();
      this._modal = null;
    }
  }

  // =============================================================================================
  // RESPONSIVENESS
  // =============================================================================================

  updatePosition() {
    Object.keys(this._buttonGroups).forEach((key) => {
      this._buttonGroups[key].updatePosition(this.game.viewportController);
    });
  }
}

export { GameHudPlugin };
