/*

  // add as scene plugin
  
  {
    key: 'SubtitlesPlugin',
    plugin: SubtitlesPlugin,
    mapping: 'subtitles',
    start: true,
  }

  // access via scene

  scene.subtitles.show(message, duration);
  scene.subtitles.hide();

*/

export class SubtitlesPlugin extends Phaser.Plugins.ScenePlugin {
  constructor(scene, pluginManager) {
    super(scene, pluginManager);
  }

  boot() {
    let eventEmitter = this.systems.events;
    eventEmitter.on('shutdown', this.shutdown, this);
  }

  createLabel() {
    this.label = this.scene.add
      .text(this.scene.game.scale.width * 0.5, 0, '', {
        ...SubtitlesPlugin.CONFIG,
        align: 'center',
      })
      .setDepth(99999999)
      .setOrigin(0.5);
    this.label.setScrollFactor(0);
    this.scene.children.remove(this.label);
  }

  shutdown() {
    let eventEmitter = this.systems.events;
    eventEmitter.off('shutdown', this.shutdown, this);
    if (this.label) {
      this.label.destroy();
      this.label = null;
    }
  }

  show(message, duration) {
    if (!this.label) this.createLabel();
    this.label.text = message;
    this.label.y =
      this.scene.game.scale.height - this.label.height * 0.5 - SubtitlesPlugin.CONFIG.edgePadding;
    this.scene.add.existing(this.label);
    this.scene.time.delayedCall(duration || SubtitlesPlugin.CONFIG.duration, this.hide, null, this);
  }

  hide() {
    if (this.label) this.scene.children.remove(this.label);
  }

  destroy() {
    this.shutdown();
  }
}

SubtitlesPlugin.CONFIG = {
  color: '#ffffff',
  fontSize: 24,
  fontFamily: 'sans-serif',
  backgroundColor: '#000000',
  padding: 20,
  duration: 1250,
  edgePadding: 20,
};

SubtitlesPlugin.SetColour = (value) => {
  SubtitlesPlugin.CONFIG.color = value;
};

SubtitlesPlugin.SetBackgroundColor = (value) => {
  SubtitlesPlugin.CONFIG.backgroundColor = value;
};

SubtitlesPlugin.SetFontSize = (value) => {
  SubtitlesPlugin.CONFIG.fontSize = value;
};

SubtitlesPlugin.SetFontFamily = (value) => {
  SubtitlesPlugin.CONFIG.fontFamily = value;
};

SubtitlesPlugin.SetBackgroundPadding = (value) => {
  SubtitlesPlugin.CONFIG.padding = value;
};

SubtitlesPlugin.SetDuration = (value) => {
  SubtitlesPlugin.CONFIG.duration = value;
};

SubtitlesPlugin.SetEdgePadding = (value) => {
  SubtitlesPlugin.CONFIG.edgePadding = value;
};

SubtitlesPlugin.SetConfig = (value) => {
  SubtitlesPlugin.CONFIG = {
    color: value.color || '#ffffff',
    fontSize: value.fontSize || 24,
    fontFamily: value.fontFamily || 'sans-serif',
    backgroundColor: value.backgroundColor || '#000000',
    padding: value.padding || 20,
    duration: value.duration || 1250,
    edgePadding: value.edgePadding || 20,
  };
};
