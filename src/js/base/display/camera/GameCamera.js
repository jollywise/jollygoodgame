import Hero from '../../hero/Hero';
import { VIEWPORT_EVENTS } from '../../controller/ViewportController';

export default class GameCamera {
  constructor(scene, worldWidth, worldHeight, hero) {
    this.scene = scene;
    this.worldWidth = worldWidth;
    this.worldHeight = worldHeight;
    this.horizon = this.worldHeight - 256;
    this.hero = hero;
    this.hero.on(Hero.EVENTS.HEALTH_CHANGE, this.checkFollow, this);

    this.offset = 0;
    this.camSpeed = 800 / 1000;

    this.onPanComplete = null;

    this.camera = this.scene.cameras.main;
    this.camera.on(Phaser.Cameras.Scene2D.Events.PAN_COMPLETE, this.handlePanComplete, this);

    const viewport = this.scene.sys.game.viewportController;
    viewport.on(VIEWPORT_EVENTS.UPDATED, this.handleViewUpdate, this);
    this.handleViewUpdate(viewport);

    // Constrain camera to location bounds

    // this.scene.cameras.main.flash(500, 255, 255, 255);
    // this.scene.cameras.main.startFollow(this.hero.spine, true, 0.5, 0.1, 0, 120);
    this.resumeFollow();
  }

  handleViewUpdate(viewport) {
    this.camera.setBounds(0 - viewport.x, 0, this.worldWidth + viewport.x * 2, this.worldHeight);
  }

  checkFollow() {
    if (this.hero.health <= 0) {
      this.stopFollow();
    }
  }

  getPosition() {
    return { x: this.camera.scrollX, y: this.camera.scrollY };
  }

  panTo(x, y, callback) {
    this.onPanComplete = callback;
    this.camera.pan(x, y, PAN_SPEED, Phaser.Math.Easing.Cubic.Out, true);
  }

  handlePanComplete() {
    if (this.onPanComplete) {
      const fn = this.onPanComplete;
      this.onPanComplete = null;
      fn();
    }
  }

  stopFollow() {
    this.camera.stopFollow();
  }

  resumeFollow() {
    //TODO ; The camera cannot keep up with the hero owhen falling from height - Gravity huh!
    this.camera.startFollow(this.hero.spine, true, 0.5, 0.1, 0, 120);
  }

  step(time, delta) {
    // const offset = this.hero.direction * -100;
    // const dist = offset - this.scene.cameras.main.followOffset.x;
    // const step = Math.min(Math.abs(dist), this.camSpeed * delta);
    // const dir = Phaser.Math.sign(dist);
    // const target = this.scene.cameras.main.followOffset.x + step * dir;
    // this.scene.cameras.main.setFollowOffset(target, 120);
  }

  destroy() {
    this.scene.sys.game.viewportController.off(
      VIEWPORT_EVENTS.UPDATED,
      this.handleViewUpdate,
      this
    );
    if (this.camera) {
      this.camera.off(Phaser.Cameras.Scene2D.Events.PAN_COMPLETE, this.handlePanComplete, this);
    }
  }
}

const PAN_SPEED = 2000;
