export class Shortcuts {
  constructor(game: Phaser.Game);
  model: object;
  groups: object;
  controls: [];
  reset();
  updateDisplay();
  addShortcutGroup();
  addDisplayField();
  addShortcut();
  addToggle();
  addDropDown();
}

export class ShortcutTriggers {
  constructor(opts: object);
}
