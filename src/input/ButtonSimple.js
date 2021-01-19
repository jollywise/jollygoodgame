import Phaser from 'phaser';

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
    } = opts;

    super(scene, x, y, sheet || 'buttons', costume);

    // button props
    this._x = x;
    this._y = y;
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
    // this.setFrame(this.costume + DISABLED);
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
      if (this.scene.sys.game.device.os.desktop && this.gelvo) {
        this.scene.sys.game.soundController.playButtonAudio('gelvo', this.gelvo);
      }
      // this.setFrame(this.costume + OVER);
      this.scale = 1.2;
    }
  }

  enterButtonRestState() {
    this.scale = 1;
    this.setFrame(this.costume);
  }

  enterButtonActiveState() {
    if (!this.scene.sys.game.device.os.desktop && this.scene.sys.game.device.input.touch && this.gelvo) {
      this.scene.sys.game.soundController.playButtonAudio('gelvo', this.gelvo);
      console.log("playvo")
    }
    this.scale = 1.2;
    // this.setFrame(this.costume + DOWN);
  }

  enterButtonClickState() {
    // this.scene.sys.game.soundController.playButtonAudio('general', 'click');
    this.emit('click', { id: this.id });
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
