import EventEmitter from 'eventemitter3';
import { checkRects, checkPoint } from 'base/objects/Collision';
import { VIEWPORT_EVENTS } from 'base/constants/Events';

export class ViewportControllerBase extends EventEmitter {
  constructor({ game }) {
    super();
    this.game = game;
    this._viewport = { x: 0, y: 0, width: 0, height: 0, padding: 0, paddingBottom: 0 };
    this.game.scale.on('resize', this.updateViewport, this);
    this.updateViewport();
  }

  get viewport() {
    return { ...this._viewport };
  }

  get padding() {
    return this.viewport.padding;
  }

  get paddingBottom() {
    return this.viewport.paddingBottom;
  }

  get width() {
    return this.viewport.width;
  }

  get height() {
    return this.viewport.height;
  }

  get x() {
    return this.viewport.x;
  }

  get y() {
    return this.viewport.y;
  }
  get centerY() {
    return this.y + this.height * 0.5;
  }
  get centerX() {
    return this.x + this.width * 0.5;
  }
  get center() {
    return { x: this.centerX, y: this.centerY };
  }

  get left() {
    return this.x;
  }

  get right() {
    return this.x + this.width;
  }
  get top() {
    return this.y;
  }

  get bottom() {
    return this.y + this.height;
  }

  get rightPadded() {
    return this.right - this.padding;
  }

  get leftPadded() {
    return this.left + this.padding;
  }

  get topPadded() {
    return this.top + this.padding;
  }

  get bottomPadded() {
    return this.bottom - this.paddingBottom;
  }

  get isLandscape() {
    return this.width >= this.height;
  }

  updateViewport() {
    const windowAspect = this.game.scale.parentSize.aspectRatio;
    const height = this.game.defaultDimensions.height;
    const width = Math.min(
      this.game.defaultDimensions.width,
      this.game.defaultDimensions.height * windowAspect
    );
    const x = Math.max(0, this.game.defaultDimensions.width * 0.5 - width * 0.5);
    const y = Math.max(0, this.game.defaultDimensions.height * 0.5 - height * 0.5);
    const padding = Math.max(width * 0.02, height * 0.02);
    let paddingBottom = padding;

    // add a 32pixel botttom padding on iphone mobiles due to brim...
    if (window.innerWidth <= 568 && window.devicePixelRatio === 2) {
      paddingBottom = 32 / (this.game.canvas.clientHeight / height);
    }

    this._viewport.x = x;
    this._viewport.y = y;
    this._viewport.width = width;
    this._viewport.height = height;
    this._viewport.padding = padding;
    this._viewport.paddingBottom = paddingBottom;
    this._viewport.landscape = width >= height;

    this.emit(VIEWPORT_EVENTS.UPDATED, this._viewport);
  }

  overlapsViewport(rect) {
    return checkRects(rect, this);
  }

  isWithinViewport(x, y) {
    return checkPoint(x, y, this);
  }

  destroy() {
    this.game.scale.off('resize', this.updateViewport, this);
  }
}
