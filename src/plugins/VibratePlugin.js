/*

  // add as scene plugin
  
  {
    key: 'VibratePlugin',
    plugin: VibratePlugin,
    mapping: 'vibrate',
    start: true,
  }

  // access via scene

  scene.vibrate.trigger(duration);
  scene.vibrate.triggerSequence([duration,pauseduration,duration]);

*/

export class VibratePlugin extends Phaser.Plugins.ScenePlugin {
  constructor(scene, pluginManager) {
    super(scene, pluginManager);
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

  //  Called when a Scene is destroyed by the Scene Manager. There is no coming back from a destroyed Scene, so clear up all resources here.
  destroy() {
    this.shutdown();
  }
}
