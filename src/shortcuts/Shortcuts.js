import * as dat from 'dat.gui';
import { ShortcutTriggers } from './ShortcutTriggers';

const TRIGGER = '↑ ↑ ↓ ↓ ← →';

export class Shortcuts {
  constructor(game) {
    this.game = game;
    this.model = {};
    this.controls = [];
    this.isVisible = __WATCH__;

    this.boundToggle = this.toggleDisplay.bind(this);
    this.trigger = new ShortcutTriggers({
      sequence: TRIGGER,
      onComplete: this.boundToggle,
      onFail: (val) => {
        console.log('FAIL', val);
      },
    });

    this.create();
  }

  toggleDisplay() {
    this.isVisible ? this.hide() : this.show();
  }

  open() {
    this.gui.open();
  }

  close() {
    this.gui.close();
  }

  show() {
    this.isVisible = true;
    this.gui.show();
  }

  hide() {
    this.isVisible = false;
    this.gui.hide();
  }

  setVisible() {
    this.isVisible ? this.show() : this.hide();
  }

  create() {
    dat.GUI.TEXT_CLOSED = 'Close Shortcuts';
    dat.GUI.TEXT_OPEN = 'Open Shortcuts';
    this.gui = new dat.GUI({ name: 'Shortcuts', closed: false, autoPlace: false });
    this.gui.domElement.id = 'gui';
    this.gui.domElement.style.position = 'absolute';
    this.gui.domElement.style.top = 0;
    this.game.scale.parent.appendChild(this.gui.domElement);
    this.close();
    this.setVisible();
  }

  addShortcut({ field, title, value = null }) {
    this.model[field] = value;
    this.controls.push(this.gui.add(this.model, field).name(title));
  }

  reset() {
    this.controls.forEach((item) => {
      item.remove();
    });
    this.controls = [];
  }

  destroy() {
    this.reset();

    this.gui.destroy();
    this.gui = null;

    this.trigger.destroy();
    this.trigger = null;
  }
}
