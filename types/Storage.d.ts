export class StoragePlugin {
  constructor();
  key: string;
  deleteGameData();
  setGameData();
  getGameData();
}

export class StorageGame {
  constructor(key: string);
  plugin;
  deleteGameData();
  setGameData();
  getGameData();
}
