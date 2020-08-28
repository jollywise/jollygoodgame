export class StorageLocalPlugin {
  constructor() {
    return this.isSupported();
  }

  get key() {
    return this._key;
  }
  set key(val) {
    this._key = val;
    this.data = this.loadData();
  }

  deleteGameData() {
    try {
      window.localStorage.removeItem(this.key);
    } catch (e) {}
  }

  setGameData(saveId, value) {
    const savesString = JSON.stringify(value);
    this.data[saveId] = savesString;
    try {
      window.localStorage.setItem(this.key, JSON.stringify(this.data));
    } catch (e) {}
  }

  getGameData() {
    return this.loadData();
  }

  // internal

  isSupported() {
    return typeof Storage !== 'undefined';
  }

  parseLocalStorage(key) {
    const data = window.localStorage.getItem(key);
    try {
      return JSON.parse(data);
    } catch (e) {}
    return undefined;
  }

  loadData() {
    return this.parseLocalStorage(this.key) || {};
  }

  destroy() {
    this.data = null;
  }
}
