import { SETTINGS_EVENTS } from '@jollywise/jollygoodgame';
import * as dat from 'dat.gui';

export class SettingsPlugin extends Phaser.Plugins.BasePlugin {
  constructor(scene, pluginManager) {
    super(scene, pluginManager);
    this._model = {
      audio: true,
      vo: true,
      sfx: true,
      music: true,
      motion: true,
      captions: false,
    };
    this._events = new Phaser.Events.EventEmitter();
    this._loadSettings();
  }

  on(event, callback, scope) {
    this._events.on(event, callback, scope);
  }

  off(event, callback, scope) {
    this._events.off(event, callback, scope);
  }

  once(event, callback, scope) {
    this._events.once(event, callback, scope);
  }

  get events() {
    return this._events;
  }

  get audio() {
    return this.getSettingValue('audio');
  }
  set audio(value) {
    this.setSettingValue('audio', value);
    this.events.emit(SETTINGS_EVENTS.AUDIO_CHANGED);
  }
  get vo() {
    return this.getSettingValue('vo');
  }
  set vo(value) {
    this.setSettingValue('vo', value);
    this._events.emit(SETTINGS_EVENTS.AUDIO_CHANGED);
  }
  get sfx() {
    return this.getSettingValue('sfx');
  }
  set sfx(value) {
    this.setSettingValue('sfx', value);
    this.events.emit(SETTINGS_EVENTS.AUDIO_CHANGED);
  }
  get music() {
    return this.getSettingValue('music');
  }
  set music(value) {
    this.setSettingValue('music', value);
    this.events.emit(SETTINGS_EVENTS.AUDIO_CHANGED);
  }
  get motion() {
    return this.getSettingValue('motion');
  }
  set motion(value) {
    this.setSettingValue('motion', value);
  }
  get captions() {
    return this.getSettingValue('captions');
  }
  set captions(value) {
    this.setSettingValue('captions', value);
  }

  getSettingValue(settingid) {
    return this._model[settingid];
  }

  setSettingValue(settingid, value) {
    this._model[settingid] = value;
    this._events.emit(SETTINGS_EVENTS.CHANGED, { setting: settingid, value });
    this._saveSettings();
  }

  getAllSettings() {
    return this._model;
  }

  showSettings() {
    this.createTempGUI();
    this.gui.open();
    this.gui.show();
  }

  closeSettings() {
    this.gui.close();
    this.gui.hide();
  }

  createTempGUI() {
    if (!this.gui) {
      this.gui = new dat.GUI({
        name: 'Settings',
        closed: false,
        autoPlace: false,
        closeOnTop: false,
      });
      this.gui.domElement.addEventListener('click', () => {
        if (this.gui.closed) {
          this.gui.hide();
        }
      });
      this.gui.domElement.id = 'settings-gui';
      this.gui.domElement.style.position = 'absolute';
      this.gui.domElement.style.top = 0;
      this.gui.domElement.style.right = 0;
      this.game.scale.parent.appendChild(this.gui.domElement);
      Object.keys(this._model).forEach((key) => {
        this.gui
          .add(this._model, key)
          .name(key)
          .onChange((e) => {
            this.setSettingValue(key, e);
          });
      });
    }
  }

  _saveSettings() {
    localStorage.setItem('jggsettings', JSON.stringify(this._model));
  }

  _loadSettings() {
    let stored = localStorage.getItem('jggsettings');
    if (stored) {
      stored = JSON.parse(stored);
      Object.keys(this._model).forEach((key) => {
        if (stored.hasOwnProperty(key)) {
          this._model[key] = stored[key];
        }
      });
    }
  }

  destroy() {
    this._events.destroy();
    this._events = null;
    this._model = null;
  }
}
