import { FONT_COPY } from 'base/constants/Constants';

class ButtonLabel extends Phaser.GameObjects.Container {
  constructor({
    scene,
    id,
    label,
    style = DEFAULT_STYLE,
    x = 0,
    y = 0,
    width = 200,
    height = 60,
    enabled = true,
  }) {
    super(scene, x, y);
    this.id = id;
    this.bindedEnterButtonHoverState = this.enterButtonHoverState.bind(this);
    this.bindedEnterButtonRestState = this.enterButtonRestState.bind(this);
    this.bindedEnterButtonActiveState = this.enterButtonActiveState.bind(this);
    this.bindedEnterButtonClickState = this.enterButtonClickState.bind(this);

    this.bg = this.scene.make.graphics({}, true);
    this.add(this.bg);
    this.bg.setPosition(0, 0);
    this.setSize(width, height);
    this.drawState(OFF);

    this.label = this.scene.add.text(0, 0, label, style);
    this.add(this.label);
    this.label.setOrigin(0.5);
    this.interactiveOptions = {
      hitArea: new Phaser.Geom.Rectangle(0, 0, this.width, this.height),
      hitAreaCallback: Phaser.Geom.Rectangle.Contains,
      useHandCursor: true,
    };
    // this.setInteractive(this.interactiveOptions);

    enabled && this.enable();
    this.enterButtonRestState();
    scene.add.existing(this);
  }

  disable() {
    this.removeListeners();
    this.drawState(DISABLED);
    this.disableInteractive();
  }

  enable() {
    this.addListeners();
    this.setInteractive(this.interactiveOptions);
  }

  enterButtonHoverState() {
    this.drawState(OVER);
  }

  enterButtonRestState() {
    this.drawState(OFF);
  }

  enterButtonActiveState() {
    this.drawState(DOWN);
  }

  enterButtonClickState() {
    this.enterButtonHoverState();
    this.scene.sys.game.soundController.playAudioSprite('general', 'click');
    this.emit('click', { id: this.id });
  }

  drawState(state) {
    const w = this.width;
    const h = this.height;
    this.bg.clear();
    this.bg.lineStyle(2, CLRS[state].stroke);
    this.bg.fillStyle(CLRS[state].bg, 0.8);
    this.bg.fillRect(-w * 0.5, -h * 0.5, w, h);
    this.bg.strokeRect(-w * 0.5, -h * 0.5, w, h);
  }

  destroy(fromScene = true) {
    this.disable();
    // this.removeInteractive();
    this.bg.destroy(true);
    this.label.destroy(true);
    super.destroy(fromScene);
  }

  addListeners() {
    this.on('pointerover', this.bindedEnterButtonHoverState);
    this.on('pointerout', this.bindedEnterButtonRestState);
    this.on('pointerdown', this.bindedEnterButtonActiveState);
    this.on('pointerup', this.bindedEnterButtonClickState);
  }
  removeListeners() {
    this.off('pointerover', this.bindedEnterButtonHoverState);
    this.off('pointerout', this.bindedEnterButtonRestState);
    this.off('pointerdown', this.bindedEnterButtonActiveState);
    this.off('pointerup', this.bindedEnterButtonClickState);
  }
}

export default ButtonLabel;
const OFF = 'OFF';
const OVER = 'OVER';
const DOWN = 'DOWN'; // '_down';
const DISABLED = 'DISABLED'; // '_disabled';
const CLRS = {
  OFF: { bg: 0xaaaaaa, stroke: 0x2ecc40 },
  OVER: { bg: 0xdddddd, stroke: 0x2ecc40 },
  DOWN: { bg: 0xeeeeee, stroke: 0x2ecc40 },
  DISABLED: { bg: 0xeeeeee, stroke: 0x2ecc40 },
};
const DEFAULT_STYLE = {
  fontSize: '60px',
  fontFamily: FONT_COPY,
  color: '#000000',
};
