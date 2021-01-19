import Phaser from 'phaser';
import { SETTINGS_EVENTS } from '../constants/Events';

const SFX_VOLUME = 0.5;
const VO_VOLUME = 1;
const MUSIC_VOLUME = 0.2;
const BUTTONAUDIO_VOLUME = 0.5;

const SFX_GROUP = 'sfx';
const VO_GROUP = 'vo';
const MUSIC_GROUP = 'music';
const BUTTONAUDIO_GROUP = 'buttonAudio';

export class SoundController extends Phaser.Scene {
  constructor({ game, key }) {
    super({ key, active: true });
    this.game = game;
    this.key = key;
    this.paused = false;

    this.sfxVolume = SFX_VOLUME;
    this.voVolume = VO_VOLUME;
    this.musicVolume = MUSIC_VOLUME;
    this.buttonAudioVolume = BUTTONAUDIO_VOLUME;
    this.audioGroups = {};
    this.audioGroups[SFX_GROUP] = { sounds: [], volume: this.sfxVolume };
    this.audioGroups[VO_GROUP] = { sounds: [], volume: this.voVolume };
    this.audioGroups[MUSIC_GROUP] = { sounds: [], volume: this.musicVolume };
    this.audioGroups[BUTTONAUDIO_GROUP] = { sounds: [], volume: this.buttonAudioVolume };

    this.game.settings.on(SETTINGS_EVENTS.AUDIO_CHANGED, this.handleAudioChanged, this);
    this.handleAudioChanged();
  }

  create() {
    this.events.on('pause', this.onPaused, this);
    this.events.on('resume', this.onResumed, this);
  }

  handleAudioChanged() {
    if (this.game.settings.audio) {
      if (this.game.settings.sfx) {
        this.setGroupVolume(SFX_GROUP, this.sfxVolume);
      } else {
        this.setGroupVolume(SFX_GROUP, 0);
      }
      if (this.game.settings.vo) {
        this.setGroupVolume(VO_GROUP, this.voVolume);
      } else {
        this.setGroupVolume(VO_GROUP, 0);
      }
      if (this.game.settings.music) {
        this.setGroupVolume(MUSIC_GROUP, this.musicVolume);
      } else {
        this.setGroupVolume(MUSIC_GROUP, 0);
      }
      if (this.game.settings.buttonAudio) {
        this.setGroupVolume(BUTTONAUDIO_GROUP, this.buttonAudioVolume);
      } else {
        this.setGroupVolume(BUTTONAUDIO_GROUP, 0);
      }
      this.mute = false;
    } else {
      this.mute = true;
    }
  }

  set mute(value) {
    this.game.sound.mute = value;
  }

  // SFX - playSFX, playSFXSound, stopSFX, setSFXVolume

  playSFX(spriteID, id, opts = {}) {
    return this._playAudioSprite(spriteID, id, SFX_GROUP, opts);
  }

  playSFXSound(id, opts = {}) {
    return this._playAudioSound(id, SFX_GROUP, opts);
  }

  stopSFX(audio, opts = {}) {
    this._stopAudio(audio, opts);
  }

  stopAllSFX(opts = {}) {
    this.stopGroup(SFX_GROUP, opts);
  }

  setSFXVolume(audio, volume) {
    audio.volume = volume * this.audioGroups[SFX_GROUP].volume;
    this.audioGroups[SFX_GROUP].sounds.forEach((el) => {
      if (el.audio === audio) {
        el.volume = volume;
      }
    });
  }

  // Button Audio - playButtonAudio

  playButtonAudio(spriteID, id, opts = {}) {
    return this._playAudioSprite(spriteID, id, BUTTONAUDIO_GROUP, {force:true, ...opts});
  }

  // VO - playVO, stopVO

  playVO(spriteID, id, opts = {}) {
    this.stopVO();
    return this._playAudioSprite(spriteID, id, VO_GROUP, opts);
  }

  stopVO(opts = {}) {
    this.stopGroup(VO_GROUP, opts);
  }

  // Music - playMusic, stopMusic

  playMusic(id, opts = {}) {
    this.stopMusic();
    opts.loop = true;
    return this._playAudioSound(id, MUSIC_GROUP, opts);
  }

  stopMusic(opts = {}) {
    this.stopGroup(MUSIC_GROUP, opts);
  }

  // internal methods

  _fadeOut(audio, duration, onComplete = null, onCompleteScope = null) {
    this.tweens.add({ targets: audio, volume: 0, duration, onComplete, onCompleteScope });
  }

