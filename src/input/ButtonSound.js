import { SETTINGS_EVENTS } from '@jollywise/jollygoodgame';
import { ButtonSimple } from '@jollywise/jollygoodgame/src/input/ButtonSimple';

const ON = '_on';
const OFF = '_off';

export class ButtonSound extends ButtonSimple {
  constructor(scene, opts) {
    // init
    const { id, enabled = true } = opts;
    const defaultState = scene.game.settings.audio ? ON : OFF;

    super(scene, { ...opts, costume: id + defaultState });

    this.updateDisplayStatus({ isMuted: !scene.game.settings.audio });
    this.scene.game.settings.on(SETTINGS_EVENTS.AUDIO_CHANGED, this.handleAudioChanged, this);

    // enable
    enabled && this.enable();
  }

  // ui events
  handleAudioChanged() {
    this.updateDisplayStatus({ isMuted: !this.scene.game.settings.audio });
  }

  // update icon when audio is changed
  updateDisplayStatus({ isMuted }) {
    this.state = isMuted ? OFF : ON;
    this.gelvo = this.state === OFF ? 'turn_sound_on' : 'turn_sound_off';
    this.costume = this.id + this.state;
    this.setFrame(this.costume);
  }

  // clean up
  destroy(fromScene = true) {
    this.scene.game.settings.off(SETTINGS_EVENTS.AUDIO_CHANGED, this.handleAudioChanged, this);
    super.destroy(fromScene);
  }
}
