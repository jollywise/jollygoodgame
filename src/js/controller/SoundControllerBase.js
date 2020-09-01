const SFX_VOLUME = 0.5;

export class SoundControllerBase {
  constructor({ game }) {
    this.game = game;
    this.currentVO = null;

    // this.game.settings.emitter.on('settingsAudioChanged', this.handleAudioChanged, this);
    // this.handleAudioChanged();
  }

  handleAudioChanged() {
    this.mute = !this.game.settings.getAudio();
  }

  set mute(value) {
    this.game.sound.mute = value;
  }

  playGelVO(id) {
    if (this.currentVO) {
      this.currentVO.stop();
      this.currentVO = null;
    }
    this.currentVO = this.playAudioSprite('gelvo', id, { volume: 1 });
  }

  playAudioSprite(spriteID, id, opts = {}, sprite = null) {
    // console.log('playAudioSprite', spriteID, id, opts);
    const { volume = SFX_VOLUME, loop = false, delay = null } = opts;
    if (delay) {
      const { time, duration } = delay;
      opts.delay = null;
      time.addEvent({
        delay: duration,
        callback: this.playAudioSprite,
        callbackScope: this,
        args: [spriteID, id, opts],
      });
      return false;
    }
    let audioSprite = sprite;
    if (!audioSprite && this.game.cache.audio.exists(spriteID)) {
      audioSprite = this.game.sound.addAudioSprite(spriteID);
    }
    if (audioSprite) {
      audioSprite.play(id, { volume, loop });
      return audioSprite;
    }
    return false;
  }

  stopAudioSprite(sprite) {
    sprite.stop();
  }
}
