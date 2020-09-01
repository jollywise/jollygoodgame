export class StoragePlugin {
  constructor();
}

export class StorageGame {
  constructor(key: string);
  plugin;
  deleteGameData();
  setGameData();
  getGameData();
}
