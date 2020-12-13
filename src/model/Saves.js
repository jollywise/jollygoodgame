const VERSION = 1;
const SAVES_ID = 'saves';
export const NEW_SAVE = 'NEW_SAVE';
import { StorageGame } from '../storage/';

export class Saves {
  /*
   * data structure for saves:
   * saveID1 : {game: {}, player: {} ...}
   * saveID2 : {game: {}, player: {} ...}
   */
  constructor() {
    this.saveId = null;
    this.saves = {};
    this._storage = new StorageGame(SAVES_ID);
  }

  set storage(storage) {
    this._storage = storage;
    this.createSaveCount();
    this.saves = this.loadData(SAVES_ID, {});
  }

  createSaveId() {
    this.incrementSaveCount();
    return new Date().getTime();
  }

  setSaveId(val) {
    this.saveId = val === NEW_SAVE ? this.createSaveId() : val;
    return this.saveId;
  }
  getSaveId() {
    return this.saveId;
  }

  loadData(id, returnVal = {}) {
    const gameData = this._storage.getGameData();
    const dataString = gameData[id];
    if (dataString) {
      return JSON.parse(dataString);
    }
    return returnVal;
  }

  /*
  ===================================================================================
    CREATE AND DELETE
  ===================================================================================
  */
  createSaveCount() {
    this.saveCount = this.loadData('savecount', 0);
    this._storage.setGameData('savecount', this.saveCount);
  }
  incrementSaveCount() {
    this.saveCount++;
    this._storage.setGameData('savecount', this.saveCount);
  }

  create({ saveID }) {
    if (!this.hasSave(saveID)) {
      const saveNumber = this.saveCount;
      this.saves[saveID] = { id: saveID, version: VERSION, saveNumber };
      console.info(`Saves.create ${saveID} #${saveNumber} version ${VERSION}`);
    } else {
      console.warn(`Saves.create ${saveID} exists`);
    }
    this.saveData();
    return this.saves[saveID];
  }

  load(id) {
    const saveID = id || this.saveId;
    if (this.hasSave(saveID)) {
      // console.info(`Saves.load ${saveID}`);
      const { version } = this.saves[saveID];
      if (version !== VERSION) {
        if (
          window.confirm(
            'Saved data is incompatible due to development changes.\n\nClick OK to delete old saved data and restart'
          )
        ) {
          this.deleteSave(saveID);
          this.saveId = null;
          location.reload();
        }
      }
      return this.saves[saveID];
    }
  }

  save({ id, data }) {
    const saveID = id || this.saveId;
    // console.log('save', saveID, data);
    if (saveID) {
      const existing = this.saves[saveID] || this.create({ saveID });
      const merged = { ...existing, ...data };
      this.saves[saveID] = merged;
      this.saveData();
    }
  }

  renameSave() {
    if (this.saveId) {
      const newSaveID = this.createSaveId();
      this.saves[newSaveID] = { ...this.saves[this.saveId] };
      this.saves[newSaveID].id = newSaveID;
      delete this.saves[this.saveId];
      this.setSaveId(newSaveID);
      this.saveData();
    }
  }

  deleteSaves() {
    if (this.playerHasSaves()) {
      for (const save of Object.keys(this.saves)) {
        this.deleteSave(save);
      }
      return true;
    } else {
      return false;
    }
  }

  deleteSave(id) {
    const saveID = id || this.saveId;
    if (this.hasSave(saveID)) {
      delete this.saves[saveID];
      this.saveData();
      console.info(`Saves.delete slot ${saveID}`);
    } else {
      console.warn(`Saves.delete save ${saveID} : doesn't exist`);
    }
  }

  hasSave(saveID) {
    if (this.saves) {
      return this.saves[saveID] || false;
    }
    return false;
  }

  playerHasSaves() {
    if (this.saves) {
      return Object.keys(this.saves).length > 0;
    }
    return false;
  }

  getSaves() {
    return Object.keys(this.saves).map((key) => {
      return this.saves[key];
    });
  }

  getSaveNumber() {
    if (this.hasSave(this.saveId)) {
      return this.saves[this.saveId].saveNumber;
    } else {
      return this.saveCount;
    }
  }

  getSavesCount() {
    if (this.saves) {
      return Object.keys(this.saves).length;
    } else {
      return 0;
    }
  }

  /*
  ====================================================================================================
  Save via plugin
  ====================================================================================================
  */
  saveData() {
    this._storage.setGameData(SAVES_ID, this.saves);
  }

  /*
  ====================================================================================================
  DATA SERIALIZATION
  ====================================================================================================
  */
  deserialize(object, data, modelID) {
    const dataSlice = (data && data[modelID]) || null;
    if (dataSlice) {
      const keys = Object.keys(dataSlice);
      for (const key of keys) {
        if (object[key] !== null || object[key] !== undefined) {
          object[key] = dataSlice[key];
        }
      }
    }
  }

  serialize(object, modelID, keys) {
    const data = {};
    data[modelID] = keys.reduce((obj, key) => {
      obj[key] = object[key];
      return obj;
    }, {});
    return data;
  }
}
