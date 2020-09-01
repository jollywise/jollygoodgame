let instance = null;

class StorageGame {
  constructor(key = 'base_storage_key') {
    if (instance) {
      return instance;
    }
    instance = this;
    this.key = key;
    this._plugin = null;
    return instance;
  }

  set plugin(plugin) {
    this._plugin = plugin;
    this._plugin.key = this.key;
  }

  deleteGameData() {
    if (this._plugin) {
      this._plugin.deleteGameData();
    } else {
      console.log('Unhandled deleteGameData');
    }
  }

  setGameData(saveId, value) {
    if (this._plugin) {
      this._plugin.setGameData(saveId, value);
    } else {
      console.log('Unhandled setGameData', saveId, value);
    }
  }

  getGameData() {
    if (this._plugin) {
      return this._plugin.getGameData();
    } else {
      console.log('Unhandled getGameData');
      return false;
    }
  }

  destroy() {
    instance = null;
    this._plugin.destroy();
    this._plugin = null;
  }
}

export function getStorage(key) {
  return new StorageGame(key);
}
