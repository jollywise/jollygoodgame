import EventEmitter from 'eventemitter3';
import { SettingsModel } from './SettingsModel';
import { SETTINGS_EVENTS } from '../constants/Events';

export class SettingsBase extends EventEmitter {
  constructor({ game }) {
    super();
    this.game = game;
    this.model = new SettingsModel();
    this._plugin = null;
  }

  get plugin() {
    return this._plugin;
  }

  set plugin(plugin) {
    if (this._plugin) {
      this._plugin.off(SETTINGS_EVENTS.CHANGED, this.onSettingsChanged, this);
      this._plugin.off(SETTINGS_EVENTS.CLOSED, this.onSettingsClosed, this);
    }
    this._plugin = plugin;
    this._plugin.on(SETTINGS_EVENTS.CHANGED, this.onSettingsChanged, this);
    this._plugin.on(SETTINGS_EVENTS.CLOSED, this.onSettingsClosed, this);
  }

  get audio() {
    return this.model._audio;
  }

  get sfx() {
    return this.model._audio && this.model._sfx;
  }

  get music() {
    return this.model._audio && this.model._music;
  }

  get vo() {
    return this.model._audio && this.model._vo;
  }

  get buttonAudio() {
    return this.model._audio && this.model._buttonAudio;
  }

  get motion() {
    return this.model._motion;
  }

  get captions() {
    return this.model._captions;
  }

  set audio(audio) {
    this.model._audio = audio;
    if (this._plugin) {
      this._plugin.audio = audio;
    }
    this.emit(SETTINGS_EVENTS.CHANGED);
    this.emit(SETTINGS_EVENTS.AUDIO_CHANGED);
  }

  set sfx(sfx) {
    this.model._sfx = sfx;
    if (this._plugin) {
      this._plugin.sfx = sfx;
    }
    this.emit(SETTINGS_EVENTS.CHANGED);
    this.emit(SETTINGS_EVENTS.AUDIO_CHANGED);
  }

  set music(music) {
    this.model._music = music;
    if (this._plugin) {
      this._plugin.music = music;
    }
    this.emit(SETTINGS_EVENTS.CHANGED);
    this.emit(SETTINGS_EVENTS.AUDIO_CHANGED);
  }

  set vo(vo) {
    this.model._vo = vo;
    if (this._plugin) {
      this._plugin.vo = vo;
    }
    this.emit(SETTINGS_EVENTS.CHANGED);
    this.emit(SETTINGS_EVENTS.AUDIO_CHANGED);
  }

  set buttonAudio(buttonAudio) {
    this.model._buttonAudio = buttonAudio;
    if (this._plugin) {
      this._plugin.buttonAudio = buttonAudio;
    }
    this.emit(SETTINGS_EVENTS.CHANGED);
    this.emit(SETTINGS_EVENTS.AUDIO_CHANGED);
  }

  set motion(motion) {
    this.model._motion = motion;
    if (this._plugin) {
      this._plugin.motion = motion;
    }
    this.emit(SETTINGS_EVENTS.CHANGED);
  }

  set captions(captions) {
    this.model._captions = captions;
    if (this._plugin) {
      this._plugin.captions = captions;
    }
    this.emit(SETTINGS_EVENTS.CHANGED);
  }

  onSettingsChanged({ key, value }) {
    switch (key) {
      case 'audio':
        this.audio = value;
        break;
      case 'sfx':
        this.sfx = value;
        break;
      case 'music':
        this.music = value;
        break;
      case 'vo':
        this.vo = value;
        break;
      case 'buttonAudio':
        this.buttonAudio = value;
        break;
      case 'motion':
        this.motion = value;
        break;
      case 'captions':
        this.captions = value;
        break;
      default:
        console.warn('Unknown setting changed', key, value);
        break;
    }
  }

  onSettingsClosed() {
    this.emit(SETTINGS_EVENTS.CLOSED);
  }

  // return true if the settings is opened by the plugin, if false then show internal settings page
  showSettings() {
    if (this._plugin) {
      return this._plugin.showSettings() || false;
    }
    return false;
  }
}
