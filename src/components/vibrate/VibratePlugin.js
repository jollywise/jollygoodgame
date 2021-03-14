/**
 *
 * @alias components.VibratePlugin
 * @classdesc A Sound Controller, used to manage game sounds
 * @todo write documentation
 * @todo this is an experimental feature atm, and as such only checks for navigator.vibrate
 */
class VibratePlugin extends Phaser.Plugins.BasePlugin {
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

export { VibratePlugin };
