export default class HudButtonGroup {
  constructor(scene, { positiondata, viewport }) {
    this.scene = scene;
    this.groupAnchor = positiondata.anchor_group || { x: 0, y: 0 };
    this.screenAnchor = positiondata.anchor_screen || { x: 0, y: 0 };
    this.buttonAlign = positiondata.align_buttons || 0.5;
    this.buttonPadding = 20;
    this.buttons = [];
    this.groupwidth = 0;
    this.groupheight = 0;
    this.viewport = viewport;
  }

  addButtons(buttons) {
    buttons.forEach((button) => {
      this.addButton(button, false);
    });
  }

  addButton(button) {
    if (!this.hasButton(button)) {
      if (this.buttons.length > 0) {
        this.groupwidth += this.buttonPadding;
      }
      this.buttons.push({
        sprite: button,
        groupx: this.groupwidth + button.displayWidth * 0.5,
        groupy: button.displayHeight * 0.5,
      });
      this.groupwidth += button.displayWidth;
      this.groupheight = Math.max(this.groupheight, button.displayHeight);
      this.updatePosition(this.viewport);
    }
  }

  removeButtons(buttons) {
    buttons.forEach((button) => {
      this.removeButton(button, false);
    });
  }

  removeButton(button) {
    const index = this.getButtonIndex(button);
    if (index >= 0) {
      this.buttons.splice(index, 1);
      this.groupwidth -= button.width;
      this.updatePosition(this.viewport);
    }
  }

  clearButtons() {
    this.buttons = [];
    this.groupwidth = 0;
    this.groupheight = 0;
  }

  hasButton(button) {
    return this.getButtonIndex(button) >= 0;
  }

  getButtonIndex(button) {
    return this.buttons.findIndex((groupedbutton) => {
      return groupedbutton.sprite === button;
    });
  }

  updatePosition(viewport) {
    this.viewport = viewport || this.viewport;

    
    this.groupwidth = 0;
    this.groupheight = 0;
    this.buttons.forEach((button) => {
      button.groupx = this.groupwidth + button.sprite.displayWidth * 0.5;
      button.groupy = button.sprite.displayHeight * 0.5;
      this.groupwidth += button.sprite.displayWidth + this.buttonPadding;
      this.groupheight = Math.max(this.groupheight, button.sprite.displayHeight);
    });
    this.groupwidth -= this.buttonPadding;

    const vx = (viewport.width - viewport.padding * 2) * this.screenAnchor.x;
    const gx = this.groupwidth * this.groupAnchor.x;
    const tx = viewport.x + viewport.padding + (vx - gx);

    const vy = (viewport.height - viewport.padding * 2) * this.screenAnchor.y;
    const gy = this.groupheight * this.groupAnchor.y;
    let ty = viewport.y + viewport.padding + (vy - gy);

    if (ty + this.groupheight > viewport.bottomPadded) {
      ty = viewport.bottomPadded - this.groupheight;
    }

    this.buttons.forEach((button) => {
      button.sprite.x = tx + button.groupx;
      button.sprite.y = ty + button.groupy;
      if (this.buttonAlign === 'center') {
        button.sprite.y += this.groupheight * 0.5 - button.sprite.height * 0.5;
      }
    });
  }

  destroy() {
    this.scene = null;
    this.groupAnchor = null;
    this.screenAnchor = null;
    this.buttonAlign = null;
    this.buttonPadding = null;
    this.buttons = null;
    this.groupwidth = null;
    this.groupheight = null;
    this.viewport = null;
  }
}
