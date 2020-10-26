export class HudEventMapBase {
  /**
   *
   * @param {Hud} hud The Hud in which to listen for Events
   * @param {Object} controller The controller which has the methods to be called
   * @param {Object} map Map of events and buttons to listen for, and what methods to call when triggered
   *
   */
  constructor(hud, controller, map = HudEventMapConfigBase) {
    this._hud = hud;
    this._map = map;
    this._controller = controller;
    this._eventMap = this._map.events;
    this._buttonMap = this._map.buttons;
    this.enable();
  }

  _handleButtonSelect(btnid) {
    if (this._buttonMap[btnid]) {
      this._controller[this._buttonMap[btnid]].call(this._controller);
    }
  }

  /**
   * enable Hud Events, this will react to Hud Actions
   */
  enable() {
    for (const event in this._eventMap) {
      if (this._eventMap.hasOwnProperty(event)) {
        this._hud.events.on(event, this._controller[this._eventMap[event]], this._controller);
      }
    }
    this._hud.events.on('BUTTON_SELECT', this._handleButtonSelect, this);
  }

  /**
   * disable Hud Events, this will no longer react to Hud Actions
   */
  disable() {
    for (const event in this._eventMap) {
      if (this._eventMap.hasOwnProperty(event)) {
        this._hud.events.off(event, this._controller[this._eventMap[event]], this._controller);
      }
    }
    this._hud.events.off('BUTTON_SELECT', this._handleButtonSelect, this);
  }

  /**
   * destroy this, disables and nullifies
   */
  destroy() {
    this.disable();

    this._hud = null;
    this._controller = null;
    this._eventMap = null;
    this._buttonMap = null;
    this._map = null;
  }
}

export const HudEventMapConfigBase = {
  buttons: {},
  events: {
    PAUSE_GAME: 'pauseGame',
    RESUME_GAME: 'resumeGame',
    EXIT_GAME: 'exitGame',
    RETURN_HOME: 'returnHome',
    TOGGLE_SOUND: 'toggleSound',
    START_GAME: 'startGame',
    SHOW_SETTINGS: 'showSettings',
  },
};
