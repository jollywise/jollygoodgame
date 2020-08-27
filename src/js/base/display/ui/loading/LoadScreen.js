import ScreenBackground from '../ScreenBackground';
import LoadBar from 'base/display/ui/LoadBar';

export default class LoadScreen extends Phaser.GameObjects.Container {
  constructor(scene, style = 'STYLE_INIT') {
    super(scene);
    scene.add.existing(this);

    switch (style) {
      case LoadScreen.STYLE_INIT:
        this.renderInitLoadScreen();
        break;
      case LoadScreen.STYLE_AVATAR:
        this.renderAvatarLoadScreen();
        break;
      case LoadScreen.STYLE_CHARACTER:
        this.renderCharacterLoadScreen();
        break;
    }
  }

  renderInitLoadScreen() {
    this.bg = new ScreenBackground(this.scene, 'background_red_vignette');
    this.add(this.bg);

    this.logo = this.scene.add.image(
      this.scene.sys.game.gameWidthDefault * 0.5,
      237,
      'logos',
      'logo_vileplayer'
    );
    this.logo.setOrigin(0.5, 0);
    this.logo.scale = 257 / this.logo.width;

    this.labelLoading = this.scene.add.text(
      this.scene.sys.game.gameWidthDefault * 0.5,
      470,
      'LOADING...',
      {
        color: '#ffffff',
        fontSize: 28,
      }
    );
    this.labelLoading.setOrigin(0.5, 0);
    this.add(this.labelLoading);

    this.loadBar = new LoadBar({
      scene: this.scene,
      x: this.scene.sys.game.gameWidthDefault * 0.5,
      y: 408,
    });
    this.add(this.loadBar);
  }

  renderAvatarLoadScreen() {
    this.bg = new ScreenBackground(this.scene, 'background_red_vignette');
    this.add(this.bg);

    this.logo = this.scene.add.image(
      this.scene.sys.game.gameWidthDefault * 0.5,
      150,
      'logos',
      'logo_vileplayer'
    );
    this.logo.setOrigin(0.5, 0);
    this.logo.scale = 257 / this.logo.width;

    this.avatar = this.scene.add.image(
      this.scene.sys.game.gameWidthDefault * 0.5,
      this.scene.sys.game.gameHeightDefault * 0.5,
      'avatars',
      this.scene.sys.game.controller.playerModel.avatarid
    );
    this.spinner = this.scene.add.image(
      this.scene.sys.game.gameWidthDefault * 0.5,
      this.scene.sys.game.gameHeightDefault * 0.7,
      'uiicons',
      'load_spinner'
    );
    this.tween = this.scene.tweens.add({
      targets: this.spinner,
      angle: 360,
      ease: 'Linear',
      duration: 1000,
      repeat: -1,
    });
  }

  renderCharacterLoadScreen() {
    this.bg = new ScreenBackground(this.scene, 'background_stone');
    this.add(this.bg);

    this.logo = this.scene.add.image(
      this.scene.sys.game.gameWidthDefault * 0.5,
      75,
      'logos',
      'logo_beastlybook_dark'
    );
    this.logo.setOrigin(0.5, 0);

    const level = this.scene.sys.game.controller.levelModel.currentLevel;
    const costume = this.scene.sys.game.controller.playerModel.getLevelCostume(level);
    const spineid = this.scene.sys.game.controller.levelModel.getHeroSpineCostume(level);
    this.spine = this.scene.add.spine(
      this.scene.sys.game.gameWidthDefault * 0.5,
      this.scene.sys.game.gameHeightDefault * 0.7,
      'urchin',
      'walk',
      true
    );

    this.spine.setSkin(this._createSkin(costume.skin, costume.gender, spineid));
    this.spine.scale = 1.4;

    this.loadBar = new LoadBar({
      scene: this.scene,
      x: this.scene.sys.game.gameWidthDefault * 0.5,
      y: 590,
    });
    this.add(this.loadBar);
  }

  _createSkin(skin, gender, epoch) {
    const base = this.spine.findSkin('configure');
    base.clear();
    base.addSkin(this.spine.findSkin('default'));
    base.addSkin(this.spine.findSkin('skin/' + skin));
    base.addSkin(this.spine.findSkin('costume/' + gender + '/' + epoch));
    return base;
  }

  setProgress(value) {
    if (this.loadBar) {
      this.loadBar.setProgress(value);
    }
  }

  destroy() {
    if (this.bg) {
      this.bg.destroy(true);
      this.bg = null;
    }
    if (this.logo) {
      this.logo.destroy(true);
      this.logo = null;
    }
    if (this.labelLoading) {
      this.labelLoading.destroy(true);
      this.labelLoading = null;
    }
    if (this.loadBar) {
      this.loadBar.destroy(true);
      this.loadBar = null;
    }
    if (this.spine) {
      this.spine.destroy();
      this.spine = null;
    }
    if (this.avatar) {
      this.avatar.destroy();
      this.avatar = null;
    }
    if (this.spinner) {
      this.spinner.destroy();
      this.spinner = null;
    }
    super.destroy(true);
  }
}

LoadScreen.STYLE_INIT = 'STYLE_INIT';
LoadScreen.STYLE_AVATAR = 'STYLE_AVATAR';
LoadScreen.STYLE_CHARACTER = 'STYLE_CHARACTER';
