import ButtonSimple from './ButtonSimple';

class ButtonSound extends ButtonSimple {
  constructor(opts) {
    // init
    const { id, uiModel, enabled = true } = opts;
    const defaultState = uiModel.getIsMuted() ? ON : OFF;
    super({ ...opts, enabled: false, costume: id + defaultState });

    // binded event
    this.bindedUpdateDisplayStatus = this.updateDisplayStatus.bind(this);

    // listen for ui model
    this.uiModel = uiModel;
    this.updateDisplayStatus({ isMuted: this.uiModel.getIsMuted() });
    this.uiModel.on('onAudioIsChanged', this.bindedUpdateDisplayStatus);

    // enable
    enabled && this.enable();
  }

  // ui events
  handleAudioChanged() {
    this.updateDisplayStatus({ isMuted: this.uiModel.getIsMuted() });
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
    this.uiModel.off('onAudioIsChanged', this.bindedUpdateDisplayStatus);
    super.destroy(fromScene);
  }
}
export default ButtonSound;

const ON = '_on';
const OFF = '_off';
