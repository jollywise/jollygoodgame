import storage from 'simplestorage.js';

let instance = null;

const UI_STORAGE_KEY = 'alumusic';
const GAME_STORAGE_KEY = 'alumusicGAME';

/**
 * Storage looks like:
 *
 * {
 *   dennisGAME: {
 *     slots: { slots: ['PLAYER_ONE'] },
 *     savePLAYER_ONE: { id: 'PLAYER_ONE', bestLevelTimes: [533, 433, 483] },
 *   },
 *   dennisUI: {
 *     audio: false,
 *   },
 *
 */

class Settings {
  constructor() {
    if (!instance) {
      if (!storage.canUse()) {
        console.warn('LOCAL STORAGE DISABLED');
      }
      this._loadLocalData();
      this._touchLocked = false;
      instance = this;
    }
    return instance;
  }

  destroy() {
    instance = null;
  }

  setTouchLocked(value) {
    this._touchLocked = value;
  }
  toggleAudio() {
    const state = !this.getAudio();
    return this.setAudio(state);
  }
  setAudio(value) {
    this._setAudio(value);
    return { isMuted: value === false };
  }
  getAudio() {
    return this.getAllSettings().audio;
  }
  getSubtitles() {
    return this.getAllSettings().subtitles;
  }
  toggleSubtitles() {
    this.setSubtitles(this.getSubtitles() === false);
    return this.getSubtitles();
  }
  setSubtitles(value) {
    this._setSubtitles(value);
  }
  getIsMuted() {
    if (this._touchLocked) {
      return true;
    }
    return this.getAllSettings().audio === false;
  }

  /**
   * LOCAL STORAGE API
   */
  getAllSettings() {
    const settings = JSON.parse(JSON.stringify(this.globalSettings));
    if (storage.canUse()) {
      settings.gameData = this.gameSettings;
    } else {
      console.warn('getAllSettings : storage disabled');
    }
    return settings;
  }

  getGlobalSettings() {
    return this.globalSettings;
  }

  setGameData(key, value) {
    if (storage.canUse()) {
      this.gameSettings[key] = value;
      storage.set(GAME_STORAGE_KEY, JSON.stringify(this.gameSettings));
    } else {
      console.warn('setGameData : storage disabled');
    }
  }

  /**
   * LOCAL STORAGE PRIVATE
   */
  _setAudio(state) {
    this.globalSettings.audio = state;
    this._saveGlobalSettings();
  }

  _setSubtitles(state) {
    this.globalSettings.subtitles = state;
    this._saveGlobalSettings();
  }

  _loadLocalData() {
    this.globalSettings = this._getDefaultSettings();
    if (storage.canUse()) {
      this.globalSettings = this._parseLocalStorage(UI_STORAGE_KEY);
      this.gameSettings = this._parseLocalStorage(GAME_STORAGE_KEY) || {};
      if (!this.globalSettings) {
        this.globalSettings = this._getDefaultSettings();
        this._saveGlobalSettings();
      }
    }
  }

  _saveGlobalSettings() {
    if (storage.canUse()) {
      storage.set(UI_STORAGE_KEY, JSON.stringify(this.globalSettings));
    }
  }

  _getDefaultSettings() {
    const defaults = {};
    defaults.audio = true;
    defaults.subtitles = false;
    return defaults;
  }

  _parseLocalStorage(key) {
    const data = storage.get(key);
    try {
      return JSON.parse(data);
    } catch (e) {}
    return null;
  }
}
export default Settings;
