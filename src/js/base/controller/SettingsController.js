import EventEmitter from 'eventemitter3';
import Settings from '../model/Settings';
import { SETTINGS_CHANGED } from '../constants/Events';

export default class SettingsController extends EventEmitter {
  constructor({ game }) {
    super();

    this.game = game;
    this.model = new Settings();
    this.gameData = {};
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
    this.emit(SETTINGS_CHANGED);
  }

  set sfx(sfx) {
    this.model._sfx = sfx;
    this.emit(SETTINGS_CHANGED);
  }

  set music(music) {
    this.model._music = music;
    this.emit(SETTINGS_CHANGED);
  }

  set vo(vo) {
    this.model._vo = vo;
    this.emit(SETTINGS_CHANGED);
  }

  set buttonAudio(buttonAudio) {
    this.model._buttonAudio = buttonAudio;
    this.emit(SETTINGS_CHANGED);
  }

  set motion(motion) {
    this.model._motion = motion;
    this.emit(SETTINGS_CHANGED);
  }

  set captions(captions) {
    this.model._captions = captions;
    this.emit(SETTINGS_CHANGED);
  }

  getGameData() {
    return this.gameData;
  }

  setTouchLocked(value) {
    this._touchLocked = value;
  }
}
