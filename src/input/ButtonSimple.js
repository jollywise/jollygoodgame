import Phaser from 'phaser';

const OVER = '_over';
const DOWN = '_down';
const DISABLED = '_disabled';

export class ButtonSimple extends Phaser.GameObjects.Sprite {
  constructor(scene, opts) {
    // init
    const {
      x,
      y,
      id,
      sheet,
      costume,
      gelvo,
      enabled = true,
      ariaLabel = false,
      event = false,
      scaleOnHover = 0.2
    } = opts;

    super(scene, x, y, sheet || 'buttons', costume);

    // button props
    this._x = x;
    this._y = y;
    this._scaleOnHover = scaleOnHover;
    this.id = id;
    this.costume = costume;
    this.gelvo = gelvo;
    this.ariaLabel = ariaLabel;
    this.event = event;

    // binded button events
    this.bindedEnterButtonHoverState = this.enterButtonHoverState.bind(this);
    this.bindedEnterButtonRestState = this.enterButtonRestState.bind(this);
    this.bindedEnterButtonActiveState = this.enterButtonActiveState.bind(this);
    this.bindedEnterButtonClickState = this.enterButtonClickState.bind(this);
    this.bindedEnterClickState = this.enterButtonClickState.bind(this);

    // accesibility dom node
    if (this.ariaLabel) {
      this.addAccessibilityElement();
    }

    // start
    scene.add.existing(this);
    if (enabled) {
      enabled && this.enable();
      this.enterButtonRestState();
    } else {
      this.disable();
    }

  }

  // add an additional dom node to act as an accessibility element
  addAccessibilityElement() {
    const element = document.createElement('button');
    element.style.width = this.width + 'px';
    element.style.height = this.height + 'px';
    element.tabIndex = '0';
    element.className = 'acessible-btn';
    element.setAttribute('role', 'button');
    element.setAttribute('aria-label', this.ariaLabel);
    this.dom = this.scene.add.dom(this.x, this.y, element);
  }

  // override x/y to align dom element with button
  set y(value) {
    this._y = value;
    if (this.dom) {
      this.dom.y = this.getBounds().centerY;
    }
  }

  get y() {
    return this._y;
  }

  set x(value) {
    this._x = value;
    if (this.dom) {
      this.dom.x = this.getBounds().centerX;
    }
  }

  get x() {
    return this._x;
  }

  // enable / disable
  disable() {
    this.removeListeners();
    this.buttonEnabled = false;
    this.setDisplay(this.costume + DISABLED);
    this.alpha = 0.25;
    this.disableInteractive();
  }

  enable() {
    if (!this.buttonEnabled) {
      this.alpha = 1;
      this.buttonEnabled = true;
      this.setInteractive({ useHandCursor: true });
      this.addListeners();
    }
  }

  // attach / remove listeners

  addListeners() {
    this.on('pointerover', this.bindedEnterButtonHoverState);
    this.on('pointerout', this.bindedEnterButtonRestState);
    this.on('pointerdown', this.bindedEnterButtonActiveState);
    this.on('pointerup', this.bindedEnterButtonClickState);
    if (this.dom) {
      this.dom.addListener('click');
      this.dom.addListener('focus');
      this.dom.addListener('focusout');
      this.dom.on('focus', this.bindedEnterButtonHoverState);
      this.dom.on('focusout', this.bindedEnterButtonRestState);
      this.dom.on('click', this.bindedEnterButtonClickState);
    }
  }
  removeListeners() {
    this.off('pointerover', this.bindedEnterButtonHoverState);
    this.off('pointerout', this.bindedEnterButtonRestState);
    this.off('pointerdown', this.bindedEnterButtonActiveState);
    this.off('pointerup', this.bindedEnterButtonClickState);

    if (this.dom) {
      this.dom.removeListener('click');
      this.dom.removeListener('focus');
      this.dom.removeListener('focusout');
      this.dom.off('click', this.bindedEnterButtonClickState);
      this.dom.off('focus', this.bindedEnterButtonHoverState);
      this.dom.off('focusout', this.bindedEnterButtonRestState);
    }
  }

  // button events
  enterButtonHoverState() {
    if (this.buttonEnabled) {
      if (this.ariaLabel) {
        this.scene.sys.game.controller.hud.showSubtitle(this.ariaLabel);
      }
      if (this.gelvo) {
        this.scene.sys.game.soundController.playVO('gelvo', this.gelvo);
      }
      this.setDisplay(this.costume + OVER);
      if(this.scaleOnHover){
        this.scale += this.scaleOnHover;
      }
    }
  }

  enterButtonRestState() {
    this.scale = 1;
    this.setDisplay(this.costume);
  }

  enterButtonActiveState() {
    if(this.scaleOnHover){
      this.scale += this.scaleOnHover;
    }
    this.setDisplay(this.costume + DOWN);
  }

  enterButtonClickState() {
    this.scene.sys.game.soundController.playButtonAudio('general', 'click');
    this.emit('click', { id: this.id });
  }

  setDisplay(frame){
    if( this.texture.has(frame)){
      this.setTexture(this.texture.key, frame);
    }
  }

  // clean up
  destroy(fromScene = true) {
    this.disable();
    if (this.dom) {
      this.dom.destroy();
    }
    super.destroy(fromScene);
  }
}
