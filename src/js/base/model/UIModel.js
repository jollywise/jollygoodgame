import EventEmitter from 'eventemitter3';

export default class UIModel extends EventEmitter {
  /*
   * UIModel saves mute state to LocalStorage via utils/Settings
   */
  constructor({ config, settings }) {
    super();
    this.config = { ...config };
    this.settings = settings;
    this.paused = false;
    this.emitter = new Phaser.Events.EventEmitter();
  }

  getGlobalSettings() {
    return this.settings.getGlobalSettings();
  }

  /*
   * AUDIO
   */
  updateAudio() {
    this.emit('onAudioIsChanged', { isMuted: this.settings.getIsMuted() });
  }
  toggleAudio() {
    const result = this.settings.toggleAudio();
    this.emit('onAudioIsChanged', result);
    this.emit('settingChanged');
    return result.isMuted;
  }
  getAudio() {
    return this.settings.getAudio();
  }
  getIsMuted() {
    return this.settings.getIsMuted();
  }

  toggleMotion() {
    const result = this.settings.toggleMotion();
    this.emit('onMotionIsChanged', result);
    this.emit('settingChanged');
    return result;
  }
  getMotion() {
    return this.settings.getMotion();
  }

  /**
   * Subtitles
   */

  getSubtitles() {
    return this.settings.getSubtitles();
  }
  toggleSubtitles() {
    return this.settings.toggleSubtitles();
  }

  /**
   * Pause
   */

  setPaused(value) {
    this.paused = value;
    // this.onPauseIsChanged.dispatch({ paused: this.paused });
  }

  destroy() {
    super.destroy();
  }
}
