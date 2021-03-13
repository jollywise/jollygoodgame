export class VibratePlugin extends Phaser.Plugins.BasePlugin {
  constructor(pluginManager) {
    super(pluginManager);
  }

  trigger(duration = 200) {
    this._vibrate(duration);
  }

  triggerSequence(sequence = [200]) {
    this._vibrate(sequence);
  }

  _vibrate(value) {
    try {
      navigator.vibrate(value);
    } catch (e) {}
  }
}
