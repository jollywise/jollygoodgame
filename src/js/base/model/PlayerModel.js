const SERIALISE_KEYS = ['slotid'];
const MODEL_ID = 'player';

export default class PlayerModel {
  constructor(saves, id, { playerOptions = {} }) {
    this.saves = saves;
    this.id = id;
    this.slotid = playerOptions.slotid;
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
