import { isTouchDevice } from '../utils';

/* eslint-disable */
const KEYS = {
  backspace: 8,
  tab: 9,
  enter: 13,
  return: 13,
  shift: 16,
  '⇧': 16,
  control: 17,
  ctrl: 17,
  '⌃': 17,
  alt: 18,
  option: 18,
  '⌥': 18,
  pause: 19,
  capslock: 20,
  esc: 27,
  space: 32,
  pageup: 33,
  pagedown: 34,
  end: 35,
  home: 36,
  left: 37,
  L: 37,
  '←': 37,
  up: 38,
  U: 38,
  '↑': 38,
  right: 39,
  R: 39,
  '→': 39,
  down: 40,
  D: 40,
  '↓': 40,
  insert: 45,
  delete: 46,
  0: 48,
  1: 49,
  2: 50,
  3: 51,
  4: 52,
  5: 53,
  6: 54,
  7: 55,
  8: 56,
  9: 57,
  a: 65,
  b: 66,
  c: 67,
  d: 68,
  e: 69,
  f: 70,
  g: 71,
  h: 72,
  i: 73,
  j: 74,
  k: 75,
  l: 76,
  m: 77,
  n: 78,
  o: 79,
  p: 80,
  q: 81,
  r: 82,
  s: 83,
  t: 84,
  u: 85,
  v: 86,
  w: 87,
  x: 88,
  y: 89,
  z: 90,
  '⌘': 91,
  command: 91,
  kp_0: 96,
  kp_1: 97,
  kp_2: 98,
  kp_3: 99,
  kp_4: 100,
  kp_5: 101,
  kp_6: 102,
  kp_7: 103,
  kp_8: 104,
  kp_9: 105,
  kp_multiply: 106,
  kp_plus: 107,
  kp_minus: 109,
  kp_decimal: 110,
  kp_divide: 111,
  f1: 112,
  f2: 113,
  f3: 114,
  f4: 115,
  f5: 116,
  f6: 117,
  f7: 118,
  f8: 119,
  f9: 120,
  f10: 121,
  f11: 122,
  f12: 123,
  equal: 187,
  '=': 187,
  comma: 188,
  ',': 188,
  minus: 189,
  '-': 189,
  period: 190,
  '.': 190,
};
/* eslint-enable */
const NOOP = () => {};

function attachListener(obj, type, fn) {
  if (obj.addEventListener) {
    obj.addEventListener(type, fn, false);
  } else if (obj.attachEvent) {
    obj['e' + type + fn] = fn;
    obj[type + fn] = function () {
      obj['e' + type + fn](window.event);
    };
    obj.attachEvent('on' + type, obj[type + fn]);
  }
}
function removeListener(obj, type, fn) {
  obj.removeEventListener(type, fn);
}
function createSequence(str, { done = NOOP, next = NOOP, fail = NOOP }) {
  const seq = str.split(' ');
  const keys = seq.map((key) => {
    return KEYS[key];
  });
  return {
    index: 0,
    str,
    next,
    fail,
    done,
    seq,
    keys,
  };
}
function resetSequence(sequence) {
  sequence.index = 0;
}
function handleSequence(sequence, keyCode) {
  const { str, seq, keys, next, fail, done } = sequence;
  const { index: i } = sequence;

  if (keyCode !== keys[i]) {
    if (i > 0) {
      resetSequence(sequence);
      fail(str);
    }
    return;
  }
  sequence.index++;
  next(str, seq[i], i, seq);

  if (sequence.index === keys.length) {
    done(str);
    resetSequence(sequence);
  }
}

export class ShortcutTriggers {
  constructor({ sequence = '↑ ↑ ↓ ↓ ← →', onComplete, onNext, onFail }) {
    this.touchCoords = { startX: null, startY: null, endX: null, endY: null };
    this.bindedNext = this.next.bind(this);
    this.bindedFail = this.fail.bind(this);
    this.bindedComplete = this.complete.bind(this);
    this.bindedKeyDown = this.keydown.bind(this);
    this.bindedKeyUp = this.keyup.bind(this);
    this.bindedTouchStart = this.touchstart.bind(this);
    this.bindedTouchEnd = this.touchend.bind(this);
    this.touchEnabled = isTouchDevice();
    this.sequence = createSequence(sequence, {
      done: onComplete || this.bindedComplete,
      next: onNext || this.bindedNext,
      fail: onFail || this.bindedFail,
    });
    this.enable();
  }

  enable() {
    attachListener(window, 'keydown', this.bindedKeyDown);
    attachListener(window, 'keyup', this.bindedKeyUp);
    if (this.touchEnabled) {
      attachListener(window, 'touchstart', this.bindedTouchStart);
      attachListener(window, 'touchend', this.bindedTouchEnd);
    }
  }

  disable() {
    removeListener(window, 'keydown', this.bindedKeyDown);
    removeListener(window, 'keyup', this.bindedKeyUp);
    if (this.touchEnabled) {
      removeListener(window, 'touchstart', this.bindedTouchStart);
      removeListener(window, 'touchend', this.bindedTouchEnd);
    }
  }

  destroy() {
    this.disable();
    this.sequence = null;
  }

  /*
   * INTERNAL
   */

  /* eslint-disable */
  keydown(e) {}
  /* eslint-enable */

  keyup(e) {
    handleSequence(this.sequence, e.keyCode);
  }

  /*
   * Touch
   */
  touchstart(e) {
    this.touchCoords.startX = e.touches[0].screenX;
    this.touchCoords.startY = e.touches[0].screenY;
  }

  touchend(e) {
    this.touchCoords.endX = e.changedTouches[0].screenX;
    this.touchCoords.endY = e.changedTouches[0].screenY;
    this.determineSwipeDirection(this.touchCoords);
  }

  determineSwipeDirection({ startX, startY, endX, endY }) {
    const threshold = 100; // tweak this value to fine tune swipe detection
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);
    if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
      if (absDeltaY > 1.5 * absDeltaX) {
        if (deltaY > threshold) {
          handleSequence(this.sequence, KEYS.down);
        } else if (deltaY < -threshold) {
          handleSequence(this.sequence, KEYS.up);
        }
      } else if (absDeltaX > 1.5 * absDeltaY) {
        if (deltaX > threshold) {
          handleSequence(this.sequence, KEYS.right);
        } else if (deltaX < -threshold) {
          handleSequence(this.sequence, KEYS.left);
        }
      }
    }
  }

  /* eslint-disable */
  fail(str) {}

  next(str, key, ind, seq) {}

  complete(str) {}
  /* eslint-enable */
}
