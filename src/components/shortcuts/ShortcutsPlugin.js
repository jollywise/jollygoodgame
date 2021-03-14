import * as dat from 'dat.gui';
import { ShortcutTriggers } from './ShortcutTriggers';

const TRIGGER = '↑ ↑ ↓ ↓ ← →';
/**
 *
 * @alias components.ShortcutsPlugin
 * @classdesc asy in game shortcuts
 * @todo write documentation
 */
class ShortcutsPlugin extends Phaser.Plugins.BasePlugin {
  constructor(pluginManager) {
    super(pluginManager);

    this._containerID = false;
    this.model = {};
    this.groups = {};
    this.defaultGroup = 'game';
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
  }

  init(config) {
    if (config) {
      this._containerID = config.containerId || false;
      if (config.enabled) this.enable();
    }
  }

  enable() {
    if (!this.gui) this.create(this._containerID);
  }

  toggleDisplay() {
    this.isVisible ? this.hide() : this.show();
  }

  open() {
    if (this.gui) this.gui.open();
  }

  close() {
    if (this.gui) this.gui.close();
  }

  show() {
    this.isVisible = true;
    if (this.gui) this.gui.show();
  }

  hide() {
    this.isVisible = false;
    if (this.gui) this.gui.hide();
  }

  setVisible() {
    this.isVisible ? this.show() : this.hide();
  }

  create(containerId) {
    dat.GUI.TEXT_CLOSED = 'Close Shortcuts';
    dat.GUI.TEXT_OPEN = 'Open Shortcuts';
    this.gui = new dat.GUI({ name: 'Shortcuts', closed: false, autoPlace: false });
    this.gui.domElement.id = 'gui';
    this.gui.domElement.style.position = 'absolute';
    this.gui.domElement.style.top = 0;
    if (containerId) {
      document.getElementById(containerId).appendChild(this.gui.domElement);
    } else {
      this.game.scale.parent.appendChild(this.gui.domElement);
    }
    this.addShortcutGroup({ title: 'Game', open: true });
    this.close();
    this.setVisible();
  }

  addShortcutGroup({ id = this.defaultGroup, title, open = false }) {
    if (!this.gui) return;
    const group = this.gui.addFolder(title);
    this.groups[id] = group;
    open && group.open();
    return group;
  }

  addDisplayField(opts) {
    if (!this.gui) return;
    const control = this.addShortcut(opts);
    const el = control.domElement.getElementsByTagName('input')[0]; // make input read only
    el && (el.readOnly = true);
    return control;
  }

  addShortcut({ group = this.defaultGroup, field, title, value = null }) {
    if (!this.gui) return;
    this.model[field] = value;
    const control = this.groups[group].add(this.model, field).name(title);
    this.controls.push(control);
    return control;
  }

  addSlider({
    group = this.defaultGroup,
    field,
    title,
    value = false,
    min,
    max,
    step,
    onChange = null,
  }) {
    if (!this.gui) return;
    this.model[field] = value;
    const control = this.groups[group].add(this.model, field, min, max, step).name(title);
    onChange && control.onChange(onChange);
    this.controls.push(control);
    return control;
  }

  addToggle({ group = this.defaultGroup, field, title, value = false, onChange = null }) {
    if (!this.gui) return;
    this.model[field] = value;
    const control = this.groups[group].add(this.model, field).name(title);
    onChange && control.onChange(onChange);
    this.controls.push(control);
    return control;
  }

  /*
   * this.shortcuts.addDropDown({ field: '', title: '', value: [array of data], onChange: (val) => { // do something with 'val' here } });
   */
  addDropDown({ group = this.defaultGroup, field, title, value = [], onChange = null }) {
    if (!this.gui) return;
    this.model[field] = value;
    const control = this.groups[group].add(this.model, field, value).name(title);
    onChange && control.onChange(onChange);
    this.controls.push(control);
    return control;
  }

  /*
   * Updates components : Use after changing a model value externally
   */
  updateDisplay() {
    this.controls.forEach((item) => {
      item.updateDisplay();
    });
  }

  reset() {
    this.controls.forEach((item) => {
      item.remove();
    });
    this.controls = [];
    Object.keys(this.groups).forEach((id) => {
      if (this.gui) this.gui.removeFolder(this.groups[id]);
    });
    this.groups = {};
  }

  destroy() {
    this.reset();

    if (this.gui) {
      this.gui.destroy();
      this.gui = null;
    }

    if (this.trigger) {
      this.trigger.destroy();
      this.trigger = null;
    }
  }
}

export { ShortcutsPlugin };
