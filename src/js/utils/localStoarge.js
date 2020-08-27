let instance = null;

class LocalStorage {
  constructor(key = 'base_storage_key') {
    if (instance) {
      return instance;
    }
    instance = this;
    this.key = key;
    this.data = this.loadData();
    return instance;
  }

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

  setGameData(key, value) {
    this.data[key] = value;
    try {
      window.localStorage.setItem(this.key, JSON.stringify(this.data));
    } catch (e) {}
  }

  getGameData() {
    return this.data;
  }

  deleteData() {
    try {
      window.localStorage.removeItem(this.key);
    } catch (e) {}
  }

  destroy() {
    instance = null;
  }
}

export function getLS(key) {
  return new LocalStorage(key);
}
