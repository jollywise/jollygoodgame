const SERIALISE_KEYS = [];
const MODEL_ID = 'game';

export default class GameModel {
  constructor(saves, { levelDuration }) {
    this.saves = saves;
    this.levelDuration = levelDuration;
    this.load();
  }

  /*
   * Save Methods
   */
  load() {
    const data = this.saves.load();
    this.saves.deserialize(this, data, MODEL_ID);
    this.save();
  }

  save() {
    const data = this.saves.serialize(this, MODEL_ID, SERIALISE_KEYS);
    this.saves.save({ data });
  }
}
