import EventEmitter from 'eventemitter3';
import { SettingsModel } from './SettingsModel';
import { SETTINGS_EVENTS } from '../constants/Events';

/*
 * Moved this from controller/SettingsControllerBase
 * It looks more like PBS settings
 * Added a BBC specific implementation into jjg-bbc
 *
 * Perhaps we need a basic implementation with no bbc/pbs stuff for a game not using the extenions?
 */
export class SettingsBase extends EventEmitter {
  constructor({ game }) {
    super();
    this.game = game;
    this.model = new SettingsModel();
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
    this.emit(SETTINGS_EVENTS.CHANGED);
    this.game.soundController.handleAudioChanged();
  }

  set sfx(sfx) {
    this.model._sfx = sfx;
    this.emit(SETTINGS_EVENTS.CHANGED);
    this.game.soundController.handleAudioChanged();
  }

  set music(music) {
    this.model._music = music;
    this.emit(SETTINGS_EVENTS.CHANGED);
    this.game.soundController.handleAudioChanged();
  }

  set vo(vo) {
    this.model._vo = vo;
    this.emit(SETTINGS_EVENTS.CHANGED);
    this.game.soundController.handleAudioChanged();
  }

  set buttonAudio(buttonAudio) {
    this.model._buttonAudio = buttonAudio;
    this.emit(SETTINGS_EVENTS.CHANGED);
    this.game.soundController.handleAudioChanged();
  }

  set motion(motion) {
    this.model._motion = motion;
    this.emit(SETTINGS_EVENTS.CHANGED);
  }

  set captions(captions) {
    this.model._captions = captions;
    this.emit(SETTINGS_EVENTS.CHANGED);
  }

  getGameData() {
    return this.gameData;
  }

  setTouchLocked(value) {
    this._touchLocked = value;
  }
}