  _fadeIn(audio, volume, duration, onComplete = null, onCompleteScope = null) {
    this.tweens.add({ targets: audio, volume, duration, onComplete, onCompleteScope });
  }

  _playAudioSound(spriteID, group, opts = {}) {
    if (!this.game.cache.audio.exists(spriteID)) {
      console.error('SoundController::_playAudioSound not found', spriteID);
      return false;
    }

    console.log('SoundController::_playAudioSound', spriteID, group, opts);

    const { volume = 1, loop = false, delay = null, fadeIn = false } = opts;
    const audio = this.game.sound.add(spriteID);
    audio.volume = volume;
    if (group) {
      this.addAudioToGroup(audio, group);
    }
    if (fadeIn) {
      const targetVolume = audio.volume;
      audio.play({ loop, delay, volume: 0 });
      this._fadeIn(audio, targetVolume, fadeIn);
    } else {
      audio.play({ loop, delay, volume });
    }
    if (this.paused) {
      audio.pause();
    }
    return audio;
  }

  _playAudioSprite(spriteID, id, group, opts = { }) {
    if (!this.game.cache.audio.exists(spriteID)) {
      console.error('SoundController::_playAudioSprite not found', spriteID);
      return false;
    }

    console.log('SoundController::_playAudioSprite', spriteID, id, group, opts);

    const { volume = 1, loop = false, delay = null, fadeIn = false } = opts;
    const audioSprite = this.game.sound.addAudioSprite(spriteID);
    audioSprite.volume = volume;
    if (group) {
      this.addAudioToGroup(audioSprite, group);
    }
    if (fadeIn) {
      const targetVolume = audioSprite.volume;
      audioSprite.play(id, { loop, delay, volume: 0 });
      this._fadeIn(audioSprite, targetVolume, fadeIn);
    } else {
      audioSprite.play(id, { loop, delay, volume });
    }
    if (this.paused && !opts.force) {
      audioSprite.pause();
    }
    return audioSprite;
  }

  _stopAudio(audio, opts = {}) {
    const { fadeOut = false } = opts;
    if (fadeOut) {
      this._fadeOut(audio, 0, fadeOut, audio.stop, audio);
    } else {
      audio.stop();
    }
  }

  addAudioToGroup(audio, group) {
    if (!this.audioGroups[group]) {
      console.error('Unknown audio group', group);
      return;
    }
    this.audioGroups[group].sounds.push({ audio: audio, volume: audio.volume });

    audio.volume *= this.audioGroups[group].volume;
    audio.on('stop', () => this.removeAudioFromGroup(audio, group));
  }

  removeAudioFromGroup(audio, group) {
    if (!this.audioGroups[group]) {
      console.error('Unknown audio group', group);
      return;
    }
    this.audioGroups[group].sounds = this.audioGroups[group].sounds.filter(
      (el) => el.audio !== audio
    );
  }

  setGroupVolume(group, volume) {
    if (!this.audioGroups[group]) {
      console.error('Unknown audio group', group);
      return;
    }
    this.audioGroups[group].volume = volume;
    this.audioGroups[group].sounds.forEach((el) => {
      el.audio.volume = el.volume * volume;
    });
  }

  stopGroup(group, opts = {}) {
    if (!this.audioGroups[group]) {
      console.error('Unknown audio group', group);
      return;
    }
    this.audioGroups[group].sounds.forEach((el) => {
      this._stopAudio(el.audio, opts);
    });
    this.audioGroups[group].sounds = [];
  }

  
  pauseGroup(group) {
    if (!this.audioGroups[group]) {
      console.error('Unknown audio group', group);
      return;
    }
    this.audioGroups[group].sounds.forEach((el) => {
      el.audio.pause();
    });
  }

  resumeGroup(group) {
    if (!this.audioGroups[group]) {
      console.error('Unknown audio group', group);
      return;
    }
    this.audioGroups[group].sounds.forEach((el) => {
      el.audio.resume();
    });
  }

  onPaused() {
    this.paused = true;
    //  this.game.sound.pauseAll();
    Object.keys(this.audioGroups).forEach((group) => {
      if(group != BUTTONAUDIO_GROUP){
        this.pauseGroup(group);
      }
    })
  }

  onResumed() {
    this.paused = false;
    // this.game.sound.resumeAll();
    Object.keys(this.audioGroups).forEach((group) => {
      if(group != BUTTONAUDIO_GROUP){
        this.resumeGroup(group);
      }
    })
  }
}
